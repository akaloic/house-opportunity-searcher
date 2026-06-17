"""Pipeline : scrape -> filtres stricts -> enrichissement -> scoring -> dédup -> alerte.

Mode dégradé partout : si une source d'enrichissement tombe, l'annonce est quand même
scorée (sous-scores neutralisés) — on ne rate jamais une pépite sur un bug d'enrichissement.
"""

from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass, field
from datetime import date, datetime

from chasseur.alerting.notifier import Notifier
from chasseur.config import Settings
from chasseur.enrich.defense import estimate_defense_minutes
from chasseur.enrich.dvf import MarketReference, StaticMarketReference
from chasseur.enrich.nlp import analyze_text
from chasseur.enrich.transport import (
    StaticGPEReference,
    WebSearchProvider,
    build_search_provider,
    build_transport_context,
)
from chasseur.enrich.travaux import estimate_renovation
from chasseur.models import EnrichedContext, Listing, Score
from chasseur.scoring import score_listing
from chasseur.scrapers.base import AntibotNotConfigured, ScrapeQuery, ScraperError
from chasseur.scrapers.registry import build_scraper
from chasseur.storage.db import SQLiteStore


@dataclass
class ScoredListing:
    listing: Listing
    context: EnrichedContext
    score: Score


@dataclass
class RunSummary:
    scanned: int = 0
    kept: int = 0
    scored: int = 0
    alerts: int = 0
    excluded_budget: int = 0
    excluded_filters: dict[str, int] = field(default_factory=dict)
    by_source: dict[str, dict[str, object]] = field(default_factory=dict)
    logs: list[dict[str, str]] = field(default_factory=list)
    outbox: list[str] = field(default_factory=list)  # messages d'alerte (dry-run)


@dataclass
class Refs:
    market: MarketReference
    gpe: StaticGPEReference
    search: WebSearchProvider


def build_refs(settings: Settings) -> Refs:
    market: MarketReference
    if settings.market_source == "dvf":
        from chasseur.enrich.dvf import DVFGeoReference

        market = DVFGeoReference(
            cache_dir=settings.dvf_cache_dir,
            year=settings.dvf_year,
            radius_m=settings.dvf_radius_m,
            min_points=settings.dvf_min_points,
        )
    else:
        market = StaticMarketReference.from_file(settings.market_medians_path)
    return Refs(
        market=market,
        gpe=StaticGPEReference.from_file(settings.gpe_path),
        search=build_search_provider(settings.search),
    )


def effective_has_balcony(listing: Listing, settings: Settings) -> bool:
    """Vrai si l'annonce a un balcon : donnée structurée si dispo, sinon détection texte."""
    if listing.has_balcony is not None:
        return listing.has_balcony
    text = f"{listing.title} {listing.description}".lower()
    return any(kw.lower() in text for kw in settings.balcony_keywords)


_FLOOR_RE = re.compile(r"(\d{1,2})\s*(?:er|eme|ere|re|e)?\s*etage")


def _strip_accents(text: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn"
    )


def infer_floor_from_text(text: str, settings: Settings) -> int | None:
    """Déduit l'étage du TEXTE (RDC / 1er / Nᵉ étage) quand la donnée structurée manque."""
    normalized = _strip_accents(text).lower()
    if any(kw in normalized for kw in settings.ground_floor_keywords):
        return 0
    if any(kw in normalized for kw in settings.first_floor_keywords):
        return 1
    match = _FLOOR_RE.search(normalized)
    return int(match.group(1)) if match else None


def effective_floor(listing: Listing, settings: Settings) -> int | None:
    """Étage retenu : structuré en priorité, sinon déduit du texte de l'annonce."""
    if listing.floor is not None:
        return listing.floor
    return infer_floor_from_text(f"{listing.title} {listing.description}", settings)


def passes_filters(listing: Listing, settings: Settings) -> tuple[bool, str | None]:
    """Exclusion ferme AVANT scoring (l'investisseur ne perd pas de temps).

    Critères disqualifiants (tous pilotés par la config) : type de bien (apparts),
    étage plancher (RDC/1er exclus si connu), balcon obligatoire, budget, surface.
    """
    if (
        settings.allowed_property_types
        and listing.property_type.value not in settings.allowed_property_types
    ):
        return False, "type"
    floor = effective_floor(listing, settings)
    if floor is None:
        if settings.exclude_unknown_floor:
            return False, "floor_unknown"
    elif floor < settings.min_floor:
        return False, "floor"
    if settings.require_balcony and not effective_has_balcony(listing, settings):
        return False, "balcony"
    if listing.price > settings.budget_max:
        return False, "budget"
    if listing.surface_m2 < settings.surface_min:
        return False, "surface_min"
    if listing.surface_m2 > settings.surface_max:
        return False, "surface_max"
    return True, None


def enrich_listing(
    listing: Listing, refs: Refs, settings: Settings, as_of: date
) -> EnrichedContext:
    market_ppm2 = refs.market.median_ppm2(listing)
    signals = analyze_text(f"{listing.title} {listing.description}", settings.lexicon)
    renovation = estimate_renovation(listing, settings.renovation)
    defense_minutes = estimate_defense_minutes(listing, settings.scoring)
    transport = build_transport_context(
        listing,
        refs.gpe,
        max_radius_m=settings.scoring.transport_max_radius_m,
        defense_minutes=defense_minutes,
        search_provider=refs.search,
    )
    return EnrichedContext(
        market_ppm2=market_ppm2,
        seller_signals=signals,
        renovation=renovation,
        transport=transport,
    )


def _event(level: str, source: str, message: str, now: datetime) -> dict[str, str]:
    return {"time": now.strftime("%H:%M:%S"), "level": level, "source": source, "message": message}


def run_pipeline(
    settings: Settings,
    *,
    demo: bool = False,
    scrapers: list[str] | None = None,
    refs: Refs | None = None,
    max_results: int = 60,
    as_of: date | None = None,
    now: datetime | None = None,
    store: SQLiteStore | None = None,
    notify: bool = True,
) -> tuple[list[ScoredListing], RunSummary]:
    now = now or datetime.now()
    as_of = as_of or now.date()
    refs = refs or build_refs(settings)
    own_store = store is None
    store = store or SQLiteStore(settings.db_path)
    notifier = Notifier(settings.alert, store)

    if scrapers is not None:
        scraper_names = scrapers
    elif demo:
        scraper_names = ["sample"]
    else:
        scraper_names = settings.enabled_scrapers
    threshold = settings.scoring.alert_threshold
    query = ScrapeQuery(
        postal_codes=list(settings.target_postal_codes),
        price_max=settings.budget_max,
        surface_min=settings.surface_min,
        surface_max=settings.surface_max,
        max_results=max_results,
    )

    results: list[ScoredListing] = []
    summary = RunSummary()

    try:
        for name in scraper_names:
            src: dict[str, object] = {
                "scanned": 0,
                "kept": 0,
                "alerts": 0,
                "blocked": 0,
                "status": "online",
            }
            summary.by_source[name] = src
            try:
                scraper = build_scraper(name, settings)
                listings = list(scraper.fetch_listings(query))
            except AntibotNotConfigured as exc:
                src["status"] = "offline"
                summary.logs.append(_event("warn", name, f"non configuré : {exc}", now))
                continue
            except ScraperError as exc:
                src["status"] = "blocked"
                src["blocked"] = int(src["blocked"]) + 1
                summary.logs.append(_event("error", name, str(exc), now))
                continue

            for listing in listings:
                summary.scanned += 1
                src["scanned"] = int(src["scanned"]) + 1
                ok, reason = passes_filters(listing, settings)
                if not ok:
                    if reason == "budget":
                        summary.excluded_budget += 1
                    if reason:
                        summary.excluded_filters[reason] = (
                            summary.excluded_filters.get(reason, 0) + 1
                        )
                    summary.logs.append(
                        _event("debug", name, f"{listing.source_id} exclu ({reason})", now)
                    )
                    continue

                summary.kept += 1
                src["kept"] = int(src["kept"]) + 1
                store.upsert(listing, now)
                ctx = enrich_listing(listing, refs, settings, as_of)
                score = score_listing(listing, ctx, settings.scoring, as_of=as_of)
                summary.scored += 1
                results.append(ScoredListing(listing, ctx, score))

                level = "ok" if score.total >= threshold else "info"
                summary.logs.append(
                    _event(
                        level,
                        name,
                        f"{listing.source_id} scoré {score.total:.0f} ({score.level.value})",
                        now,
                    )
                )
                if notify and score.total >= threshold and notifier.maybe_notify(
                    listing, score, ctx, now
                ):
                    summary.alerts += 1
                    src["alerts"] = int(src["alerts"]) + 1
    finally:
        if own_store:
            store.close()

    summary.outbox = list(notifier.outbox)
    results.sort(key=lambda item: item.score.total, reverse=True)
    return results, summary

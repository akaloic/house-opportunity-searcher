"""Adapter : sortie réelle du pipeline -> window.PEPITE_DATA (design Pépite).

Le design (ui_kits/pepite-dashboard) consomme un contrat générique
``{ CRITERIA, WEIGHTS, LISTINGS, SOURCES, LOGS }`` où les vues itèrent sur ``CRITERIA``.
On y injecte donc NOS 7 vrais axes de scoring : le radar et la justification du score
reflètent le moteur réel, pas une taxonomie inventée.
"""

from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path

from chasseur.config import Settings
from chasseur.models import Source
from chasseur.pipeline import RunSummary, ScoredListing

# Nos 7 critères réels (mêmes clés que Score.sub_scores). icônes/accents = design tokens.
CRITERIA: list[dict[str, str]] = [
    {"key": "decote", "label": "Décote vs marché (DVF)", "short": "Décote", "icon": "euro", "accent": "var(--viz-1)"},
    {"key": "futur_transport", "label": "Transport futur (Grand Paris)", "short": "GPE", "icon": "route", "accent": "var(--viz-2)"},
    {"key": "signaux_vendeur", "label": "Signaux vendeur (NLP)", "short": "Vendeur", "icon": "zap", "accent": "var(--viz-6)"},
    {"key": "anciennete", "label": "Ancienneté / levier négo", "short": "Négo", "icon": "history", "accent": "var(--viz-3)"},
    {"key": "dpe_travaux", "label": "DPE / déficit foncier", "short": "DPE", "icon": "leaf", "accent": "var(--viz-8)"},
    {"key": "charges", "label": "Charges copropriété", "short": "Charges", "icon": "layers", "accent": "var(--viz-5)"},
    {"key": "acces_actuel", "label": "Accès transports actuel", "short": "Accès", "icon": "train", "accent": "var(--brand-500)"},
]

_SOURCE_LABEL: dict[Source, str] = {
    Source.sample: "Échantillon",
    Source.leboncoin: "Leboncoin",
    Source.seloger: "SeLoger",
    Source.bienici: "Bien'ici",
    Source.pap: "PAP",
}
# Statuts alignés sur le vocabulaire du design (StatusDot) : online/idle/warning/blocked.
_PORTALS = ["sample", "leboncoin", "seloger", "bienici", "pap"]
_STATUS_MAP = {"online": "online", "offline": "idle", "blocked": "blocked"}


def _project(lat: float | None, lon: float | None) -> tuple[int, int]:
    """Projette lat/lon sur la carte stylisée (0-100). Indicatif, pas géographique."""
    if lat is None or lon is None:
        return 50, 50
    x = (lon - 1.9) / (2.7 - 1.9) * 100
    y = (49.0 - lat) / (49.0 - 48.75) * 100
    return int(max(4, min(96, x))), int(max(4, min(96, y)))


def _fresh_minutes(published: datetime | None, now: datetime) -> int:
    if published is None:
        return 0
    return max(0, int((now - published).total_seconds() // 60))


def _tags(sl: ScoredListing) -> list[str]:
    listing, ctx, score = sl.listing, sl.context, sl.score
    tags: list[str] = []
    if score.total >= 80:
        tags.append("Pépite")
    if score.decote_pct is not None and score.decote_pct >= 0.05:
        tags.append("Sous le marché")
    if (listing.dpe or "").upper() == "G":
        tags.append("Passoire (G)")
    if listing.price_drops() >= 2:
        tags.append("Vendeur qui craque")
    elif ctx.transport.nearest_future() is not None:
        tags.append("Future gare")
    return tags[:3]


def _map_listing(sl: ScoredListing, settings: Settings, now: datetime) -> dict[str, object]:
    listing, ctx, score = sl.listing, sl.context, sl.score
    neutral = settings.scoring.neutral_value
    crit = {
        c["key"]: round((score.sub_scores.get(c["key"]) or neutral) * 100)
        if score.sub_scores.get(c["key"]) is not None
        else round(neutral * 100)
        for c in CRITERIA
    }
    metro = [
        {"line": st.line.split()[0], "name": st.name, "min": max(1, round(st.distance_m / 80))}
        for st in ctx.transport.future_stations[:3]
    ]
    x, y = _project(listing.lat, listing.lon)
    floor = listing.floor or 0
    photos = int(listing.raw.get("photos", 0)) if isinstance(listing.raw.get("photos"), int) else 0
    return {
        "id": listing.source_id,
        "score": round(score.total),
        "title": listing.title,
        "addr": f"{listing.city or ''} {listing.postal_code or ''}".strip() or listing.title,
        "quartier": listing.city or listing.postal_code or "—",
        "price": round(listing.price),
        "surface": round(listing.surface_m2),
        "rooms": listing.rooms or 0,
        "floor": floor,
        "floors": floor,
        "ppm2": round(listing.price_per_m2),
        "marketPpm2": round(ctx.market_ppm2) if ctx.market_ppm2 else round(listing.price_per_m2),
        "dpe": listing.dpe or "—",
        "source": _SOURCE_LABEL.get(listing.source, listing.source.value),
        "freshMin": _fresh_minutes(listing.published_at, now),
        "photos": photos,
        "metro": metro,
        "crit": crit,
        "x": x,
        "y": y,
        "tags": _tags(sl),
        "fav": False,
    }


def _sources(summary: RunSummary, settings: Settings) -> list[dict[str, object]]:
    proxy = "FR-residential" if settings.antibot.proxies else "direct"
    out: list[dict[str, object]] = []
    for key in _PORTALS:
        stats = summary.by_source.get(key)
        label = _SOURCE_LABEL.get(Source(key), key)
        if stats is None:
            out.append({"name": label, "status": "idle", "scanned": 0, "found": 0, "blocked": 0, "latency": 0, "proxy": "—"})
        else:
            out.append({
                "name": label,
                "status": _STATUS_MAP.get(str(stats["status"]), "warning"),
                "scanned": stats["scanned"],
                "found": stats["kept"],
                "blocked": stats["blocked"],
                "latency": 0,
                "proxy": proxy,
            })
    return out


def build_pepite_data(
    results: list[ScoredListing], summary: RunSummary, settings: Settings, now: datetime
) -> dict[str, object]:
    weights = {k: round(v * 100) for k, v in settings.scoring.weights.normalized().items()}
    return {
        "CRITERIA": CRITERIA,
        "WEIGHTS": weights,
        "LISTINGS": [_map_listing(sl, settings, now) for sl in results],
        "SOURCES": _sources(summary, settings),
        "LOGS": list(reversed(summary.logs))[:14],
    }


def render_data_js(data: dict[str, object]) -> str:
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    return (
        "/* Généré par `chasseur export-web` — données RÉELLES du pipeline. Ne pas éditer. */\n"
        f"window.PEPITE_DATA = {payload};\n"
        "window.fmtEur = (n) => n.toLocaleString('fr-FR');\n"
        "window.fmtAgo = (m) => m < 60 ? `${m} min` : m < 1440 ? `${Math.round(m/60)} h` "
        ": `${Math.round(m/1440)} j`;\n"
    )


def write_data_live(
    path: str | Path,
    results: list[ScoredListing],
    summary: RunSummary,
    settings: Settings,
    now: datetime,
) -> Path:
    out = Path(path)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(render_data_js(build_pepite_data(results, summary, settings, now)), encoding="utf-8")
    return out

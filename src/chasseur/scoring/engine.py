"""Combinaison pondérée des sous-scores -> Score final 0-100 + reco d'action.

Fonction pure : ``score_listing(listing, ctx, cfg)`` n'a besoin d'aucun réseau.
Le mode dégradé (sous-score manquant) est géré par ``missing_subscore_policy``.
"""

from __future__ import annotations

from datetime import date

from chasseur.config import ScoringConfig
from chasseur.models import EnrichedContext, Listing, Score
from chasseur.scoring import subscores as ss
from chasseur.scoring.recommend import build_recommendation, suggest_offer, urgency_level


def _combine(values: dict[str, float | None], weights: dict[str, float], cfg: ScoringConfig) -> float:
    """Somme pondérée, en gérant les sous-scores absents selon la politique config."""
    if cfg.missing_subscore_policy == "exclude":
        present = {k: v for k, v in values.items() if v is not None}
        weight_sum = sum(weights[k] for k in present)
        if weight_sum <= 0:
            return 0.0
        return sum(v * weights[k] for k, v in present.items()) / weight_sum
    # "neutral" : un sous-score absent vaut neutral_value (par défaut 0.5)
    total = 0.0
    for key, weight in weights.items():
        value = values.get(key)
        total += weight * (cfg.neutral_value if value is None else value)
    return total


def _estimate_yield(listing: Listing, full_cost: float, cfg: ScoringConfig) -> float | None:
    """Rendement locatif net GROSSIER (placeholder) si un loyer/m² est configuré."""
    if cfg.rent_per_m2_month is None or full_cost <= 0:
        return None
    annual_rent = cfg.rent_per_m2_month * listing.surface_m2 * 12.0
    net = annual_rent - (listing.charges_annual or 0.0) - (listing.property_tax_annual or 0.0)
    return round(net / full_cost, 4)


def _context_flags(
    listing: Listing, ctx: EnrichedContext, decote_pct: float | None
) -> list[str]:
    flags: list[str] = []
    if decote_pct is not None and ctx.market_ppm2:
        flags.append(
            f"Décote {decote_pct * 100:+.0f}% vs médiane micro-quartier "
            f"{ctx.market_ppm2:.0f} EUR/m2 (DVF)"
        )
    nearest_future = ctx.transport.nearest_future()
    if nearest_future is not None:
        flags.append(
            f"Future gare {nearest_future.name} ({nearest_future.line}) à "
            f"{nearest_future.distance_m:.0f} m, ouverture ~{nearest_future.opening_year}"
        )
    if listing.geocode_confidence is not None and listing.geocode_confidence < 0.6:
        flags.append("⚠️ Géocodage incertain — décote à fiabiliser avant de s'emballer")
    return flags


def score_listing(
    listing: Listing,
    ctx: EnrichedContext,
    cfg: ScoringConfig,
    *,
    as_of: date | None = None,
) -> Score:
    as_of = as_of or date.today()
    year = as_of.year
    flags: list[str] = []

    s_decote, decote_pct = ss.decote_subscore(listing, ctx.market_ppm2, cfg)
    if s_decote is None:
        flags.append("Décote non calculée (médiane DVF ou géocodage manquant)")

    s_futur = ss.futur_transport_subscore(ctx.transport, cfg, year)
    s_signaux = ss.signaux_subscore(ctx.seller_signals)

    s_anc = ss.anciennete_subscore(listing, cfg, as_of)
    if s_anc is None:
        flags.append("Ancienneté inconnue (date de publication absente)")

    s_dpe, dpe_flags = ss.dpe_subscore(listing, cfg)
    flags.extend(dpe_flags)

    s_charges, charges_flags = ss.charges_subscore(listing, cfg)
    flags.extend(charges_flags)
    if s_charges is None:
        flags.append("Charges de copropriété non renseignées")

    s_acces = ss.acces_actuel_subscore(ctx.transport, cfg, year)

    sub_scores: dict[str, float | None] = {
        "decote": s_decote,
        "futur_transport": s_futur,
        "signaux_vendeur": s_signaux,
        "anciennete": s_anc,
        "dpe_travaux": s_dpe,
        "charges": s_charges,
        "acces_actuel": s_acces,
    }
    weights = cfg.weights.normalized()
    brut = _combine(sub_scores, weights, cfg) * 100.0

    multiplier, defense_flags = ss.defense_multiplier(ctx.transport, cfg)
    flags.extend(defense_flags)
    total = ss.clamp(brut * multiplier, 0.0, 100.0)

    works = ctx.renovation.total_cost if ctx.renovation is not None else 0.0
    full_cost = listing.price + works + listing.price * cfg.notaire_rate
    effective_ppm2 = full_cost / listing.surface_m2

    level = urgency_level(total, cfg)
    discount = suggest_offer(listing, ctx, cfg, as_of)
    offer_price = round(listing.price * (1.0 - discount))
    recommendation = build_recommendation(listing, ctx, level, discount, offer_price, as_of)

    flags = _context_flags(listing, ctx, decote_pct) + flags

    return Score(
        total=round(total, 1),
        level=level,
        sub_scores=sub_scores,
        weights={k: round(v, 4) for k, v in weights.items()},
        defense_multiplier=round(multiplier, 3),
        decote_pct=round(decote_pct, 4) if decote_pct is not None else None,
        full_cost=round(full_cost),
        effective_ppm2=round(effective_ppm2),
        net_yield=_estimate_yield(listing, full_cost, cfg),
        suggested_offer_price=offer_price,
        suggested_discount=round(discount, 3),
        flags=flags,
        recommendation=recommendation,
    )

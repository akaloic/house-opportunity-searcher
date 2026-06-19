"""Génération de la reco d'action et de l'offre d'attaque — pur, donc testable."""

from __future__ import annotations

from datetime import date

from chasseur.config import ScoringConfig
from chasseur.models import EnrichedContext, Listing, UrgencyLevel
from chasseur.scoring.subscores import days_online

_STRONG_URGENCY = {
    "succession",
    "cause mutation",
    "mutation professionnelle",
    "divorce",
    "separation",
    "depart etranger",
    "depart a l etranger",
}


def urgency_level(total: float, cfg: ScoringConfig) -> UrgencyLevel:
    if total >= cfg.level_pepite:
        return UrgencyLevel.pepite
    if total >= cfg.level_hot:
        return UrgencyLevel.hot
    if total >= cfg.level_interesting:
        return UrgencyLevel.interesting
    return UrgencyLevel.watch


def suggest_offer(
    listing: Listing, ctx: EnrichedContext, cfg: ScoringConfig, as_of: date
) -> float:
    """Décote à proposer SOUS le prix affiché, cumulée selon les leviers détectés."""
    discount = cfg.offer_base
    if any(word in _STRONG_URGENCY for word in ctx.seller_signals.matched_urgency):
        discount += cfg.offer_bonus_urgency
    days = days_online(listing, as_of) or 0
    if days >= 120:
        discount += cfg.offer_bonus_stale_120
    elif days >= 60:
        discount += cfg.offer_bonus_stale_60
    if listing.price_drops() >= 2:
        discount += cfg.offer_bonus_price_drops
    dpe = (listing.dpe or "").upper()
    if dpe == "G":
        discount += cfg.offer_bonus_dpe_g
    elif dpe == "F":
        discount += cfg.offer_bonus_dpe_f
    if listing.diffusion_count >= 3:
        discount += cfg.offer_bonus_multidiffusion
    if listing.is_professional is False:
        discount += cfg.offer_bonus_particulier
    return min(discount, cfg.offer_max)


def _eur(amount: float) -> str:
    return f"{round(amount):,}".replace(",", " ") + " EUR"


def build_recommendation(
    listing: Listing,
    ctx: EnrichedContext,
    level: UrgencyLevel,
    discount: float,
    offer_price: float,
    as_of: date,
) -> str:
    """Assemble la phrase d'action chiffrée — le 'coup de poing' de l'expert."""
    opener = {
        UrgencyLevel.pepite: "Appelle dans les 5 min, bloque une visite aujourd'hui.",
        UrgencyLevel.hot: "Appelle aujourd'hui, cale une visite sous 48h.",
        UrgencyLevel.interesting: (
            "À surveiller — recontacte si le prix bouge ou si une visite se libère."
        ),
        UrgencyLevel.watch: "Veille passive : pas prioritaire en l'état.",
    }[level]

    leviers: list[str] = []
    if ctx.seller_signals.matched_urgency:
        leviers.append("signaux vendeur (" + ", ".join(ctx.seller_signals.matched_urgency) + ")")
    days = days_online(listing, as_of)
    if days is not None and days >= 60:
        leviers.append(f"en ligne depuis {days} j")
    drops = listing.price_drops()
    if drops >= 2:
        leviers.append(f"{drops} baisses de prix")
    dpe = (listing.dpe or "").upper()
    if dpe in ("F", "G"):
        leviers.append(f"DPE {dpe}")
    if listing.diffusion_count >= 3:
        leviers.append(f"multi-diffusion x{listing.diffusion_count}")
    if listing.is_professional is False:
        leviers.append("vente de particulier")

    offer = f"Offre d'attaque -{discount * 100:.0f}% ({_eur(offer_price)})"
    if leviers:
        offer += " — justifiée par " + " + ".join(leviers)

    parts = [opener, offer + "."]
    if ctx.renovation is not None and ctx.renovation.total_cost > 0:
        parts.append(
            f"Budget travaux estimé ~{_eur(ctx.renovation.total_cost)} ({ctx.renovation.notes})."
        )
    if dpe == "G":
        parts.append(
            "Attention : non louable en l'état, monter le dossier sur la revente ou la rénovation."
        )
    return " ".join(parts)

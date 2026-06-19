"""Mise en forme de l'alerte — pur, donc testable. C'est le 'coup de poing' de l'expert."""

from __future__ import annotations

from chasseur.models import EnrichedContext, Listing, Score, UrgencyLevel

_BADGE: dict[UrgencyLevel, str] = {
    UrgencyLevel.pepite: "💎🔥",
    UrgencyLevel.hot: "🔥",
    UrgencyLevel.interesting: "👀",
    UrgencyLevel.watch: "📌",
}


def _eur(amount: float) -> str:
    return f"{round(amount):,}".replace(",", " ")


def format_subject(listing: Listing, score: Score) -> str:
    badge = _BADGE.get(score.level, "")
    where = listing.city or listing.postal_code or ""
    return f"{badge} {score.total:.0f}/100 — {listing.title} · {where}".strip()


def format_alert(listing: Listing, score: Score, ctx: EnrichedContext) -> str:
    badge = _BADGE.get(score.level, "")
    where_parts = [listing.city, f"({listing.postal_code})" if listing.postal_code else None]
    where = " ".join(part for part in where_parts if part)
    lines = [
        f"{badge} {score.level.value.upper()} — Score {score.total:.0f}/100 — {where}".strip(),
        f"{listing.title}",
        f"{_eur(listing.price)} € · {_eur(listing.price_per_m2)} €/m²"
        + (f" · revient à {_eur(score.effective_ppm2)} €/m²" if score.effective_ppm2 else ""),
    ]
    for flag in score.flags[:6]:
        lines.append(f"• {flag}")
    lines.append(f"🎯 {score.recommendation}")
    if listing.url:
        lines.append(f"🔗 {listing.url}")
    return "\n".join(lines)

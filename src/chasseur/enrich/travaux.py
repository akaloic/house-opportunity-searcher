"""Estimation des travaux 'à la louche' à partir des mots-clés de l'annonce.

On raisonne TOUJOURS en coût de revient (prix + travaux + notaire), jamais en prix
affiché. Un bien décoté qui cache 80 k€ de travaux n'est pas une affaire.
"""

from __future__ import annotations

from chasseur.config import RenovationConfig
from chasseur.enrich.nlp import normalize
from chasseur.models import Condition, Listing, RenovationEstimate

# Ordre IMPORTANT : du plus spécifique au plus générique ('à rénover entièrement'
# doit primer sur 'à rénover').
_CONDITION_KEYWORDS: list[tuple[Condition, tuple[str, ...]]] = [
    (Condition.new, ("refait a neuf", "neuf", "entierement renove", "renove avec gout",
                     "aucun travaux", "etat impeccable", "prestations haut de gamme")),
    (Condition.gut, ("a renover entierement", "gros travaux", "tout a refaire",
                     "a rehabiliter", "insalubre")),
    (Condition.renovate, ("a renover", "travaux a prevoir", "travaux importants",
                          "a moderniser")),
    (Condition.refresh, ("a rafraichir", "quelques travaux", "coup de peinture",
                        "rafraichissement", "petits travaux")),
]

_NOTES: dict[Condition, str] = {
    Condition.new: "rien à prévoir",
    Condition.good: "état correct, aléa travaux faible",
    Condition.refresh: "rafraîchissement (peinture, sols)",
    Condition.renovate: "rénovation à prévoir",
    Condition.gut: "rénovation lourde / tout à refaire",
}


def infer_condition(text: str) -> Condition:
    norm = normalize(text)
    for condition, keywords in _CONDITION_KEYWORDS:
        if any(keyword in norm for keyword in keywords):
            return condition
    return Condition.good


def estimate_renovation(listing: Listing, cfg: RenovationConfig) -> RenovationEstimate:
    condition = infer_condition(f"{listing.title} {listing.description}")
    cost_per_m2 = cfg.cost_per_m2.get(condition.value, 0.0)
    return RenovationEstimate(
        condition=condition,
        cost_per_m2=cost_per_m2,
        total_cost=cost_per_m2 * listing.surface_m2,
        notes=_NOTES[condition],
    )

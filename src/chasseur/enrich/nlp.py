"""NLP 'simple mais redoutable' : lexique pondéré, insensible aux accents.

Pas besoin d'un gros LLM pour lire entre les lignes d'une annonce : un lexique bien
pondéré attrape les vendeurs pressés et les loups. Pur => testable hors-ligne.
"""

from __future__ import annotations

import unicodedata

from chasseur.config import LexiconConfig
from chasseur.models import SellerSignals


def normalize(text: str) -> str:
    """Minuscule, sans accents, apostrophes/espaces uniformisés."""
    lowered = text.lower().replace("’", " ").replace("'", " ")
    decomposed = unicodedata.normalize("NFKD", lowered)
    stripped = "".join(ch for ch in decomposed if not unicodedata.combining(ch))
    return " ".join(stripped.split())


def analyze_text(text: str, lexicon: LexiconConfig) -> SellerSignals:
    """Détecte signaux d'urgence (levier de négo) et red flags (loups)."""
    norm = normalize(text)

    matched_urgency = [phrase for phrase in lexicon.urgency if phrase in norm]
    urgency_raw = sum(lexicon.urgency[phrase] for phrase in matched_urgency)

    matched_redflags = [phrase for phrase in lexicon.redflags if phrase in norm]
    redflag_raw = sum(lexicon.redflags[phrase] for phrase in matched_redflags)

    return SellerSignals(
        urgency_score=min(urgency_raw, lexicon.cap_urgency),
        redflag_penalty=min(redflag_raw, lexicon.cap_redflag),
        matched_urgency=matched_urgency,
        matched_redflags=matched_redflags,
    )

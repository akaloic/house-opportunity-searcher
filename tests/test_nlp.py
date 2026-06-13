from __future__ import annotations

from chasseur.config import LexiconConfig
from chasseur.enrich.nlp import analyze_text, normalize


def test_normalize_strips_accents_and_apostrophes() -> None:
    assert normalize("RénOvé à l'Étranger") == "renove a l etranger"


def test_detects_urgency_and_redflags_despite_accents() -> None:
    lex = LexiconConfig()
    signals = analyze_text(
        "Cause mutation professionnelle, à débattre. Souplex atypique avec vis-à-vis.", lex
    )
    assert "cause mutation" in signals.matched_urgency
    assert signals.urgency_score > 0
    assert "souplex" in signals.matched_redflags
    assert signals.redflag_penalty > 0


def test_scores_are_capped() -> None:
    lex = LexiconConfig()
    signals = analyze_text(
        "succession divorce urgent vente rapide prix en baisse libre rapidement", lex
    )
    assert signals.urgency_score <= lex.cap_urgency

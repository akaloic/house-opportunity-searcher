from __future__ import annotations

from datetime import date

from chasseur.alerting.formatter import format_alert, format_subject
from chasseur.config import ScoringConfig
from chasseur.scoring import score_listing


def test_alert_contains_action_and_location(pepite, as_of: date) -> None:
    listing, ctx = pepite
    score = score_listing(listing, ctx, ScoringConfig(), as_of=as_of)

    message = format_alert(listing, score, ctx)
    assert "Score" in message
    assert "🎯" in message  # ligne d'action
    assert "Courbevoie" in message
    assert "€/m²" in message

    subject = format_subject(listing, score)
    assert "/100" in subject
    assert "Courbevoie" in subject

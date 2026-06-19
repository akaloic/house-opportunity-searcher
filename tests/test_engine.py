from __future__ import annotations

from datetime import date

from chasseur.config import ScoringConfig
from chasseur.models import EnrichedContext, Listing, Source
from chasseur.scoring import score_listing

_SUBSCORE_KEYS = {
    "decote",
    "futur_transport",
    "signaux_vendeur",
    "anciennete",
    "dpe_travaux",
    "charges",
    "acces_actuel",
}


def test_pepite_scores_high_and_caps_offer(pepite, as_of: date) -> None:
    listing, ctx = pepite
    cfg = ScoringConfig()
    score = score_listing(listing, ctx, cfg, as_of=as_of)

    assert score.total >= 75
    assert score.level.value in ("hot", "pepite")
    # leviers cumulés (mutation + ancienneté + 2 baisses + DPE F + multidiffusion + particulier)
    assert score.suggested_discount == cfg.offer_max
    assert score.suggested_offer_price == round(268000 * (1 - cfg.offer_max))
    assert score.decote_pct is not None and score.decote_pct > 0.15
    assert set(score.sub_scores) == _SUBSCORE_KEYS
    assert "🎯" not in score.recommendation  # la reco est du texte, l'emoji est ajouté au formatage


def test_missing_subscores_are_neutral_and_safe(as_of: date) -> None:
    listing = Listing(
        source=Source.sample, source_id="bare", title="x", price=200000, surface_m2=40
    )
    ctx = EnrichedContext()  # ni marché, ni transport (unchecked), ni charges
    score = score_listing(listing, ctx, ScoringConfig(), as_of=as_of)

    assert 0 <= score.total <= 100
    assert score.sub_scores["decote"] is None
    assert score.defense_multiplier == 1.0
    assert any("Décote" in f for f in score.flags)


def test_weights_recorded_and_normalized(pepite, as_of: date) -> None:
    listing, ctx = pepite
    score = score_listing(listing, ctx, ScoringConfig(), as_of=as_of)
    assert set(score.weights) == _SUBSCORE_KEYS
    assert abs(sum(score.weights.values()) - 1.0) < 1e-6

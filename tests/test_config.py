from __future__ import annotations

from chasseur.config import ScoringWeights, Settings


def test_defaults() -> None:
    settings = Settings()
    assert settings.budget_max == 310_000
    assert settings.scoring.alert_threshold == 70


def test_weights_normalized_sum_to_one() -> None:
    normalized = ScoringWeights().normalized()
    assert abs(sum(normalized.values()) - 1.0) < 1e-9
    # la décote reste le poids dominant
    assert max(normalized, key=normalized.__getitem__) == "decote"


def test_env_override(monkeypatch) -> None:
    monkeypatch.setenv("CHASSEUR_BUDGET_MAX", "250000")
    monkeypatch.setenv("CHASSEUR_SCORING__DECOTE_TARGET", "0.2")
    settings = Settings()
    assert settings.budget_max == 250_000
    assert settings.scoring.decote_target == 0.2


def test_horizon_factor_decreasing() -> None:
    cfg = Settings().scoring
    assert cfg.horizon_factor(1) == 1.0
    assert cfg.horizon_factor(3) == 0.7
    assert cfg.horizon_factor(6) == 0.4
    assert cfg.horizon_factor(20) == cfg.horizon_default_factor

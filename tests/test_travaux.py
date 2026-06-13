from __future__ import annotations

from chasseur.config import RenovationConfig
from chasseur.enrich.travaux import estimate_renovation, infer_condition
from chasseur.models import Condition, Listing, Source


def _listing(**kwargs: object) -> Listing:
    base: dict[str, object] = dict(
        source=Source.sample, source_id="x", price=300000, surface_m2=50, title="", description=""
    )
    base.update(kwargs)
    return Listing(**base)  # type: ignore[arg-type]


def test_gut_beats_renovate_keyword_order() -> None:
    assert infer_condition("appartement à rénover entièrement, gros travaux") == Condition.gut


def test_refresh_keyword() -> None:
    assert infer_condition("joli T2 à rafraîchir") == Condition.refresh


def test_new_keyword_no_works() -> None:
    cfg = RenovationConfig()
    est = estimate_renovation(_listing(description="refait à neuf, prestations haut de gamme"), cfg)
    assert est.condition == Condition.new
    assert est.total_cost == 0


def test_gut_cost_uses_surface() -> None:
    cfg = RenovationConfig()
    est = estimate_renovation(_listing(surface_m2=65, description="à rénover entièrement"), cfg)
    assert est.condition == Condition.gut
    assert est.total_cost == cfg.cost_per_m2["gut"] * 65

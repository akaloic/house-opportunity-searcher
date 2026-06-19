from __future__ import annotations

from datetime import date, datetime

from chasseur.config import ScoringConfig
from chasseur.models import FutureStation, Listing, PricePoint, Source, TransportContext
from chasseur.scoring import subscores as ss


def _listing(**kwargs: object) -> Listing:
    base: dict[str, object] = dict(source=Source.sample, source_id="x", price=268000, surface_m2=44)
    base.update(kwargs)
    return Listing(**base)  # type: ignore[arg-type]


def test_decote_capped_at_target() -> None:
    sub, pct = ss.decote_subscore(_listing(), 7300, ScoringConfig())
    assert sub == 1.0  # -16.6% dépasse la cible -15% => plein
    assert pct is not None and 0.16 < pct < 0.17


def test_decote_missing_market_is_none() -> None:
    sub, pct = ss.decote_subscore(_listing(), None, ScoringConfig())
    assert sub is None and pct is None


def test_futur_transport_horizon_weighting() -> None:
    transport = TransportContext(
        checked=True,
        future_stations=[FutureStation(name="X", line="M15", distance_m=430, opening_year=2031)],
    )
    val = ss.futur_transport_subscore(transport, ScoringConfig(), 2026)
    assert val is not None and 0.28 <= val <= 0.32


def test_futur_transport_unchecked_is_none() -> None:
    assert (
        ss.futur_transport_subscore(TransportContext(checked=False), ScoringConfig(), 2026) is None
    )


def test_futur_transport_already_open_excluded() -> None:
    transport = TransportContext(
        checked=True,
        future_stations=[FutureStation(name="X", line="M15", distance_m=100, opening_year=2025)],
    )
    assert ss.futur_transport_subscore(transport, ScoringConfig(), 2026) == 0.0


def test_defense_multiplier_competitive() -> None:
    mult, flags = ss.defense_multiplier(TransportContext(defense_minutes=17), ScoringConfig())
    assert round(mult, 3) == 1.087
    assert any("Défense" in f for f in flags)


def test_defense_multiplier_unknown_is_neutral() -> None:
    mult, _ = ss.defense_multiplier(TransportContext(defense_minutes=None), ScoringConfig())
    assert mult == 1.0


def test_charges_good_no_flag() -> None:
    sub, flags = ss.charges_subscore(_listing(charges_annual=1680), ScoringConfig())
    assert sub is not None and 0.68 < sub < 0.69
    assert flags == []


def test_charges_high_flagged() -> None:
    sub, flags = ss.charges_subscore(
        _listing(price=295000, surface_m2=65, charges_annual=3600), ScoringConfig()
    )
    assert sub is not None and sub < 0.45
    assert flags


def test_dpe_g_penalized_and_flagged() -> None:
    sub, flags = ss.dpe_subscore(_listing(dpe="G"), ScoringConfig())
    assert sub is not None and abs(sub - 0.4) < 1e-9
    assert any("G" in f for f in flags)


def test_anciennete_rewards_age_and_price_drops() -> None:
    listing = _listing(
        published_at=datetime(2026, 3, 20),
        price_history=[
            PricePoint(ts=datetime(2026, 3, 20), price=289000),
            PricePoint(ts=datetime(2026, 4, 25), price=279000),
            PricePoint(ts=datetime(2026, 5, 30), price=268000),
        ],
    )
    val = ss.anciennete_subscore(listing, ScoringConfig(), date(2026, 6, 13))
    assert val is not None and val > 0.9

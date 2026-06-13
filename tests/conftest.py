"""Fixtures partagées : une 'pépite' déterministe pour tester moteur/formatter."""

from __future__ import annotations

from datetime import date, datetime

import pytest

from chasseur.config import LexiconConfig
from chasseur.enrich.nlp import analyze_text
from chasseur.models import (
    Condition,
    EnrichedContext,
    FutureStation,
    Listing,
    PricePoint,
    RenovationEstimate,
    Source,
    TransportContext,
)


@pytest.fixture
def as_of() -> date:
    return date(2026, 6, 13)


@pytest.fixture
def pepite() -> tuple[Listing, EnrichedContext]:
    desc = (
        "Cause mutation professionnelle, à débattre, libre rapidement. Idéal investisseur, "
        "proche future gare."
    )
    listing = Listing(
        source=Source.sample,
        source_id="cb-001",
        title="T2 traversant Courbevoie",
        description=desc,
        price=268000,
        surface_m2=44,
        rooms=2,
        floor=3,
        has_elevator=True,
        dpe="F",
        charges_annual=1680,
        postal_code="92400",
        city="Courbevoie",
        lat=48.905,
        lon=2.267,
        is_professional=False,
        diffusion_count=3,
        published_at=datetime(2026, 3, 20, 9),
        price_history=[
            PricePoint(ts=datetime(2026, 3, 20), price=289000),
            PricePoint(ts=datetime(2026, 4, 25), price=279000),
            PricePoint(ts=datetime(2026, 5, 30), price=268000),
        ],
    )
    ctx = EnrichedContext(
        market_ppm2=7300,
        seller_signals=analyze_text(desc, LexiconConfig()),
        renovation=RenovationEstimate(
            condition=Condition.good, cost_per_m2=0, total_cost=0, notes="état correct"
        ),
        transport=TransportContext(
            checked=True,
            future_stations=[
                FutureStation(name="Bécon-les-Bruyères", line="M15 Ouest", distance_m=430, opening_year=2031)
            ],
            defense_minutes=17,
        ),
    )
    return listing, ctx

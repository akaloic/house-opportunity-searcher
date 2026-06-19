from __future__ import annotations

from datetime import datetime

from chasseur.config import get_settings
from chasseur.dashboard.webexport import CRITERIA, build_pepite_data, render_data_js
from chasseur.pipeline import run_pipeline
from chasseur.storage.db import SQLiteStore


def test_pepite_data_matches_design_contract() -> None:
    settings = get_settings()
    now = datetime(2026, 6, 13, 12)
    store = SQLiteStore(":memory:")
    results, summary = run_pipeline(
        settings, demo=True, as_of=now.date(), now=now, store=store, notify=False
    )
    data = build_pepite_data(results, summary, settings, now)

    keys = {c["key"] for c in CRITERIA}
    assert len(keys) == 7  # nos 7 vrais axes, pas les 6 génériques du mock
    assert set(data["WEIGHTS"]) == keys

    listings = data["LISTINGS"]
    assert len(listings) == len(results)
    for item in listings:
        assert set(item["crit"]) == keys  # radar/justification cohérents avec le moteur
        assert isinstance(item["score"], int)
        assert isinstance(item["x"], int) and isinstance(item["y"], int)

    assert len(data["SOURCES"]) == 5  # 1 actif + 4 portails (offline tant que non configurés)
    assert isinstance(data["LOGS"], list)

    js = render_data_js(data)
    assert "window.PEPITE_DATA" in js
    assert "window.fmtEur" in js
    store.close()


def test_listing_exports_engine_reco() -> None:
    """L'export embarque la reco RÉELLE du moteur (source unique de vérité)."""
    settings = get_settings()
    now = datetime(2026, 6, 13, 12)
    store = SQLiteStore(":memory:")
    results, summary = run_pipeline(
        settings, demo=True, as_of=now.date(), now=now, store=store, notify=False
    )
    data = build_pepite_data(results, summary, settings, now)

    for item, sl in zip(data["LISTINGS"], results, strict=True):
        reco = item["reco"]
        # offre d'attaque + reco chiffrée alignées sur le moteur
        assert reco["suggestedOfferPrice"] == sl.score.suggested_offer_price
        assert reco["recommendation"] == sl.score.recommendation
        assert reco["fullCost"] == sl.score.full_cost
        assert isinstance(reco["flags"], list)
        assert set(reco["sellerSignals"]) == {"urgency", "redflags"}
        # cohérence du coût de revient : prix + travaux + frais notaire
        works = reco["renovation"]["totalCost"] if reco["renovation"] else 0
        assert reco["fullCost"] >= sl.listing.price + works
    store.close()

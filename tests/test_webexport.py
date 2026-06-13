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

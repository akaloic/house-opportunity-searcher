from __future__ import annotations

from datetime import datetime, timedelta
from pathlib import Path

from chasseur.models import Listing, Source
from chasseur.storage.db import SQLiteStore


def test_upsert_dedup_and_alert_cooldown(tmp_path: Path) -> None:
    store = SQLiteStore(tmp_path / "t.sqlite")
    listing = Listing(
        source=Source.sample, source_id="a", price=200000,
        surface_m2=40, postal_code="92400", rooms=2,
    )
    now = datetime(2026, 6, 13, 12)

    first = store.upsert(listing, now)
    assert first.is_new and first.seen_count == 1
    second = store.upsert(listing, now)
    assert not second.is_new and second.seen_count == 2

    key = listing.dedup_key
    assert not store.was_alerted(key, within_hours=24, now=now)
    store.mark_alerted(key, now)
    assert store.was_alerted(key, within_hours=24, now=now)
    # le cooldown expire
    assert not store.was_alerted(key, within_hours=24, now=now + timedelta(hours=25))
    store.close()

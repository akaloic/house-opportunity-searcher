from __future__ import annotations

from datetime import date, datetime

from chasseur.config import get_settings
from chasseur.pipeline import run_pipeline
from chasseur.storage.db import SQLiteStore


def test_demo_ranks_pepite_top_and_filters_budget() -> None:
    settings = get_settings()
    store = SQLiteStore(":memory:")
    results, summary = run_pipeline(
        settings,
        demo=True,
        as_of=date(2026, 6, 13),
        now=datetime(2026, 6, 13, 12),
        store=store,
        notify=True,
    )

    assert results, "le mode démo doit produire des leads"
    ids = [r.listing.source_id for r in results]

    # Puteaux (332k€) doit être exclu par le filtre budget (310k€)
    assert "pu-004" not in ids
    assert summary.excluded_budget >= 1

    # La pépite Courbevoie doit ressortir en tête
    assert results[0].listing.source_id == "cb-001"
    assert results[0].score.total >= 70

    # Au moins une alerte coup-de-poing en dry-run
    assert summary.alerts >= 1
    assert summary.outbox
    store.close()


def test_souplex_trap_ranks_below_pepite() -> None:
    settings = get_settings()
    store = SQLiteStore(":memory:")
    results, _ = run_pipeline(
        settings, demo=True, as_of=date(2026, 6, 13), now=datetime(2026, 6, 13, 12), store=store
    )
    by_id = {r.listing.source_id: r.score.total for r in results}
    # le souplex RDC atypique (as-002) doit être nettement derrière la pépite
    assert by_id["as-002"] < by_id["cb-001"]
    store.close()

from __future__ import annotations

from datetime import date, datetime

from chasseur.config import Settings, get_settings
from chasseur.models import Listing, PropertyType, Source
from chasseur.pipeline import passes_filters, run_pipeline
from chasseur.storage.db import SQLiteStore


def _listing(**kw: object) -> Listing:
    base: dict[str, object] = dict(
        source=Source.sample,
        source_id="x",
        price=250000,
        surface_m2=45,
        property_type=PropertyType.apartment,
        floor=3,
        has_balcony=True,
    )
    base.update(kw)
    return Listing(**base)  # type: ignore[arg-type]


def test_demo_ranks_pepite_top_and_filters() -> None:
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

    # Puteaux (332k€) exclu par le filtre budget (310k€)
    assert "pu-004" not in ids
    assert summary.excluded_budget >= 1

    # Critères disqualifiants : RDC (as-002) et 1er étage (co-003) éjectés d'office
    assert "as-002" not in ids
    assert "co-003" not in ids
    assert summary.excluded_filters.get("floor", 0) >= 2

    # La pépite Courbevoie (3e/5, balcon) doit ressortir en tête
    assert results[0].listing.source_id == "cb-001"
    assert results[0].score.total >= 70

    # Au moins une alerte coup-de-poing en dry-run
    assert summary.alerts >= 1
    assert summary.outbox
    store.close()


def test_passes_filters_disqualifies() -> None:
    s = Settings()
    # Type : seuls les appartements passent
    assert passes_filters(_listing(property_type=PropertyType.house), s) == (False, "type")
    # Étage : RDC et 1er exclus, 2e gardé
    assert passes_filters(_listing(floor=0), s) == (False, "floor")
    assert passes_filters(_listing(floor=1), s) == (False, "floor")
    assert passes_filters(_listing(floor=2), s)[0]
    # Étage inconnu : gardé par défaut (mode dégradé, pas de disqualification sur donnée absente)
    assert passes_filters(_listing(floor=None), s)[0]
    # Balcon obligatoire : absent => exclu
    assert passes_filters(_listing(has_balcony=False), s) == (False, "balcony")
    # Balcon détecté via le texte si la donnée structurée manque
    assert passes_filters(
        _listing(has_balcony=None, description="lumineux, avec balcon plein sud"), s
    )[0]
    # Budget et surface restent éliminatoires
    assert passes_filters(_listing(price=400000), s) == (False, "budget")
    assert passes_filters(_listing(surface_m2=10), s) == (False, "surface_min")


def test_unknown_floor_excluded_when_configured() -> None:
    s = Settings(exclude_unknown_floor=True)
    assert passes_filters(_listing(floor=None), s) == (False, "floor_unknown")


def test_floor_inferred_from_text_when_structured_missing() -> None:
    """RDC/1er doivent être éjectés même si l'étage structuré manque (détection texte)."""
    s = Settings()
    assert passes_filters(
        _listing(floor=None, description="charmant studio en rez-de-chaussée"), s
    ) == (False, "floor")
    assert passes_filters(
        _listing(floor=None, description="appartement au 1er étage sur cour"), s
    ) == (False, "floor")
    assert passes_filters(_listing(floor=None, title="T2 RDC", description="lumineux"), s) == (
        False,
        "floor",
    )
    # 3e étage mentionné dans le texte -> gardé
    assert passes_filters(_listing(floor=None, description="lumineux au 3e étage, ascenseur"), s)[0]
    # l'étage structuré reste prioritaire sur le texte
    assert passes_filters(_listing(floor=4, description="ancien rez-de-chaussée réhabilité"), s)[0]

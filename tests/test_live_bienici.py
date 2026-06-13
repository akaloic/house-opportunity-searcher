"""Tests d'intégration RÉELS (réseau) — désactivés par défaut.

Activer avec :  CHASSEUR_LIVE_TESTS=1 pytest tests/test_live_bienici.py
Ils tapent réellement BienIci + DVF/geo.api ; on les garde hors de la suite offline
pour qu'elle reste déterministe et sans réseau.
"""

from __future__ import annotations

import os
import tempfile

import pytest

pytestmark = pytest.mark.skipif(
    os.environ.get("CHASSEUR_LIVE_TESTS") != "1",
    reason="test réseau réel ; définir CHASSEUR_LIVE_TESTS=1 pour l'activer",
)


def test_bienici_real_fetch() -> None:
    from chasseur.antibot.session import StealthSession
    from chasseur.config import AntibotConfig
    from chasseur.scrapers.base import ScrapeQuery
    from chasseur.scrapers.bienici import BienIciScraper

    scraper = BienIciScraper(StealthSession(AntibotConfig()))
    query = ScrapeQuery(postal_codes=["92400"], price_max=400_000, surface_min=20, max_results=5)
    listings = list(scraper.fetch_listings(query))

    assert listings, "BienIci doit renvoyer des annonces réelles"
    for listing in listings:
        assert listing.price > 0 and listing.surface_m2 > 0
        assert 1500 < listing.price_per_m2 < 40_000  # filtre anti-bruit appliqué


def test_dvf_real_median() -> None:
    from chasseur.enrich.dvf import DVFGeoReference
    from chasseur.models import Listing, Source

    ref = DVFGeoReference(cache_dir=tempfile.mkdtemp())
    listing = Listing(
        source=Source.bienici, source_id="x", price=300_000, surface_m2=50,
        postal_code="92400", lat=48.90, lon=2.25,
    )
    median = ref.median_ppm2(listing)
    assert median is not None and 3000 < median < 15_000  # ordre de grandeur Courbevoie

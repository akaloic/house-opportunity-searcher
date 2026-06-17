"""Scrapers SeLoger / LeBonCoin : on teste le testable (payload, parsing, dégradé).

L'accès live (DataDome) nécessite FlareSolverr + proxies FR : non testé ici (réseau/infra).
Ces tests valident le mapping vers Listing et la dégradation propre sans infra.
"""

from __future__ import annotations

from unittest import mock

import pytest

from chasseur.antibot.session import AntibotError, StealthSession
from chasseur.config import AntibotConfig
from chasseur.scrapers.base import AntibotNotConfigured, ScrapeQuery
from chasseur.scrapers.leboncoin import LeBonCoinScraper
from chasseur.scrapers.seloger import SeLogerScraper


def _session(**cfg: object) -> StealthSession:
    return StealthSession(AntibotConfig(**cfg))


# --- LeBonCoin -------------------------------------------------------------- #
def test_lbc_build_payload_apartments_and_ranges() -> None:
    q = ScrapeQuery(
        postal_codes=["92400"], price_max=310000, surface_min=20, surface_max=120, max_results=30
    )
    payload = LeBonCoinScraper(_session()).build_payload(q)
    filters = payload["filters"]
    assert filters["category"] == {"id": "9"}
    assert filters["enums"] == {"real_estate_type": ["2"]}
    assert filters["ranges"]["price"] == {"max": 310000}
    assert filters["ranges"]["square"] == {"min": 20, "max": 120}


def test_lbc_parse_maps_core_fields() -> None:
    ad = {
        "list_id": 123,
        "subject": "T2 avec balcon",
        "body": "joli T2 avec balcon plein sud",
        "price": [285000],
        "url": "https://www.leboncoin.fr/x/123",
        "attributes": [
            {"key": "square", "value": "44"},
            {"key": "rooms", "value": "2"},
            {"key": "floor_number", "value": "3"},
            {"key": "energy_rate", "value": "D"},
        ],
        "location": {"zipcode": "92400", "city": "Courbevoie", "lat": 48.9, "lng": 2.25},
        "images": {"urls": ["http://img/1.jpg"]},
    }
    listing = LeBonCoinScraper._parse(ad)
    assert listing is not None
    assert listing.source_id == "123"
    assert listing.surface_m2 == 44 and listing.rooms == 2 and listing.floor == 3
    assert listing.postal_code == "92400" and listing.dpe == "D"


def test_lbc_degrades_cleanly_without_infra() -> None:
    scraper = LeBonCoinScraper(_session())
    with mock.patch.object(scraper._session, "post", side_effect=AntibotError("403 DataDome")):
        with pytest.raises(AntibotNotConfigured):
            list(scraper.fetch_listings(ScrapeQuery(postal_codes=["92400"])))


# --- SeLoger ---------------------------------------------------------------- #
def test_seloger_blocked_page_raises() -> None:
    with pytest.raises(AntibotNotConfigured):
        SeLogerScraper.extract_next_data("<html>DataDome please verify</html>")


def test_seloger_extract_and_parse() -> None:
    card = {
        "id": 9,
        "pricing": {"price": 299000},
        "estate": {"surface": 58, "rooms": 3, "floor": 4, "floorCount": 6},
        "cityLabel": "Courbevoie",
        "zipCode": "92400",
        "classifiedURL": "https://www.seloger.com/x/9",
        "title": "T3 avec balcon",
        "energyClass": "D",
    }
    next_data = {"props": {"pageProps": {"cards": [card, card]}}}
    cards = SeLogerScraper._extract_listings(next_data)
    assert len(cards) == 2
    listing = SeLogerScraper._parse(card)
    assert listing is not None
    assert listing.surface_m2 == 58 and listing.floor == 4 and listing.floor_count == 6
    assert listing.city == "Courbevoie" and listing.postal_code == "92400"


def test_seloger_degrades_cleanly_without_infra() -> None:
    scraper = SeLogerScraper(_session())  # pas de FlareSolverr -> can_solve == False
    with mock.patch.object(scraper._session, "get", side_effect=AntibotError("403")):
        with pytest.raises(AntibotNotConfigured):
            list(scraper.fetch_listings(ScrapeQuery(postal_codes=["92400"])))


# --- session : solve / FlareSolverr ----------------------------------------- #
def test_session_solve_requires_flaresolverr() -> None:
    assert _session().can_solve is False
    with pytest.raises(AntibotError):
        _session().solve("https://www.seloger.com/list.htm")


def test_session_solve_uses_flaresolverr(monkeypatch: pytest.MonkeyPatch) -> None:
    sess = _session(flaresolverr_url="http://localhost:8191/v1", min_delay_s=0.0, max_delay_s=0.0)
    fake_client = mock.Mock()
    fake_client.get.return_value = mock.Mock(status=200, html="<html>__NEXT_DATA__ ok</html>")
    monkeypatch.setattr(
        "chasseur.antibot.flaresolverr.FlareSolverrClient", lambda url: fake_client
    )
    result = sess.solve("https://www.seloger.com/list.htm")
    assert result.status_code == 200
    assert "__NEXT_DATA__" in result.text


# --- PAP ---------------------------------------------------------------- #
def test_pap_digits() -> None:
    from chasseur.scrapers.pap import _digits

    assert _digits("310.000 €") == 310000.0
    assert _digits("2.990.000 €") == 2990000.0
    assert _digits("26,37 m²") == 26.37
    assert _digits("252 m²") == 252.0
    assert _digits("0 items") is None
    assert _digits("") is None


def test_pap_parse_html() -> None:
    from chasseur.scrapers.pap import PapScraper

    html = """
    <div class="search-list-item-alt">
        <a class="item-title" href="/annonces/appartement-courbevoie-92400-r123">
            <div class="item-price-container">
                <span class="item-price">239.800 €</span>
            </div>
            <span class="h1">Courbevoie (92400)</span>
            <ul class="item-tags">
                <li>2 pièces</li>
                <li>1 chambre</li>
                <li>30,5 m²</li>
            </ul>
        </a>
        <div class="item-description">Petit appart sympa</div>
    </div>
    """
    listings = PapScraper.parse_html(html)
    assert len(listings) == 1
    l = listings[0]
    assert l.source_id == "123"
    assert l.price == 239800.0
    assert l.surface_m2 == 30.5
    assert l.rooms == 2
    assert l.bedrooms == 1
    assert l.city == "Courbevoie"
    assert l.postal_code == "92400"
    assert l.is_professional is False


def test_pap_degrades_cleanly_without_antibot() -> None:
    from chasseur.scrapers.pap import PapScraper

    scraper = PapScraper(_session())
    # Mock géo resolution (succeeds), but _fetch_html fails
    with mock.patch.object(scraper, "_resolve_geo_ids", return_value=[43294]):
        with mock.patch.object(scraper, "_fetch_html", side_effect=AntibotNotConfigured("Cloudflare")):
            with pytest.raises(AntibotNotConfigured):
                list(scraper.fetch_listings(ScrapeQuery(postal_codes=["92400"])))

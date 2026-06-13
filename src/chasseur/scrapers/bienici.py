"""BienIci — la cible la plus accessible. Stratégie : API JSON publique.

BienIci expose une API de recherche qui renvoie du JSON propre (``realEstateAds.json``)
avec les filtres passés en paramètre JSON encodé. Protection plus légère que SeLoger/LBC :
curl_cffi (impersonate) + proxy FR suffit souvent. À privilégier pour démarrer.
"""

from __future__ import annotations

import json
from collections.abc import Iterable

from chasseur.antibot.session import StealthSession
from chasseur.models import Listing
from chasseur.scrapers.base import AntibotNotConfigured, Scraper, ScrapeQuery

SEARCH_URL = "https://www.bienici.com/realEstateAds.json"


class BienIciScraper(Scraper):
    name = "bienici"
    requires_antibot = True

    def __init__(self, session: StealthSession) -> None:
        self._session = session

    def build_filters(self, query: ScrapeQuery) -> str:
        """Construit le paramètre `filters` (JSON encodé) attendu par l'API."""
        filters: dict[str, object] = {
            "size": query.max_results,
            "from": 0,
            "filterType": "buy",
            "propertyType": ["flat"],
            "page": 1,
        }
        if query.price_max is not None:
            filters["maxPrice"] = int(query.price_max)
        if query.surface_min is not None:
            filters["minArea"] = int(query.surface_min)
        if query.postal_codes:
            filters["zoneIdsByTypes"] = {"postalCode": query.postal_codes}
        return json.dumps(filters, separators=(",", ":"))

    def fetch_listings(self, query: ScrapeQuery) -> Iterable[Listing]:
        raise AntibotNotConfigured(
            "BienIci : brancher l'appel API réel (GET realEstateAds.json?filters=...) avec "
            "curl_cffi + proxy FR, puis mapper le JSON vers Listing. build_filters() fourni. "
            "C'est la cible recommandée pour le premier scraper live (cf README)."
        )

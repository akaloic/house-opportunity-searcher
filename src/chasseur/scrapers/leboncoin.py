"""LeBonCoin — protégé par DataDome. Stratégie : viser l'API interne (mobile/XHR).

Plan d'attaque (du moins coûteux au plus coûteux) :
  1. Reproduire l'appel POST de l'API finder (``/finder/search``) repéré dans les XHR :
     payload JSON {filters: {category, location (codes INSEE), ranges: {price, square}}}.
  2. curl_cffi impersonate Chrome + proxy résidentiel FR + cookie DataDome valide.
  3. Si challenge DataDome -> FlareSolverr pour obtenir un cookie, puis rejouer l'appel.

Le parsing JSON -> Listing est direct (l'API renvoie des objets propres). Ce squelette
fournit la structure ; brancher la requête réelle et compléter ``_parse``.
"""

from __future__ import annotations

from collections.abc import Iterable

from chasseur.antibot.session import StealthSession
from chasseur.models import Listing, PropertyType, Source
from chasseur.scrapers.base import AntibotNotConfigured, Scraper, ScrapeQuery

API_URL = "https://api.leboncoin.fr/finder/search"


class LeBonCoinScraper(Scraper):
    name = "leboncoin"
    requires_antibot = True

    def __init__(self, session: StealthSession) -> None:
        self._session = session

    def build_payload(self, query: ScrapeQuery) -> dict[str, object]:
        """Construit le corps de la requête API (à ajuster selon les filtres réels)."""
        ranges: dict[str, object] = {}
        if query.price_max is not None:
            ranges["price"] = {"max": int(query.price_max)}
        if query.surface_min is not None or query.surface_max is not None:
            ranges["square"] = {
                "min": int(query.surface_min or 0),
                "max": int(query.surface_max or 9999),
            }
        return {
            "filters": {
                "category": {"id": "9"},  # ventes immobilières
                "enums": {"real_estate_type": ["2"]},  # appartements
                "location": {"locations": [{"locationType": "city"} for _ in query.postal_codes]},
                "ranges": ranges,
            },
            "limit": query.max_results,
        }

    @staticmethod
    def _parse(raw: dict[str, object]) -> Listing:
        """Mappe un objet de l'API LBC vers un Listing. TODO: aligner sur le schéma réel."""
        return Listing(
            source=Source.leboncoin,
            source_id=str(raw["list_id"]),
            url=str(raw.get("url", "")),
            title=str(raw.get("subject", "")),
            description=str(raw.get("body", "")),
            price=float(raw["price"][0]) if isinstance(raw.get("price"), list) else float(raw["price"]),  # type: ignore[index]
            surface_m2=float(raw.get("square", 0)) or 1.0,
            property_type=PropertyType.apartment,
        )

    def fetch_listings(self, query: ScrapeQuery) -> Iterable[Listing]:
        raise AntibotNotConfigured(
            "LeBonCoin (DataDome) : brancher l'API interne + proxy résidentiel FR + "
            "gestion du cookie DataDome (FlareSolverr). Squelette: build_payload()/_parse() "
            "fournis, requête réelle à compléter. Voir README §Anti-bot."
        )

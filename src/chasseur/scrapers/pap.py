"""PAP (Particulier à Particulier) — protection légère, annonces SANS agence.

Intérêt stratégique : 100% de particuliers => marge de négociation directe, zéro
commission, et moins de concurrence d'investisseurs que sur SeLoger. Le HTML est
parsable (selectolax) ; curl_cffi suffit généralement. Excellent terrain de départ.
"""

from __future__ import annotations

from collections.abc import Iterable

from chasseur.antibot.session import StealthSession
from chasseur.models import Listing
from chasseur.scrapers.base import AntibotNotConfigured, Scraper, ScrapeQuery

BASE_URL = "https://www.pap.fr/annonce/vente-appartements"


class PapScraper(Scraper):
    name = "pap"
    requires_antibot = True

    def __init__(self, session: StealthSession) -> None:
        self._session = session

    def build_url(self, query: ScrapeQuery) -> str:
        """Construit l'URL de la page de résultats (PAP encode les filtres dans le path)."""
        zones = "-".join(query.postal_codes) if query.postal_codes else "ile-de-france"
        url = f"{BASE_URL}-{zones}"
        if query.price_max is not None:
            url += f"-prix-max-{int(query.price_max)}"
        return url

    @staticmethod
    def parse_html(html: str) -> list[Listing]:
        """Parse la liste d'annonces. TODO: sélecteurs selectolax sur .item-body."""
        # from selectolax.parser import HTMLParser  # dépendance optionnelle [scrape]
        # tree = HTMLParser(html); for node in tree.css(".search-list-item-alt"): ...
        return []

    def fetch_listings(self, query: ScrapeQuery) -> Iterable[Listing]:
        raise AntibotNotConfigured(
            "PAP : brancher GET build_url() via curl_cffi + parse_html() (selectolax). "
            "Protection légère — bon premier scraper live avec BienIci. Voir README."
        )

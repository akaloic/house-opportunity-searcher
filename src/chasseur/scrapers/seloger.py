"""SeLoger — forteresse DataDome. Stratégie : FlareSolverr puis __NEXT_DATA__.

Plan d'attaque :
  1. Récupérer un cookie DataDome valide via FlareSolverr (résout le challenge JS).
  2. Rejouer la page de résultats avec curl_cffi (impersonate) + ce cookie + proxy FR.
  3. Extraire le JSON ``__NEXT_DATA__`` embarqué dans le HTML (annonces structurées) —
     plus fiable que de parser le DOM rendu.
"""

from __future__ import annotations

import json
import re
from collections.abc import Iterable

from chasseur.antibot.session import StealthSession
from chasseur.models import Listing
from chasseur.scrapers.base import AntibotNotConfigured, Scraper, ScrapeQuery

_NEXT_DATA_RE = re.compile(
    r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', re.DOTALL
)


class SeLogerScraper(Scraper):
    name = "seloger"
    requires_antibot = True

    def __init__(self, session: StealthSession) -> None:
        self._session = session

    @staticmethod
    def extract_next_data(html: str) -> dict[str, object]:
        """Isole le blob __NEXT_DATA__ d'une page SeLoger."""
        match = _NEXT_DATA_RE.search(html)
        if not match:
            raise AntibotNotConfigured(
                "Pas de __NEXT_DATA__ : page probablement bloquée par DataDome "
                "(passer par FlareSolverr pour obtenir le cookie)."
            )
        parsed: dict[str, object] = json.loads(match.group(1))
        return parsed

    def fetch_listings(self, query: ScrapeQuery) -> Iterable[Listing]:
        raise AntibotNotConfigured(
            "SeLoger (DataDome) : nécessite FlareSolverr pour le cookie + proxy résidentiel FR. "
            "Pipeline: solve -> GET résultats -> extract_next_data() -> map vers Listing. "
            "Voir README §Anti-bot."
        )

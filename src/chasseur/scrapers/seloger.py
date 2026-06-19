"""SeLoger — forteresse DataDome. Stratégie : FlareSolverr puis __NEXT_DATA__.

Plan d'attaque :
  1. GET direct de la page résultats via la StealthSession (curl_cffi impersonate + proxy FR).
  2. Si DataDome bloque -> FlareSolverr résout le challenge JS et renvoie le HTML rendu.
  3. Extraire le JSON ``__NEXT_DATA__`` embarqué (annonces structurées) -> Listing.

⚠️  À CALIBRER sur 5 annonces réelles : l'URL de recherche et le chemin des cartes dans
``__NEXT_DATA__`` évoluent. ``_extract_listings`` cherche les cartes de façon défensive ;
``_parse`` couvre une forme plausible — ajuster les clés sur une vraie page.
"""

from __future__ import annotations

import json
import re
from collections.abc import Iterable, Iterator
from urllib.parse import urlencode

from chasseur.antibot.session import AntibotError, StealthSession
from chasseur.models import Listing, PropertyType, Source
from chasseur.scrapers.base import AntibotNotConfigured, ScrapeQuery, Scraper

_NEXT_DATA_RE = re.compile(
    r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', re.DOTALL
)
SEARCH_URL = "https://www.seloger.com/list.htm"


class SeLogerScraper(Scraper):
    name = "seloger"
    requires_antibot = True

    def __init__(self, session: StealthSession) -> None:
        self._session = session

    # --- géographie / requête --------------------------------------------- #
    @staticmethod
    def _search_url(query: ScrapeQuery) -> str:
        places = ",".join(f"{{cp:{cp}}}" for cp in query.postal_codes)
        params = {
            "projects": "2",  # achat
            "types": "1",  # appartement
            "natures": "1,2,4",
            "places": f"[{places}]",
            "price": f"NaN/{int(query.price_max or 9_999_999)}",
            "surface": f"{int(query.surface_min or 0)}/{int(query.surface_max or 9999)}",
            "sort": "d_dt_crea",  # plus récentes d'abord
        }
        return f"{SEARCH_URL}?{urlencode(params)}"

    # --- récupération HTML (direct -> FlareSolverr) ----------------------- #
    def _fetch_html(self, url: str) -> str:
        try:
            result = self._session.get(url)
            if result.status_code == 200 and "__NEXT_DATA__" in result.text:
                return result.text
        except AntibotError:
            pass
        if self._session.can_solve:
            return self._session.solve(url).text
        raise AntibotNotConfigured(
            "SeLoger (DataDome) : page bloquée. Configure FlareSolverr "
            "(antibot.flaresolverr_url) + proxy résidentiel FR (antibot.proxies)."
        )

    # --- parsing ---------------------------------------------------------- #
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

    @staticmethod
    def _extract_listings(next_data: object) -> list[dict[str, object]]:
        """Cherche récursivement la liste des cartes d'annonces dans __NEXT_DATA__."""

        def looks_like_card(node: object) -> bool:
            return isinstance(node, dict) and (
                "id" in node or "listingReference" in node
            ) and any(k in node for k in ("pricing", "price", "estate", "cityLabel"))

        found: list[dict[str, object]] = []

        def walk(node: object) -> None:
            if isinstance(node, list):
                if node and all(looks_like_card(x) for x in node[:3]):
                    found.extend(x for x in node if isinstance(x, dict))
                else:
                    for item in node:
                        walk(item)
            elif isinstance(node, dict):
                for value in node.values():
                    walk(value)

        walk(next_data)
        return found

    @staticmethod
    def _parse(card: dict[str, object]) -> Listing | None:
        pricing = card.get("pricing") if isinstance(card.get("pricing"), dict) else {}
        price = (pricing.get("price") if isinstance(pricing, dict) else None) or card.get("price")
        estate = card.get("estate") if isinstance(card.get("estate"), dict) else card
        surface = estate.get("surface") or card.get("surface")
        try:
            price_val = float(str(price).replace(" ", "").replace("€", ""))
            surface_val = float(surface)  # type: ignore[arg-type]
        except (TypeError, ValueError):
            return None
        if price_val <= 0 or surface_val <= 0:
            return None

        rooms = estate.get("rooms") or card.get("rooms")
        floor = estate.get("floor") or card.get("floor")
        photos = card.get("photos") if isinstance(card.get("photos"), list) else []
        photo_urls = [p for p in photos if isinstance(p, str)][:12]

        def _int(value: object) -> int | None:
            try:
                return int(value)  # type: ignore[arg-type]
            except (TypeError, ValueError):
                return None

        return Listing(
            source=Source.seloger,
            source_id=str(card.get("id") or card.get("listingReference")),
            url=str(card.get("classifiedURL") or card.get("url") or ""),
            title=str(card.get("title") or estate.get("type") or "Appartement")[:200],
            description=str(card.get("description") or ""),
            price=price_val,
            surface_m2=surface_val,
            rooms=_int(rooms),
            property_type=PropertyType.apartment,
            floor=_int(floor),
            floor_count=_int(estate.get("floorCount") or card.get("floorCount")),
            dpe=str(card.get("energyClass") or "").upper()[:1] or None,
            postal_code=str(card.get("zipCode") or card.get("postalCode") or "") or None,
            city=str(card.get("cityLabel") or card.get("city") or "") or None,
            raw={"photo_urls": photo_urls},
        )

    def fetch_listings(self, query: ScrapeQuery) -> Iterator[Listing]:
        html = self._fetch_html(self._search_url(query))
        cards = self._extract_listings(self.extract_next_data(html))
        yield from _emit(cards, self._parse, query.max_results)


def _emit(cards: list[dict[str, object]], parse: object, limit: int) -> Iterable[Listing]:
    seen: set[str] = set()
    for card in cards[:limit]:
        try:
            listing = parse(card)  # type: ignore[operator]
        except (KeyError, TypeError, ValueError):
            continue
        if listing is None or listing.source_id in seen:
            continue
        seen.add(listing.source_id)
        yield listing

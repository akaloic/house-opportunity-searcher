"""LeBonCoin — protégé par DataDome. Stratégie : API interne (POST /finder/search).

Du moins coûteux au plus coûteux :
  1. POST direct de l'API finder via la StealthSession (curl_cffi impersonate + proxy FR).
  2. Si DataDome bloque (403/401) -> on a besoin d'un cookie valide : FlareSolverr.
  3. Sans infra (proxy/FlareSolverr) -> AntibotNotConfigured (le pipeline dégrade proprement).

⚠️  À CALIBRER sur 5 annonces réelles : le header ``api_key`` et le schéma JSON de l'API
évoluent. ``build_payload`` / ``_parse`` couvrent le cas nominal ; ajuster les clés au besoin.
"""

from __future__ import annotations

import json
from collections.abc import Iterable, Iterator

from chasseur.antibot.session import AntibotError, StealthSession
from chasseur.models import Listing, PropertyType, Source
from chasseur.scrapers.base import AntibotNotConfigured, ScrapeQuery, Scraper

API_URL = "https://api.leboncoin.fr/finder/search"


class LeBonCoinScraper(Scraper):
    name = "leboncoin"
    requires_antibot = True

    def __init__(self, session: StealthSession) -> None:
        self._session = session

    def build_payload(self, query: ScrapeQuery) -> dict[str, object]:
        """Construit le corps de la requête API (filtres ventes appartements IDF)."""
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
                "location": {"city_zipcodes": [{"zipcode": cp} for cp in query.postal_codes]},
                "ranges": ranges,
            },
            "limit": query.max_results,
            "sort_by": "time",
            "sort_order": "desc",
        }

    @staticmethod
    def _attr(raw: dict[str, object], key: str) -> str | None:
        for attr in raw.get("attributes") or []:  # type: ignore[union-attr]
            if isinstance(attr, dict) and attr.get("key") == key:
                value = attr.get("value")
                return str(value) if value is not None else None
        return None

    @classmethod
    def _parse(cls, raw: dict[str, object]) -> Listing | None:
        price = raw.get("price")
        price_val = (
            float(price[0]) if isinstance(price, list) and price else float(raw.get("price") or 0)  # type: ignore[arg-type]
        )
        square = cls._attr(raw, "square")
        surface = float(square) if square and square.replace(".", "", 1).isdigit() else 0.0
        if price_val <= 0 or surface <= 0:
            return None

        location = raw.get("location") if isinstance(raw.get("location"), dict) else {}
        rooms = cls._attr(raw, "rooms")
        floor = cls._attr(raw, "floor_number") or cls._attr(raw, "floor")
        energy = cls._attr(raw, "energy_rate") or cls._attr(raw, "energie")
        images = raw.get("images") if isinstance(raw.get("images"), dict) else {}
        urls = images.get("urls") if isinstance(images, dict) else None

        def _int(value: str | None) -> int | None:
            return int(value) if value and value.lstrip("-").isdigit() else None

        return Listing(
            source=Source.leboncoin,
            source_id=str(raw["list_id"]),
            url=str(raw.get("url") or ""),
            title=str(raw.get("subject") or "")[:200],
            description=str(raw.get("body") or ""),
            price=price_val,
            surface_m2=surface,
            rooms=_int(rooms),
            property_type=PropertyType.apartment,
            floor=_int(floor),
            dpe=str(energy).upper()[:1] if energy else None,
            postal_code=str(location.get("zipcode")) if location.get("zipcode") else None,
            city=str(location.get("city")) if location.get("city") else None,
            lat=float(location["lat"]) if location.get("lat") else None,
            lon=float(location["lng"]) if location.get("lng") else None,
            is_professional=str(raw.get("owner_type") or "") == "pro" or None,
            raw={"photo_urls": list(urls)[:12] if isinstance(urls, list) else []},
        )

    def fetch_listings(self, query: ScrapeQuery) -> Iterator[Listing]:
        payload = self.build_payload(query)
        try:
            result = self._session.post(API_URL, json_body=payload)
        except AntibotError as exc:
            raise AntibotNotConfigured(
                "LeBonCoin (DataDome) bloque l'API : configure un proxy résidentiel FR "
                "(antibot.proxies) et/ou FlareSolverr (antibot.flaresolverr_url). "
                f"Détail : {exc}"
            ) from exc
        if result.status_code != 200:
            raise AntibotNotConfigured(
                f"LeBonCoin HTTP {result.status_code} — cookie DataDome requis (FlareSolverr)."
            )
        try:
            data = json.loads(result.text)
        except json.JSONDecodeError as exc:
            raise AntibotNotConfigured(
                f"LeBonCoin : réponse non-JSON (challenge ?) : {exc}"
            ) from exc

        ads = data.get("ads") if isinstance(data, dict) else None
        yield from _emit(ads, self._parse, query.max_results)


def _emit(
    ads: object, parse: object, limit: int
) -> Iterable[Listing]:
    seen: set[str] = set()
    for ad in (ads or [])[:limit] if isinstance(ads, list) else []:
        if not isinstance(ad, dict):
            continue
        try:
            listing = parse(ad)  # type: ignore[operator]
        except (KeyError, TypeError, ValueError):
            continue
        if listing is None or listing.source_id in seen:
            continue
        seen.add(listing.source_id)
        yield listing

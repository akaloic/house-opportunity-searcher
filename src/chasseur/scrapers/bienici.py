"""BienIci — scraper RÉEL via l'API JSON publique. La cible la plus accessible d'IDF.

Workflow :
  1. suggest.json?q=<code postal> -> zoneIds BienIci (résolution géographique).
  2. realEstateAds.json?filters={...zoneIds...} -> annonces JSON propres (paginées).
  3. parsing -> Listing, avec filtre anti-bruit (locations/parkings glissés dans les "buy").

Politesse : passe par StealthSession (token bucket + jitter + backoff). Usage perso,
faible volume. Couper si BienIci durcit ses CGU.
"""

from __future__ import annotations

import json
from collections.abc import Iterator
from datetime import datetime
from urllib.parse import quote

from chasseur.antibot.session import StealthSession
from chasseur.models import Listing, PropertyType, Source
from chasseur.scrapers.base import Scraper, ScraperError, ScrapeQuery

SUGGEST_URL = "https://res.bienici.com/suggest.json"
SEARCH_URL = "https://www.bienici.com/realEstateAds.json"


def _parse_date(value: object) -> datetime | None:
    if not isinstance(value, str):
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00")).replace(tzinfo=None)
    except ValueError:
        return None
    return parsed if parsed.year >= 2005 else None  # 1970 epoch = date manquante chez BienIci


class BienIciScraper(Scraper):
    name = "bienici"
    requires_antibot = True

    def __init__(self, session: StealthSession, *, min_price: float = 50_000.0, page_size: int = 30) -> None:
        self._session = session
        self._min_price = min_price
        self._page_size = page_size

    # --- géographie ------------------------------------------------------- #
    def _resolve_zone_ids(self, postal_code: str) -> list[str]:
        result = self._session.get(f"{SUGGEST_URL}?q={quote(postal_code)}")
        if result.status_code != 200:
            return []
        try:
            data = json.loads(result.text)
        except json.JSONDecodeError:
            return []
        for item in data:  # priorité au match exact du code postal
            if postal_code in (item.get("postalCodes") or []):
                return [str(z) for z in item.get("zoneIds") or []]
        return [str(z) for z in (data[0].get("zoneIds") or [])] if data else []

    def _build_filters(self, zone_ids: list[str], query: ScrapeQuery, from_: int) -> str:
        filters: dict[str, object] = {
            "size": self._page_size,
            "from": from_,
            "filterType": "buy",
            "propertyType": ["flat"],
            "minPrice": int(self._min_price),
            "zoneIdsByTypes": {"zoneIds": zone_ids},
            "sortBy": "publicationDate",
            "sortOrder": "desc",
        }
        if query.price_max is not None:
            filters["maxPrice"] = int(query.price_max)
        if query.surface_min is not None:
            filters["minArea"] = int(query.surface_min)
        if query.surface_max is not None:
            filters["maxArea"] = int(query.surface_max)
        return json.dumps(filters, separators=(",", ":"))

    # --- parsing ---------------------------------------------------------- #
    def _parse(self, ad: dict[str, object]) -> Listing | None:
        price = ad.get("price")
        surface = ad.get("surfaceArea")
        if not isinstance(price, (int, float)) or not isinstance(surface, (int, float)):
            return None
        if surface < 9:
            return None
        ppm2 = price / surface
        if not 1500 < ppm2 < 40_000:  # filtre anti-bruit (locations/parkings/erreurs de saisie)
            return None

        blur = ad.get("blurInfo") if isinstance(ad.get("blurInfo"), dict) else {}
        position = blur.get("position", {}) if isinstance(blur, dict) else {}
        lat = position.get("lat") if isinstance(position, dict) else None
        lon = position.get("lon") if isinstance(position, dict) else None
        exact = isinstance(blur, dict) and blur.get("type") == "exact"

        description = str(ad.get("description") or "")
        if ad.get("priceHasDecreased"):
            description += " (prix en baisse)"  # capté par le NLP -> signal vendeur

        ptype = PropertyType.house if ad.get("propertyType") == "house" else PropertyType.apartment
        photo_list = ad.get("photos") if isinstance(ad.get("photos"), list) else []
        photo_urls = [p["url"] for p in photo_list if isinstance(p, dict) and p.get("url")][:12]

        return Listing(
            source=Source.bienici,
            source_id=str(ad.get("id")),
            url=f"https://www.bienici.com/annonce/{ad.get('id')}",
            title=str(ad.get("title") or "")[:200],
            description=description,
            price=float(price),
            surface_m2=float(surface),
            rooms=ad.get("roomsQuantity") if isinstance(ad.get("roomsQuantity"), int) else None,
            bedrooms=ad.get("bedroomsQuantity") if isinstance(ad.get("bedroomsQuantity"), int) else None,
            property_type=ptype,
            floor=ad.get("floor") if isinstance(ad.get("floor"), int) else None,
            dpe=str(ad["energyClassification"]) if ad.get("energyClassification") else None,
            ges=str(ad["greenhouseGazClassification"]) if ad.get("greenhouseGazClassification") else None,
            postal_code=str(ad["postalCode"]) if ad.get("postalCode") else None,
            city=str(ad.get("city") or "") or None,
            lat=float(lat) if isinstance(lat, (int, float)) else None,
            lon=float(lon) if isinstance(lon, (int, float)) else None,
            geocode_confidence=0.9 if exact else 0.5,
            published_at=_parse_date(ad.get("modificationDate") or ad.get("publicationDate")),
            is_professional=bool(ad["adCreatedByPro"]) if "adCreatedByPro" in ad else None,
            raw={
                "reference": ad.get("reference"),
                "pricePerSquareMeter": ad.get("pricePerSquareMeter"),
                "photos": len(photo_list),
                "photo_urls": photo_urls,
            },
        )

    # --- boucle principale ------------------------------------------------ #
    def fetch_listings(self, query: ScrapeQuery) -> Iterator[Listing]:
        zone_ids: list[str] = []
        for postal_code in query.postal_codes:
            zone_ids.extend(self._resolve_zone_ids(postal_code))
        zone_ids = list(dict.fromkeys(zone_ids))  # dédup en gardant l'ordre
        if not zone_ids:
            raise ScraperError("BienIci : aucune zone résolue (vérifier target_postal_codes).")

        seen: set[str] = set()
        from_ = 0
        while len(seen) < query.max_results:
            url = f"{SEARCH_URL}?filters={quote(self._build_filters(zone_ids, query, from_))}"
            result = self._session.get(url)
            if result.status_code != 200:
                raise ScraperError(f"BienIci HTTP {result.status_code} (anti-bot ?).")
            payload = json.loads(result.text)
            ads = payload.get("realEstateAds") or []
            if not ads:
                break
            for ad in ads:
                listing = self._parse(ad)
                if listing is None or listing.source_id in seen:
                    continue
                seen.add(listing.source_id)
                yield listing
                if len(seen) >= query.max_results:
                    return
            from_ += len(ads)
            if from_ >= int(payload.get("total", 0)):
                break

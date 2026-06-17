"""PAP (Particulier à Particulier) — scraper RÉEL. Annonces 100 % particuliers.

Intérêt stratégique : zéro commission d'agence, vendeurs joignables en direct, et
souvent des vendeurs pressés (mutation, succession) => levier de négo maximal. C'est
le complément parfait de Bien'ici (agences) pour rester sur des sources GRATUITES.

Anti-bot : PAP est derrière **Cloudflare** (pas DataDome). L'impersonation TLS/JA3 de
``curl_cffi`` (via la StealthSession) passe le challenge en direct — aucun proxy ni
service externe requis. Si Cloudflare durcit, fallback FlareSolverr (qui EST conçu
pour Cloudflare) ; sinon dégradation propre (``AntibotNotConfigured``).

Flux :
  1. /json/ac-geo?q=<code postal>  -> geo id interne PAP (résolution géographique).
  2. /annonce/vente-appartements-g<id>[-jusqu-a-<max>-euros][-<page>]  -> page HTML.
  3. parsing selectolax des cartes .search-list-item-alt -> Listing.

⚠️  Calibré sur annonces réelles (juin 2026). Si PAP change ses classes CSS ou le
format d'URL, ajuster ``parse_html`` / ``_search_url`` — le reste du pipeline tient.
"""

from __future__ import annotations

import json
import re
from collections.abc import Iterator

from chasseur.antibot.session import AntibotError, StealthSession
from chasseur.models import Listing, PropertyType, Source
from chasseur.scrapers.base import (
    AntibotNotConfigured,
    Scraper,
    ScraperError,
    ScrapeQuery,
)

GEO_URL = "https://www.pap.fr/json/ac-geo"
BASE_URL = "https://www.pap.fr/annonce/vente-appartements"
SITE_ROOT = "https://www.pap.fr"

_LOCATION_RE = re.compile(r"^(.*?)\s*\((\d{5})\)\s*$")  # "Courbevoie (92400)"
_REF_RE = re.compile(r"-r(\d+)\b")  # /annonces/...-r463603261
_CHALLENGE_MARKERS = ("Just a moment", "challenges.cloudflare", "cf-browser-verification")


def _digits(text: str) -> float | None:
    """Extrait un nombre d'un texte bruité, accepte décimales françaises/anglaises."""
    t = (text or "").strip()
    cleaned = re.sub(r"[^\d.,]", "", t)
    if not cleaned:
        return None
    # Heuristique : si virgule ET points -> virgule = décimale, enlever points (milliers)
    if "," in cleaned and "." in cleaned:
        cleaned = cleaned.replace(".", "").replace(",", ".")
    # Si juste virgules -> remplacer par point (FR décimale)
    elif "," in cleaned:
        cleaned = cleaned.replace(",", ".")
    # Si juste points : heuristique sur la structure
    elif "." in cleaned:
        parts = cleaned.split(".")
        if len(parts) > 2:
            # "2.990.000" ou plus : tous les points sauf le dernier sont milliers -> enlever tous
            cleaned = "".join(parts)
        elif len(parts) == 2:
            # "310.000" ou "15.50" : ambiguïté.
            # Si dernier groupe a exactement 3 chiffres, c'est probablement des milliers.
            if len(parts[-1]) == 3 and parts[-1].isdigit():
                cleaned = parts[0] + parts[1]  # enlever le point
            # Sinon c'est une décimale anglaise (leave as-is).
    try:
        val = float(cleaned)
        return val if val > 0 else None
    except ValueError:
        return None


class PapScraper(Scraper):
    name = "pap"
    requires_antibot = True

    def __init__(self, session: StealthSession, *, page_size: int = 15) -> None:
        self._session = session
        self._page_size = page_size  # PAP sert ~15 cartes/page

    # --- géographie ------------------------------------------------------- #
    def _resolve_geo_ids(self, postal_code: str) -> list[int]:
        """Code postal -> id(s) géo interne PAP via l'autocomplétion JSON."""
        try:
            result = self._session.get(f"{GEO_URL}?q={postal_code}")
        except AntibotError:
            return []
        if result.status_code != 200:
            return []
        try:
            data = json.loads(result.text)
        except json.JSONDecodeError:
            return []
        ids: list[int] = []
        for item in data if isinstance(data, list) else []:
            geo_id = item.get("id") if isinstance(item, dict) else None
            if isinstance(geo_id, int):
                ids.append(geo_id)
        return ids

    def _search_url(self, geo_id: int, query: ScrapeQuery, page: int) -> str:
        url = f"{BASE_URL}-g{geo_id}"
        if query.price_max is not None:
            # Seul format de prix respecté par PAP (vérifié) : "-jusqu-a-<max>-euros".
            url += f"-jusqu-a-{int(query.price_max)}-euros"
        if page > 1:
            url += f"-{page}"  # la pagination est un suffixe de path, pas un ?page=
        return url

    # --- récupération HTML (curl_cffi -> FlareSolverr) -------------------- #
    def _fetch_html(self, url: str) -> str:
        try:
            result = self._session.get(url)
            if result.status_code == 200 and not _is_challenge(result.text):
                return result.text
        except AntibotError:
            pass
        if self._session.can_solve:  # FlareSolverr est le bon outil pour Cloudflare
            return self._session.solve(url).text
        raise AntibotNotConfigured(
            "PAP (Cloudflare) : page bloquée. L'impersonation curl_cffi suffit "
            "normalement — installe les extras [scrape] (curl_cffi). Si Cloudflare "
            "durcit, configure FlareSolverr (antibot.flaresolverr_url)."
        )

    # --- parsing ---------------------------------------------------------- #
    @staticmethod
    def parse_html(html: str) -> list[Listing]:
        """Parse une page de résultats PAP -> Listing. Pur (testable hors réseau)."""
        from selectolax.parser import HTMLParser

        tree = HTMLParser(html)
        listings: list[Listing] = []
        for card in tree.css(".search-list-item-alt"):
            listing = PapScraper._parse_card(card)  # type: ignore[arg-type]
            if listing is not None:
                listings.append(listing)
        return listings

    @staticmethod
    def _parse_card(card: object) -> Listing | None:
        from selectolax.parser import Node

        assert isinstance(card, Node)
        link = card.css_first("a.item-title")
        if link is None:
            return None  # carte promo/crédit glissée dans la liste -> on ignore
        href = link.attributes.get("href") or ""
        ref_match = _REF_RE.search(href)
        if ref_match is None:
            return None
        source_id = ref_match.group(1)

        price_node = card.css_first(".item-price")
        price = _digits(price_node.text()) if price_node else None

        rooms = bedrooms = surface = None
        for li in card.css("ul.item-tags li"):
            label = li.text(strip=True).lower()
            value = _digits(label)
            if value is None:
                continue
            if "pièce" in label or "piece" in label:
                rooms = int(value)
            elif "chambre" in label:
                bedrooms = int(value)
            elif "m²" in label or "m2" in label:
                surface = value

        if price is None or price <= 0 or surface is None or surface <= 0:
            return None

        city = postal_code = None
        h1 = card.css_first(".h1")
        if h1 is not None:
            loc = _LOCATION_RE.match(h1.text(strip=True))
            if loc is not None:
                city, postal_code = loc.group(1).strip(), loc.group(2)

        desc_node = card.css_first(".item-description")
        description = desc_node.text(strip=True) if desc_node else ""

        photo_urls: list[str] = []
        for img in card.css("img"):
            src = img.attributes.get("src") or ""
            if src.startswith("https://cdn.pap.fr") and src not in photo_urls:
                photo_urls.append(src)

        return Listing(
            source=Source.pap,
            source_id=source_id,
            url=f"{SITE_ROOT}{href}" if href.startswith("/") else href,
            title=f"{city or 'Appartement'} — {surface:.0f} m²"[:200],
            description=description,
            price=price if isinstance(price, float) else float(price),
            surface_m2=surface if isinstance(surface, float) else float(surface),
            rooms=rooms,
            bedrooms=bedrooms,
            property_type=PropertyType.house if "maison" in href else PropertyType.apartment,
            postal_code=postal_code,
            city=city,
            is_professional=False,  # PAP = 100 % particuliers, par construction
            raw={"photo_urls": photo_urls[:12], "badge": _badge(link)},
        )

    # --- boucle principale ------------------------------------------------ #
    def fetch_listings(self, query: ScrapeQuery) -> Iterator[Listing]:
        geo_ids: list[int] = []
        for postal_code in query.postal_codes:
            geo_ids.extend(self._resolve_geo_ids(postal_code))
        geo_ids = list(dict.fromkeys(geo_ids))  # dédup en gardant l'ordre
        if not geo_ids:
            raise ScraperError(
                "PAP : aucune zone résolue via /json/ac-geo "
                "(vérifier target_postal_codes / accès réseau)."
            )

        seen: set[str] = set()
        for geo_id in geo_ids:
            page = 1
            empty_or_repeat = 0
            while len(seen) < query.max_results:
                html = self._fetch_html(self._search_url(geo_id, query, page))
                listings = self.parse_html(html)
                new_on_page = 0
                for listing in listings:
                    if listing.source_id in seen:
                        continue
                    seen.add(listing.source_id)
                    new_on_page += 1
                    yield listing
                    if len(seen) >= query.max_results:
                        return
                # Fin de zone : page vide ou ne ramenant que des doublons.
                if new_on_page == 0:
                    empty_or_repeat += 1
                    if empty_or_repeat >= 1:
                        break
                page += 1
                if page > 50:  # garde-fou anti-boucle
                    break


def _is_challenge(html: str) -> bool:
    return any(marker in html for marker in _CHALLENGE_MARKERS)


def _badge(link: object) -> str | None:
    """Récupère le badge ("exclusif"…) depuis le JSON data-piano-sp-click, si présent."""
    from selectolax.parser import Node

    if not isinstance(link, Node):
        return None
    raw = link.attributes.get("data-piano-sp-click")
    if not raw:
        return None
    try:
        return str(json.loads(raw).get("badge_annonce") or "") or None
    except (json.JSONDecodeError, AttributeError):
        return None

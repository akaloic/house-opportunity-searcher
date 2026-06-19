"""Transport : accès actuel + LE PARI SUR L'AVENIR (Grand Paris Express).

Deux briques :
  - StaticGPEReference : futures gares géolocalisées (open data Société du Grand Paris).
  - WebSearchProvider : recherche web (Tavily/Serper) pour rafraîchir les calendriers,
    souvent mouvants. Best-effort, non bloquant : si ça tombe, on garde le statique.
"""

from __future__ import annotations

import contextlib
import json
from pathlib import Path
from typing import Protocol

from chasseur.config import SearchConfig
from chasseur.enrich.geo import haversine_m
from chasseur.models import FutureStation, Listing, TransportContext


# --------------------------------------------------------------------------- #
#  Recherche web (futurs transports)
# --------------------------------------------------------------------------- #
class WebSearchProvider(Protocol):
    def search(self, query: str) -> list[str]: ...


class NullSearchProvider:
    """Désactivé : aucune requête réseau."""

    def search(self, query: str) -> list[str]:
        return []


class TavilyProvider:
    def __init__(self, api_key: str, max_results: int = 5) -> None:
        self._api_key = api_key
        self._max_results = max_results

    def search(self, query: str) -> list[str]:
        import requests  # lazy : dépendance optionnelle [alert]

        resp = requests.post(
            "https://api.tavily.com/search",
            json={"api_key": self._api_key, "query": query, "max_results": self._max_results},
            timeout=15,
        )
        resp.raise_for_status()
        return [item.get("content", "") for item in resp.json().get("results", [])]


class SerperProvider:
    def __init__(self, api_key: str, max_results: int = 5) -> None:
        self._api_key = api_key
        self._max_results = max_results

    def search(self, query: str) -> list[str]:
        import requests  # lazy

        resp = requests.post(
            "https://google.serper.dev/search",
            headers={"X-API-KEY": self._api_key},
            json={"q": query, "num": self._max_results},
            timeout=15,
        )
        resp.raise_for_status()
        return [item.get("snippet", "") for item in resp.json().get("organic", [])]


def build_search_provider(cfg: SearchConfig) -> WebSearchProvider:
    if cfg.provider == "tavily" and cfg.tavily_api_key:
        return TavilyProvider(cfg.tavily_api_key, cfg.max_results)
    if cfg.provider == "serper" and cfg.serper_api_key:
        return SerperProvider(cfg.serper_api_key, cfg.max_results)
    return NullSearchProvider()


# --------------------------------------------------------------------------- #
#  Futures gares (statique géolocalisé)
# --------------------------------------------------------------------------- #
class StaticGPEReference:
    def __init__(self, stations: list[dict[str, object]]) -> None:
        self._stations = stations

    @classmethod
    def from_file(cls, path: str | Path) -> StaticGPEReference:
        payload = json.loads(Path(path).read_text(encoding="utf-8"))
        return cls(payload["stations"])

    def nearby(self, lat: float, lon: float, max_radius_m: float) -> list[FutureStation]:
        out: list[FutureStation] = []
        for s in self._stations:
            dist = haversine_m(lat, lon, float(s["lat"]), float(s["lon"]))  # type: ignore[arg-type]
            if dist <= max_radius_m:
                out.append(
                    FutureStation(
                        name=str(s["name"]),
                        line=str(s["line"]),
                        distance_m=round(dist),
                        opening_year=int(s["opening_year"]),  # type: ignore[arg-type]
                        source=str(s.get("source", "")),
                    )
                )
        return sorted(out, key=lambda x: x.distance_m)


def build_transport_context(
    listing: Listing,
    gpe_ref: StaticGPEReference,
    *,
    max_radius_m: float,
    defense_minutes: float | None = None,
    current_station_m: float | None = None,
    search_provider: WebSearchProvider | None = None,
) -> TransportContext:
    """Assemble le contexte transport. ``checked=False`` si on n'a pas de géoloc."""
    if listing.lat is None or listing.lon is None:
        return TransportContext(checked=False, defense_minutes=defense_minutes)

    futures = gpe_ref.nearby(listing.lat, listing.lon, max_radius_m)

    # Augmentation web (best-effort) : rafraîchir les calendriers d'ouverture.
    # NB : transformer les résultats web en FutureStation fiables est le point
    # d'intégration laissé à brancher (parsing dépendant du fournisseur) — cf README.
    # best-effort : ne doit jamais casser le pipeline (cf. mode dégradé)
    if (
        search_provider is not None
        and not isinstance(search_provider, NullSearchProvider)
        and listing.city
    ):
        with contextlib.suppress(Exception):
            search_provider.search(
                f"future gare Grand Paris Express {listing.city} date ouverture mise en service"
            )

    return TransportContext(
        current_station_m=current_station_m,
        future_stations=futures,
        checked=True,
        defense_minutes=defense_minutes,
    )

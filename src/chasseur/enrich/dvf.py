"""Référence de marché (décote) — médiane prix/m² du micro-quartier.

En démo : médianes statiques par code postal + typologie. En prod : agrégation DVF
réelle au niveau IRIS / rayon 400-600 m via PostGIS (DVFPostGISReference).
"""

from __future__ import annotations

import csv
import json
import statistics
import urllib.error
import urllib.request
from pathlib import Path
from typing import Protocol

from chasseur.enrich.geo import haversine_m
from chasseur.models import Listing, PropertyType

_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)


def _http_get(url: str, timeout: float = 30.0) -> str:
    """GET simple (stdlib, suit les redirects) — sources OUVERTES uniquement (DVF, geo.api)."""
    request = urllib.request.Request(url, headers={"User-Agent": _UA})
    with urllib.request.urlopen(request, timeout=timeout) as resp:  # noqa: S310
        return resp.read().decode("utf-8", errors="replace")


class MarketReference(Protocol):
    def median_ppm2(self, listing: Listing) -> float | None: ...


class StaticMarketReference:
    """Médianes pré-agrégées (postal_code, property_type) -> prix/m²."""

    def __init__(self, medians: list[dict[str, object]]) -> None:
        self._index: dict[tuple[str, str], float] = {}
        for row in medians:
            key = (str(row["postal_code"]), str(row["property_type"]))
            self._index[key] = float(row["median_ppm2"])  # type: ignore[arg-type]

    @classmethod
    def from_file(cls, path: str | Path) -> StaticMarketReference:
        payload = json.loads(Path(path).read_text(encoding="utf-8"))
        return cls(payload["medians"])

    def median_ppm2(self, listing: Listing) -> float | None:
        if listing.postal_code is None:
            return None
        return self._index.get((listing.postal_code, listing.property_type.value))


class DVFPostGISReference:
    """Squelette PROD : médiane DVF des transactions comparables en PostGIS.

    Requête type (à implémenter avec psycopg, base alimentée par l'open data DVF) :

        SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY valeur_fonciere / surface_reelle_bati)
        FROM dvf
        WHERE type_local = %(type)s
          AND date_mutation > now() - interval '24 months'
          AND ST_DWithin(geom::geography, ST_MakePoint(%(lon)s, %(lat)s)::geography, %(radius_m)s);

    Penser à ré-indexer les prix (indice Notaires-INSEE) avant comparaison.
    """

    def __init__(self, dsn: str, radius_m: float = 500.0) -> None:
        self._dsn = dsn
        self._radius_m = radius_m

    def median_ppm2(self, listing: Listing) -> float | None:
        raise NotImplementedError(
            "Brancher PostGIS + import DVF (voir docstring et README). "
            "En attendant, utiliser StaticMarketReference ou DVFGeoReference."
        )


class DVFGeoReference:
    """Médiane prix/m² RÉELLE depuis l'open data DVF (DGFiP/Etalab) — décote réelle.

    1. code postal -> INSEE via geo.api.gouv.fr (officiel).
    2. CSV geo-dvf de la commune (téléchargé puis mis en cache disque).
    3. médiane €/m² des ventes comparables : au RAYON (micro-quartier) si assez de
       points autour du bien, sinon repli sur toute la commune.

    Mode dégradé : toute erreur réseau/données -> None (le scoring neutralise la décote).
    """

    _GEO_DVF = "https://files.data.gouv.fr/geo-dvf/latest/csv/{year}/communes/{dep}/{insee}.csv"
    _GEO_API = "https://geo.api.gouv.fr/communes?codePostal={postal}&fields=code"
    _TYPE = {PropertyType.apartment: "Appartement", PropertyType.house: "Maison"}

    def __init__(
        self,
        *,
        cache_dir: str | Path,
        year: str = "2024",
        radius_m: float = 700.0,
        min_points: int = 8,
    ) -> None:
        self._cache_dir = Path(cache_dir)
        self._cache_dir.mkdir(parents=True, exist_ok=True)
        self._year = str(year)
        self._radius_m = radius_m
        self._min_points = min_points
        self._insee_cache: dict[str, str | None] = {}
        self._rows_cache: dict[tuple[str, str], list[tuple[float | None, float | None, float]]] = {}

    def _insee_for_postal(self, postal: str) -> str | None:
        if postal in self._insee_cache:
            return self._insee_cache[postal]
        insee: str | None = None
        try:
            data = json.loads(_http_get(self._GEO_API.format(postal=postal), timeout=15))
            if data:
                insee = str(data[0]["code"])
        except (urllib.error.URLError, ValueError, KeyError, OSError):
            insee = None
        self._insee_cache[postal] = insee
        return insee

    def _csv_text(self, insee: str) -> str | None:
        cache = self._cache_dir / f"{self._year}-{insee}.csv"
        if cache.exists():
            return cache.read_text(encoding="utf-8")
        url = self._GEO_DVF.format(year=self._year, dep=insee[:2], insee=insee)
        try:
            text = _http_get(url, timeout=45)
        except (urllib.error.URLError, OSError):
            return None
        cache.write_text(text, encoding="utf-8")
        return text

    def _rows(self, insee: str, target_type: str) -> list[tuple[float | None, float | None, float]]:
        key = (insee, target_type)
        if key in self._rows_cache:
            return self._rows_cache[key]
        rows: list[tuple[float | None, float | None, float]] = []
        text = self._csv_text(insee)
        if text:
            for record in csv.DictReader(text.splitlines()):
                if (
                    record.get("type_local") != target_type
                    or record.get("nature_mutation") != "Vente"
                ):
                    continue
                try:
                    valeur = float(record["valeur_fonciere"])
                    surface = float(record["surface_reelle_bati"])
                    lots = int(record.get("nombre_lots") or 0)
                except (TypeError, ValueError):
                    continue
                # anti-bruit : lots multiples, garages, surfaces aberrantes
                if surface < 9 or valeur < 30_000 or lots > 3:
                    continue
                ppm2 = valeur / surface
                if not 1000 < ppm2 < 30_000:
                    continue
                try:
                    lat: float | None = float(record["latitude"])
                    lon: float | None = float(record["longitude"])
                except (TypeError, ValueError):
                    lat = lon = None
                rows.append((lat, lon, ppm2))
        self._rows_cache[key] = rows
        return rows

    def median_ppm2(self, listing: Listing) -> float | None:
        if listing.postal_code is None:
            return None
        insee = self._insee_for_postal(listing.postal_code)
        if insee is None:
            return None
        rows = self._rows(insee, self._TYPE.get(listing.property_type, "Appartement"))
        if not rows:
            return None
        if listing.lat is not None and listing.lon is not None:
            near = [
                ppm2
                for (lat, lon, ppm2) in rows
                if lat is not None
                and lon is not None
                and haversine_m(listing.lat, listing.lon, lat, lon) <= self._radius_m
            ]
            if len(near) >= self._min_points:
                return round(statistics.median(near), 1)
        return round(statistics.median([ppm2 for (_, _, ppm2) in rows]), 1)

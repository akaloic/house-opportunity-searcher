"""Référence de marché (décote) — médiane prix/m² du micro-quartier.

En démo : médianes statiques par code postal + typologie. En prod : agrégation DVF
réelle au niveau IRIS / rayon 400-600 m via PostGIS (DVFPostGISReference).
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Protocol

from chasseur.models import Listing


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
            "En attendant, utiliser StaticMarketReference."
        )

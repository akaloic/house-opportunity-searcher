"""L'aimant La Défense : temps de trajet porte-à-porte (estimation).

Démo : heuristique hors-ligne (vol d'oiseau x détour réseau / vitesse + marche/attente).
Prod : brancher un vrai routing transit (Navitia / IDFM Île-de-France Mobilités, ou
l'API d'un fournisseur) via RoutingProvider pour un porte-à-porte précis.
"""

from __future__ import annotations

from typing import Protocol

from chasseur.config import ScoringConfig
from chasseur.enrich.geo import haversine_m
from chasseur.models import Listing

# Grande Arche de La Défense (coordonnées de référence).
LA_DEFENSE_LAT = 48.8918
LA_DEFENSE_LON = 2.2380


class RoutingProvider(Protocol):
    def door_to_door_minutes(
        self, lat: float, lon: float, dest_lat: float, dest_lon: float
    ) -> float | None: ...


def estimate_defense_minutes(listing: Listing, cfg: ScoringConfig) -> float | None:
    """Estimation grossière du porte-à-porte vers La Défense (à fiabiliser en prod)."""
    if listing.lat is None or listing.lon is None:
        return None
    straight_km = haversine_m(listing.lat, listing.lon, LA_DEFENSE_LAT, LA_DEFENSE_LON) / 1000.0
    network_km = straight_km * cfg.defense_detour_factor
    minutes = network_km / cfg.defense_avg_kmh * 60.0 + cfg.defense_access_overhead_min
    return round(minutes, 1)

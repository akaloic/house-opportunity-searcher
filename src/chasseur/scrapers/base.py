"""Contrat commun à tous les scrapers."""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Iterable
from dataclasses import dataclass, field

from chasseur.models import Listing


class ScraperError(Exception):
    """Erreur générique de scraping."""


class AntibotNotConfigured(ScraperError):
    """Le scraper live nécessite proxies / FlareSolverr / clés non configurés."""


@dataclass
class ScrapeQuery:
    postal_codes: list[str] = field(default_factory=list)
    price_max: float | None = None
    surface_min: float | None = None
    surface_max: float | None = None
    max_results: int = 50


class Scraper(ABC):
    """Tout portail expose la même méthode : une requête -> des annonces normalisées."""

    name: str = "base"
    requires_antibot: bool = True

    @abstractmethod
    def fetch_listings(self, query: ScrapeQuery) -> Iterable[Listing]:
        """Renvoie des Listing normalisés. Doit être un mode dégradé sûr en cas d'échec."""
        raise NotImplementedError

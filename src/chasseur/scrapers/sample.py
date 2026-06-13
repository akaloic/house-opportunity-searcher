"""Scraper d'échantillon : lit des fixtures locales. Pilote toute la démo hors-ligne."""

from __future__ import annotations

import json
from collections.abc import Iterable
from pathlib import Path

from chasseur.models import Listing
from chasseur.scrapers.base import Scraper, ScrapeQuery


class SampleScraper(Scraper):
    name = "sample"
    requires_antibot = False

    def __init__(self, fixtures_path: str | Path) -> None:
        self._path = Path(fixtures_path)

    def fetch_listings(self, query: ScrapeQuery) -> Iterable[Listing]:
        rows = json.loads(self._path.read_text(encoding="utf-8"))
        for row in rows:
            yield Listing.model_validate(row)

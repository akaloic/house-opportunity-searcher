"""Scrapers : une interface commune, un scraper par portail. Zéro copier-coller."""

from __future__ import annotations

from chasseur.scrapers.base import AntibotNotConfigured, ScrapeQuery, Scraper, ScraperError

__all__ = ["AntibotNotConfigured", "Scraper", "ScraperError", "ScrapeQuery"]

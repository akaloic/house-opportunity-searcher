"""Scrapers : une interface commune, un scraper par portail. Zéro copier-coller."""

from __future__ import annotations

from chasseur.scrapers.base import AntibotNotConfigured, Scraper, ScraperError, ScrapeQuery

__all__ = ["AntibotNotConfigured", "Scraper", "ScraperError", "ScrapeQuery"]

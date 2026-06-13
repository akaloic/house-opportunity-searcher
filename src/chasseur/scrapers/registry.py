"""Fabrique de scrapers : nom -> instance, avec injection de la session anti-bot."""

from __future__ import annotations

from chasseur.config import Settings
from chasseur.scrapers.base import Scraper
from chasseur.scrapers.sample import SampleScraper

LIVE_SCRAPERS = ("leboncoin", "seloger", "bienici", "pap")


def build_scraper(name: str, settings: Settings) -> Scraper:
    if name == "sample":
        return SampleScraper(settings.fixtures_path)

    if name not in LIVE_SCRAPERS:
        raise ValueError(f"Scraper inconnu : {name!r}")

    # Les scrapers live partagent une session furtive (rate-limit/proxies/backoff).
    from chasseur.antibot.session import StealthSession

    session = StealthSession(settings.antibot)

    if name == "leboncoin":
        from chasseur.scrapers.leboncoin import LeBonCoinScraper

        return LeBonCoinScraper(session)
    if name == "seloger":
        from chasseur.scrapers.seloger import SeLogerScraper

        return SeLogerScraper(session)
    if name == "bienici":
        from chasseur.scrapers.bienici import BienIciScraper

        return BienIciScraper(session, min_price=settings.bienici_min_price)
    from chasseur.scrapers.pap import PapScraper

    return PapScraper(session)

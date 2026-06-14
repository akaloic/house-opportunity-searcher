"""Test e2e navigateur du dashboard — rend la page dans Chrome et vérifie le RÉEL.

Désactivé par défaut (navigateur + internet requis). Activer avec :
    CHASSEUR_E2E=1 pytest tests/test_dashboard_e2e.py -s

Génère des données démo déterministes (une fixture porte une photo data-URI), sert
``web/`` en local, pilote Chrome (canal système) et asserte : montage sans erreur JS,
tuiles de carte chargées, photo affichée, navigation, ouverture de fiche, bouton
« Voir l'annonce » qui ouvre la vraie URL, tri du flux, favoris.
"""

from __future__ import annotations

import functools
import http.server
import os
import socketserver
import threading
from datetime import datetime
from pathlib import Path

import pytest

pytestmark = pytest.mark.skipif(
    os.environ.get("CHASSEUR_E2E") != "1",
    reason="test e2e navigateur ; définir CHASSEUR_E2E=1 pour l'activer",
)

WEB = Path(__file__).resolve().parent.parent / "web"
DATA_LIVE = WEB / "ui_kits" / "pepite-dashboard" / "data.live.js"


def _write_demo_data() -> str:
    from chasseur.config import Settings
    from chasseur.dashboard.webexport import write_data_live
    from chasseur.pipeline import run_pipeline
    from chasseur.storage.db import SQLiteStore

    settings = Settings()
    now = datetime.now()
    store = SQLiteStore(":memory:")
    results, summary = run_pipeline(settings, demo=True, now=now, store=store, notify=False)
    write_data_live(DATA_LIVE, results, summary, settings, now)
    store.close()
    return DATA_LIVE.read_text(encoding="utf-8")


def _first_feed_title(page) -> str:
    titles = page.eval_on_selector_all(
        "button", "els => els.map(e => e.innerText).filter(t => t.includes('€/m²'))"
    )
    return titles[0] if titles else ""


def test_dashboard_end_to_end() -> None:
    sync_api = pytest.importorskip("playwright.sync_api")

    original = DATA_LIVE.read_text(encoding="utf-8") if DATA_LIVE.exists() else None
    _write_demo_data()

    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(WEB))
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{port}/ui_kits/pepite-dashboard/index.html"

    page_errors: list[str] = []
    try:
        with sync_api.sync_playwright() as p:
            try:
                browser = p.chromium.launch(channel="chrome", headless=True)
            except Exception as exc:  # noqa: BLE001
                pytest.skip(f"Chrome indisponible : {exc}")
            page = browser.new_page(viewport={"width": 1440, "height": 900})
            page.on("pageerror", lambda e: page_errors.append(str(e)))
            page.goto(url, wait_until="networkidle", timeout=30000)
            page.wait_for_timeout(2500)

            # 1. montage sans erreur JS
            assert not page_errors, f"erreurs JS : {page_errors}"
            assert page.eval_on_selector("#app", "el => el.children.length") > 0

            # 2. carte Leaflet : tuiles réellement chargées
            tiles_loaded = page.eval_on_selector_all(
                "img.leaflet-tile", "els => els.filter(i => i.naturalWidth > 0).length"
            )
            assert tiles_loaded > 0, "aucune tuile de carte chargée"
            assert page.eval_on_selector_all(".leaflet-marker-icon", "els => els.length") > 0

            # 3. photo du flux affichée (data-URI déterministe sur la fixture pépite)
            page.wait_for_timeout(500)
            photo_ok = page.eval_on_selector_all(
                "img", "els => els.filter(i => i.src.startsWith('data:') && i.naturalWidth > 0).length"
            )
            assert photo_ok > 0, "la vignette photo (data-URI) ne s'est pas affichée"

            # 4. navigation latérale : chaque vue change le titre
            for label, expected in [
                ("Moteur de scoring", "Moteur de scoring"),
                ("Monitoring", "Monitoring technique"),
                ("Dashboard", "Dashboard"),
            ]:
                page.get_by_role("button", name=label, exact=True).first.click()
                page.wait_for_timeout(300)
                assert expected in page.locator("h1").first.inner_text()

            # 5. tri du flux : "Frais" change la 1re ligne
            score_first = _first_feed_title(page)
            page.get_by_role("tab", name="Frais", exact=True).first.click()
            page.wait_for_timeout(400)
            assert _first_feed_title(page) != score_first, "le tri 'Frais' n'a rien changé"

            # 6. ouverture de fiche -> justification du score visible
            page.get_by_text("Ouvrir la fiche").first.click()
            page.wait_for_timeout(700)
            assert page.get_by_text("Justification du score").count() > 0

            # 7. "Voir l'annonce" ouvre la vraie URL (nouvel onglet noopener -> event page)
            with page.context.expect_page() as popup_info:
                page.get_by_role("button", name="Voir l'annonce").first.click()
            assert popup_info.value.url, "'Voir l'annonce' n'ouvre rien"

            # 8. favoris : "Suivre" -> l'onglet Favoris en compte au moins 1
            page.get_by_role("button", name="Suivre", exact=True).first.click()
            page.wait_for_timeout(300)
            page.get_by_role("button", name="Dashboard", exact=True).first.click()
            page.wait_for_timeout(300)
            fav_count = page.evaluate("() => window.PepiteFav.list().length")
            assert fav_count >= 1, "le favori n'a pas été enregistré"

            browser.close()
    finally:
        httpd.shutdown()
        if original is not None:
            DATA_LIVE.write_text(original, encoding="utf-8")

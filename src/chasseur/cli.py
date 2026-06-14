"""CLI du Robot-Chasseur.

Commandes :
  run         — lance le pipeline (``--demo`` = fixtures hors-ligne) et affiche les leads.
  score-file  — score une annonce JSON unique (debug du moteur).
  export-web  — exporte les leads réels vers le dashboard Pépite (data.live.js).
  serve-web   — sert le dashboard sur http://localhost:PORT.
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path

from chasseur.config import Settings, get_settings
from chasseur.dashboard.webexport import write_data_live
from chasseur.models import Listing
from chasseur.pipeline import RunSummary, ScoredListing, build_refs, enrich_listing, run_pipeline
from chasseur.scoring import score_listing

DEFAULT_WEB_DIR = Path("web")
DEFAULT_WEB_DATA = DEFAULT_WEB_DIR / "ui_kits" / "pepite-dashboard" / "data.live.js"


def _print_summary(results: list[ScoredListing], summary: RunSummary) -> None:
    print(
        f"\n📊 Scannées={summary.scanned}  retenues={summary.kept}  "
        f"hors-budget={summary.excluded_budget}  scorées={summary.scored}  "
        f"alertes={summary.alerts}\n"
    )
    print("🏆 Top leads :")
    for sl in results[:8]:
        s = sl.score
        print(f"  {s.total:5.1f}/100  [{s.level.value:11}]  {sl.listing.title}  ({sl.listing.city})")
    if summary.outbox:
        print("\n🔔 Alertes (dry-run) :\n")
        for message in summary.outbox:
            print(message)
            print("-" * 64)


def _run(args: argparse.Namespace, settings: Settings, *, notify: bool, now: datetime | None = None):
    """Lance le pipeline en mode live (BienIci + DVF réels) ou démo/sample."""
    if getattr(args, "live", False):
        settings.market_source = "dvf"
        return run_pipeline(
            settings, scrapers=["bienici"], max_results=args.limit, now=now, notify=notify
        )
    return run_pipeline(settings, demo=args.demo, now=now, notify=notify)


def cmd_run(args: argparse.Namespace, settings: Settings) -> int:
    results, summary = _run(args, settings, notify=not args.no_notify)
    _print_summary(results, summary)
    return 0


def cmd_score_file(args: argparse.Namespace, settings: Settings) -> int:
    payload = json.loads(Path(args.path).read_text(encoding="utf-8"))
    if isinstance(payload, list):
        payload = payload[0]
    listing = Listing.model_validate(payload)
    refs = build_refs(settings)
    now = datetime.now()
    ctx = enrich_listing(listing, refs, settings, now.date())
    score = score_listing(listing, ctx, settings.scoring, as_of=now.date())
    print(json.dumps(score.model_dump(), ensure_ascii=False, indent=2))
    print(f"\n🎯 {score.recommendation}")
    return 0


def cmd_export_web(args: argparse.Namespace, settings: Settings) -> int:
    now = datetime.now()
    results, summary = _run(args, settings, notify=False, now=now)
    out = write_data_live(args.output, results, summary, settings, now)
    print(f"✅ {len(results)} leads exportés vers {out}")
    print(f"   Lance le dashboard :  chasseur serve-web   (puis ouvre l'URL affichée)")
    return 0


def cmd_serve_web(args: argparse.Namespace, settings: Settings) -> int:
    import functools
    import http.server
    import socketserver

    class _Handler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self) -> None:  # dev : jamais de cache (évite les .jsx périmés)
            self.send_header("Cache-Control", "no-store, max-age=0")
            super().end_headers()

    handler = functools.partial(_Handler, directory=str(args.dir))
    with socketserver.TCPServer(("127.0.0.1", args.port), handler) as httpd:
        url = f"http://127.0.0.1:{args.port}/ui_kits/pepite-dashboard/index.html"
        print(f"🖥️  Dashboard Pépite :  {url}")
        print("   (Ctrl+C pour arrêter)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Arrêt du serveur.")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="chasseur", description="Robot-chasseur immobilier IDF")
    sub = parser.add_subparsers(dest="command", required=True)

    p_run = sub.add_parser("run", help="Lance le pipeline et affiche les leads")
    p_run.add_argument("--demo", action="store_true", help="Fixtures hors-ligne (aucune dépendance)")
    p_run.add_argument("--live", action="store_true", help="Scraping RÉEL BienIci + décote DVF réelle")
    p_run.add_argument("--limit", type=int, default=60, help="Nb max d'annonces (mode live)")
    p_run.add_argument("--no-notify", action="store_true", help="Ne pas déclencher les alertes")
    p_run.set_defaults(func=cmd_run)

    p_score = sub.add_parser("score-file", help="Score une annonce JSON unique")
    p_score.add_argument("path", help="Chemin du fichier JSON")
    p_score.set_defaults(func=cmd_score_file)

    p_export = sub.add_parser("export-web", help="Exporte les leads vers le dashboard Pépite")
    p_export.add_argument("--demo", action="store_true", help="Fixtures hors-ligne")
    p_export.add_argument("--live", action="store_true", help="Scraping RÉEL BienIci + décote DVF")
    p_export.add_argument("--limit", type=int, default=60, help="Nb max d'annonces (mode live)")
    p_export.add_argument("-o", "--output", default=str(DEFAULT_WEB_DATA), help="Fichier data.live.js")
    p_export.set_defaults(func=cmd_export_web)

    p_serve = sub.add_parser("serve-web", help="Sert le dashboard en local")
    p_serve.add_argument("--port", type=int, default=8000)
    p_serve.add_argument("--dir", default=str(DEFAULT_WEB_DIR), help="Racine web à servir")
    p_serve.set_defaults(func=cmd_serve_web)

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    settings = get_settings()
    func = args.func
    result: int = func(args, settings)
    return result


if __name__ == "__main__":
    raise SystemExit(main())

"""Persistance SQLite — suffit pour la dédup, l'historique et le cooldown d'alertes.

La géospatiale lourde (comparables DVF) vit dans enrich/dvf.py (PostGIS), pas ici :
ce store ne fait que mémoriser les annonces vues et les alertes envoyées.
"""

from __future__ import annotations

import json
import sqlite3
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path

from chasseur.models import Listing


@dataclass
class UpsertResult:
    is_new: bool
    seen_count: int


class SQLiteStore:
    def __init__(self, path: str | Path) -> None:
        self._conn = sqlite3.connect(str(path))
        self._conn.row_factory = sqlite3.Row
        self._init_schema()

    def _init_schema(self) -> None:
        self._conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS listings (
                dedup_key TEXT PRIMARY KEY,
                source TEXT, source_id TEXT,
                first_seen TEXT, last_seen TEXT,
                seen_count INTEGER DEFAULT 1,
                last_price REAL,
                payload TEXT
            );
            CREATE TABLE IF NOT EXISTS alerts (
                dedup_key TEXT, ts TEXT
            );
            CREATE INDEX IF NOT EXISTS idx_alerts_key ON alerts(dedup_key);
            """
        )
        self._conn.commit()

    def upsert(self, listing: Listing, now: datetime) -> UpsertResult:
        key = listing.dedup_key
        ts = now.isoformat()
        row = self._conn.execute(
            "SELECT seen_count FROM listings WHERE dedup_key = ?", (key,)
        ).fetchone()
        if row is None:
            self._conn.execute(
                "INSERT INTO listings (dedup_key, source, source_id, first_seen, last_seen, "
                "seen_count, last_price, payload) VALUES (?,?,?,?,?,?,?,?)",
                (
                    key,
                    listing.source.value,
                    listing.source_id,
                    ts,
                    ts,
                    1,
                    listing.price,
                    listing.model_dump_json(),
                ),
            )
            self._conn.commit()
            return UpsertResult(is_new=True, seen_count=1)
        seen = int(row["seen_count"]) + 1
        self._conn.execute(
            "UPDATE listings SET last_seen = ?, seen_count = ?, last_price = ?, payload = ? "
            "WHERE dedup_key = ?",
            (ts, seen, listing.price, listing.model_dump_json(), key),
        )
        self._conn.commit()
        return UpsertResult(is_new=False, seen_count=seen)

    def was_alerted(self, dedup_key: str, *, within_hours: float, now: datetime) -> bool:
        cutoff = (now - timedelta(hours=within_hours)).isoformat()
        row = self._conn.execute(
            "SELECT 1 FROM alerts WHERE dedup_key = ? AND ts >= ? LIMIT 1",
            (dedup_key, cutoff),
        ).fetchone()
        return row is not None

    def mark_alerted(self, dedup_key: str, now: datetime) -> None:
        self._conn.execute(
            "INSERT INTO alerts (dedup_key, ts) VALUES (?, ?)", (dedup_key, now.isoformat())
        )
        self._conn.commit()

    def close(self) -> None:
        self._conn.close()


class PostGISStore:
    """Squelette PROD : même rôle, mais en PostgreSQL/PostGIS pour le multi-process
    et les requêtes géospatiales. À implémenter avec psycopg quand on industrialise."""

    def __init__(self, dsn: str) -> None:
        self._dsn = dsn

    def upsert(self, listing: Listing, now: datetime) -> UpsertResult:
        raise NotImplementedError("Brancher psycopg + schéma PostGIS (voir README).")

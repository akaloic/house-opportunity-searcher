"""Stockage : dédup inter-portails, historique de prix, cooldown d'alertes."""

from __future__ import annotations

from chasseur.storage.db import SQLiteStore, UpsertResult

__all__ = ["SQLiteStore", "UpsertResult"]

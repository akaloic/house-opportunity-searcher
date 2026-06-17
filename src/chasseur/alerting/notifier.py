"""Orchestrateur d'alertes : cooldown anti-spam, dry-run par défaut, multi-canal."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Protocol

from chasseur.alerting.email import EmailNotifier
from chasseur.alerting.formatter import format_alert, format_subject
from chasseur.alerting.telegram import TelegramNotifier
from chasseur.config import AlertConfig
from chasseur.models import EnrichedContext, Listing, Score


class AlertStore(Protocol):
    def was_alerted(self, dedup_key: str, *, within_hours: float, now: datetime) -> bool: ...
    def mark_alerted(self, dedup_key: str, now: datetime) -> None: ...


@dataclass
class Notifier:
    cfg: AlertConfig
    store: AlertStore | None = None
    outbox: list[str] = field(default_factory=list)  # messages en dry-run (inspection/tests)

    def maybe_notify(
        self, listing: Listing, score: Score, ctx: EnrichedContext, now: datetime
    ) -> bool:
        key = listing.dedup_key
        if self.store is not None and self.store.was_alerted(
            key, within_hours=self.cfg.cooldown_hours, now=now
        ):
            return False  # déjà alerté récemment — on ne harcèle pas

        subject = format_subject(listing, score)
        body = format_alert(listing, score, ctx)

        if self.cfg.dry_run:
            self.outbox.append(f"{subject}\n{body}")
        else:
            self._dispatch(subject, body)

        if self.store is not None:
            self.store.mark_alerted(key, now)
        return True

    def _dispatch(self, subject: str, body: str) -> None:
        if self.cfg.telegram_bot_token and self.cfg.telegram_chat_id:
            TelegramNotifier(self.cfg.telegram_bot_token, self.cfg.telegram_chat_id).send(
                f"{subject}\n{body}"
            )
        if self.cfg.smtp_host and self.cfg.email_to:
            EmailNotifier(
                self.cfg.smtp_host,
                self.cfg.smtp_port,
                self.cfg.smtp_user,
                self.cfg.smtp_password,
                self.cfg.email_to,
                use_ssl=self.cfg.smtp_ssl,
                sender=self.cfg.email_from,
            ).send(subject, body)

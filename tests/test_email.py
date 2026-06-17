"""Envoi e-mail : on valide le chemin SMTP en mockant ``smtplib`` (aucun réseau)."""

from __future__ import annotations

import smtplib
from unittest import mock

from chasseur.alerting.email import EmailNotifier


def test_starttls_send_authenticates_and_sends() -> None:
    notifier = EmailNotifier("smtp.example.com", 587, "u@example.com", "pw", "to@example.com")
    with mock.patch("smtplib.SMTP") as smtp:
        server = smtp.return_value.__enter__.return_value
        notifier.send("Sujet", "Corps")
    smtp.assert_called_once_with("smtp.example.com", 587, timeout=mock.ANY)
    server.starttls.assert_called_once()
    server.login.assert_called_once_with("u@example.com", "pw")
    server.send_message.assert_called_once()
    msg = server.send_message.call_args.args[0]
    assert msg["To"] == "to@example.com"
    assert msg["From"] == "u@example.com"
    assert msg["Subject"] == "Sujet"


def test_ssl_send_uses_smtp_ssl() -> None:
    notifier = EmailNotifier(
        "smtp.example.com", 465, "u@example.com", "pw", "to@example.com", use_ssl=True
    )
    with mock.patch("smtplib.SMTP_SSL") as smtp_ssl:
        server = smtp_ssl.return_value.__enter__.return_value
        notifier.send("S", "B")
    smtp_ssl.assert_called_once_with("smtp.example.com", 465, timeout=mock.ANY)
    server.login.assert_called_once_with("u@example.com", "pw")
    server.send_message.assert_called_once()


def test_starttls_unsupported_falls_back_to_plain() -> None:
    notifier = EmailNotifier("localhost", 25, None, None, "to@example.com")
    with mock.patch("smtplib.SMTP") as smtp:
        server = smtp.return_value.__enter__.return_value
        server.starttls.side_effect = smtplib.SMTPException("no STARTTLS")
        notifier.send("S", "B")  # ne doit pas lever
    server.send_message.assert_called_once()
    server.login.assert_not_called()  # pas d'identifiants -> pas de login

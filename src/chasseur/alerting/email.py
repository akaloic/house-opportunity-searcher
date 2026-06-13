"""Canal e-mail (SMTP, stdlib smtplib)."""

from __future__ import annotations

import smtplib
from email.message import EmailMessage


class EmailNotifier:
    def __init__(
        self, host: str, port: int, user: str | None, password: str | None, recipient: str
    ) -> None:
        self._host = host
        self._port = port
        self._user = user
        self._password = password
        self._recipient = recipient

    def send(self, subject: str, body: str) -> None:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = self._user or "chasseur@localhost"
        msg["To"] = self._recipient
        msg.set_content(body)

        with smtplib.SMTP(self._host, self._port, timeout=20) as server:
            server.starttls()
            if self._user and self._password:
                server.login(self._user, self._password)
            server.send_message(msg)

"""Canal e-mail (SMTP, stdlib smtplib).

Gère les trois cas réels :
  * SSL implicite (port 465)  -> ``use_ssl=True`` -> ``SMTP_SSL``.
  * STARTTLS (port 587)       -> tentative ``starttls()`` puis login.
  * relais local en clair      -> si STARTTLS indisponible, on continue sans (cibles internes).
"""

from __future__ import annotations

import smtplib
from email.message import EmailMessage


class EmailNotifier:
    def __init__(
        self,
        host: str,
        port: int,
        user: str | None,
        password: str | None,
        recipient: str,
        *,
        use_ssl: bool = False,
        sender: str | None = None,
        timeout: float = 20.0,
    ) -> None:
        self._host = host
        self._port = port
        self._user = user
        self._password = password
        self._recipient = recipient
        self._use_ssl = use_ssl
        self._sender = sender or user or "chasseur@localhost"
        self._timeout = timeout

    def _build(self, subject: str, body: str) -> EmailMessage:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = self._sender
        msg["To"] = self._recipient
        msg.set_content(body)
        return msg

    def send(self, subject: str, body: str) -> None:
        msg = self._build(subject, body)
        if self._use_ssl:
            with smtplib.SMTP_SSL(self._host, self._port, timeout=self._timeout) as server:
                if self._user and self._password:
                    server.login(self._user, self._password)
                server.send_message(msg)
            return

        with smtplib.SMTP(self._host, self._port, timeout=self._timeout) as server:
            server.ehlo()
            try:
                server.starttls()
                server.ehlo()
            except smtplib.SMTPException:
                pass  # serveur sans STARTTLS (relais local) -> envoi en clair, on n'échoue pas
            if self._user and self._password:
                server.login(self._user, self._password)
            server.send_message(msg)

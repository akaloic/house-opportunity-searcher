"""Canal Telegram (Bot API). requests en lazy import (dépendance optionnelle [alert])."""

from __future__ import annotations


class TelegramNotifier:
    def __init__(self, bot_token: str, chat_id: str) -> None:
        self._token = bot_token
        self._chat_id = chat_id

    def send(self, text: str) -> None:
        import requests

        resp = requests.post(
            f"https://api.telegram.org/bot{self._token}/sendMessage",
            json={"chat_id": self._chat_id, "text": text, "disable_web_page_preview": False},
            timeout=15,
        )
        resp.raise_for_status()

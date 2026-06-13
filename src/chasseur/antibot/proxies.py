"""Pool de proxies résidentiels avec mise au repos des IP cramées."""

from __future__ import annotations

import time
from dataclasses import dataclass


@dataclass
class _ProxyState:
    url: str
    cooldown_until: float = 0.0


class ProxyPool:
    def __init__(self, proxies: list[str], cooldown_s: float = 900.0) -> None:
        self._proxies = [_ProxyState(url) for url in proxies]
        self._cooldown_s = cooldown_s
        self._cursor = 0

    def __bool__(self) -> bool:
        return bool(self._proxies)

    def acquire(self) -> str | None:
        """Renvoie un proxy frais en rotation, ou None si aucun (ou tous cramés)."""
        if not self._proxies:
            return None
        now = time.monotonic()
        count = len(self._proxies)
        for _ in range(count):
            state = self._proxies[self._cursor % count]
            self._cursor += 1
            if state.cooldown_until <= now:
                return state.url
        return None  # tous en cooldown : on lèvera le pied en amont

    def report_failure(self, url: str) -> None:
        deadline = time.monotonic() + self._cooldown_s
        for state in self._proxies:
            if state.url == url:
                state.cooldown_until = deadline

    def report_success(self, url: str) -> None:
        for state in self._proxies:
            if state.url == url:
                state.cooldown_until = 0.0

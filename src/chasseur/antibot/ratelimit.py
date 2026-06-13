"""Token bucket par domaine — on reste poli, jamais de cadence métronomique."""

from __future__ import annotations

import time
from dataclasses import dataclass, field


@dataclass
class TokenBucket:
    rate_per_min: float
    capacity: float = 0.0
    _tokens: float = field(init=False, default=0.0)
    _last: float = field(init=False, default=0.0)

    def __post_init__(self) -> None:
        if self.capacity <= 0:
            self.capacity = max(1.0, self.rate_per_min)
        self._tokens = self.capacity
        self._last = time.monotonic()

    def _refill(self) -> None:
        now = time.monotonic()
        elapsed = now - self._last
        self._last = now
        self._tokens = min(self.capacity, self._tokens + elapsed * (self.rate_per_min / 60.0))

    def try_acquire(self, tokens: float = 1.0) -> bool:
        self._refill()
        if self._tokens >= tokens:
            self._tokens -= tokens
            return True
        return False

    def time_until(self, tokens: float = 1.0) -> float:
        """Secondes à attendre avant de pouvoir consommer ``tokens`` jetons."""
        self._refill()
        if self._tokens >= tokens:
            return 0.0
        deficit = tokens - self._tokens
        return deficit / (self.rate_per_min / 60.0)

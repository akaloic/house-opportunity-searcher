"""Session HTTP furtive : curl_cffi (impersonation TLS/JA3) -> httpx -> urllib (dégradé).

Politique : token bucket par domaine + jitter aléatoire + rotation de proxies +
backoff exponentiel + circuit breaker. Le backend le plus furtif disponible est choisi
automatiquement ; sans dépendance installée, on retombe sur urllib (ne contourne RIEN,
c'est volontairement honnête : à utiliser seulement pour des cibles non protégées).
"""

from __future__ import annotations

import random
import time
from dataclasses import dataclass
from urllib.parse import urlsplit

from chasseur.antibot import fingerprint
from chasseur.antibot.proxies import ProxyPool
from chasseur.antibot.ratelimit import TokenBucket
from chasseur.config import AntibotConfig


class AntibotError(Exception):
    """Réponse de type anti-bot (403/429) ou échec réseau assimilé."""


class CircuitOpen(AntibotError):
    """Le disjoncteur du domaine est ouvert : on a trop insisté, on patiente."""


@dataclass
class FetchResult:
    status_code: int
    text: str
    url: str


class StealthSession:
    def __init__(self, cfg: AntibotConfig) -> None:
        self._cfg = cfg
        self._buckets: dict[str, TokenBucket] = {}
        self._failures: dict[str, int] = {}
        self._open_until: dict[str, float] = {}
        self._proxies = ProxyPool(cfg.proxies, cfg.circuit_break_cooldown_s)
        self._backend = self._select_backend()

    @property
    def backend(self) -> str:
        return self._backend

    @staticmethod
    def _select_backend() -> str:
        try:
            import curl_cffi  # noqa: F401

            return "curl_cffi"
        except ImportError:
            pass
        try:
            import httpx  # noqa: F401

            return "httpx"
        except ImportError:
            return "urllib"

    @staticmethod
    def _domain(url: str) -> str:
        return urlsplit(url).netloc

    def _bucket(self, domain: str) -> TokenBucket:
        if domain not in self._buckets:
            self._buckets[domain] = TokenBucket(rate_per_min=self._cfg.max_rpm)
        return self._buckets[domain]

    def _respect_rate(self, domain: str) -> None:
        bucket = self._bucket(domain)
        wait = bucket.time_until()
        if wait > 0:
            time.sleep(wait)
        bucket.try_acquire()
        # Jitter : un humain n'est jamais régulier.
        time.sleep(random.uniform(self._cfg.min_delay_s, self._cfg.max_delay_s))

    def _check_circuit(self, domain: str) -> None:
        if time.monotonic() < self._open_until.get(domain, 0.0):
            raise CircuitOpen(f"Disjoncteur ouvert sur {domain} — on lève le pied.")

    def _record_failure(self, domain: str) -> None:
        self._failures[domain] = self._failures.get(domain, 0) + 1
        if self._failures[domain] >= self._cfg.circuit_break_threshold:
            self._open_until[domain] = time.monotonic() + self._cfg.circuit_break_cooldown_s
            self._failures[domain] = 0

    def _record_success(self, domain: str) -> None:
        self._failures[domain] = 0

    def get(
        self, url: str, *, headers: dict[str, str] | None = None, impersonate: str | None = None
    ) -> FetchResult:
        domain = self._domain(url)
        self._check_circuit(domain)
        last_exc: Exception | None = None
        for attempt in range(self._cfg.max_retries):
            self._respect_rate(domain)
            proxy = self._proxies.acquire()
            try:
                result = self._raw_get(url, headers, proxy, impersonate or self._cfg.impersonate)
                if result.status_code in (403, 429):
                    if proxy:
                        self._proxies.report_failure(proxy)
                    raise AntibotError(f"{result.status_code} anti-bot sur {domain}")
                self._record_success(domain)
                if proxy:
                    self._proxies.report_success(proxy)
                return result
            except AntibotError as exc:
                last_exc = exc
                self._record_failure(domain)
                time.sleep(2 ** attempt)  # backoff exponentiel
        raise last_exc or AntibotError(f"Échec de récupération sur {domain}")

    def _raw_get(
        self, url: str, headers: dict[str, str] | None, proxy: str | None, impersonate: str
    ) -> FetchResult:
        merged = fingerprint.headers_for(impersonate)
        if headers:
            merged.update(headers)

        if self._backend == "curl_cffi":
            from curl_cffi import requests as creq  # type: ignore[import-not-found]

            proxies = {"http": proxy, "https": proxy} if proxy else None
            resp = creq.get(
                url, headers=merged, impersonate=impersonate, proxies=proxies, timeout=20
            )
            return FetchResult(resp.status_code, resp.text, url)

        if self._backend == "httpx":
            import httpx

            resp = httpx.get(
                url, headers=merged, proxy=proxy, timeout=20, follow_redirects=True
            )
            return FetchResult(resp.status_code, resp.text, str(resp.url))

        # Dégradé : urllib (aucun contournement — cibles non protégées uniquement).
        import urllib.request

        request = urllib.request.Request(url, headers=merged)
        with urllib.request.urlopen(request, timeout=20) as resp:  # noqa: S310
            body = resp.read().decode("utf-8", errors="replace")
            return FetchResult(getattr(resp, "status", 200), body, url)

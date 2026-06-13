"""Client FlareSolverr — résout les challenges Cloudflare / JS et renvoie HTML+cookies.

Service externe (Docker, cf docker-compose.yml). Toujours gérer timeout/indispo : si
FlareSolverr tombe, le scraper doit pouvoir basculer en mode dégradé sans planter.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class SolveResult:
    status: int
    html: str
    cookies: list[dict[str, object]]
    user_agent: str


class FlareSolverrClient:
    def __init__(self, endpoint: str, timeout_s: float = 60.0) -> None:
        self._endpoint = endpoint
        self._timeout_s = timeout_s

    def get(self, url: str) -> SolveResult:
        import requests  # lazy : dépendance optionnelle [alert]

        payload = {
            "cmd": "request.get",
            "url": url,
            "maxTimeout": int(self._timeout_s * 1000),
        }
        resp = requests.post(self._endpoint, json=payload, timeout=self._timeout_s + 5)
        resp.raise_for_status()
        solution = resp.json().get("solution", {})
        return SolveResult(
            status=int(solution.get("status", 0)),
            html=str(solution.get("response", "")),
            cookies=list(solution.get("cookies", [])),
            user_agent=str(solution.get("userAgent", "")),
        )

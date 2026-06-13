"""Sous-scores — fonctions PURES (entrée = données, sortie = nombre), 100% testables.

Chaque fonction renvoie un score normalisé dans [0, 1], ou ``None`` quand la donnée
nécessaire manque (mode dégradé géré en amont par le moteur).
"""

from __future__ import annotations

import math
from datetime import date

from chasseur.config import ScoringConfig
from chasseur.models import Listing, SellerSignals, TransportContext


def clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def days_online(listing: Listing, as_of: date) -> int | None:
    """Nombre de jours depuis la publication (munition de négociation)."""
    if listing.published_at is None:
        return None
    return max(0, (as_of - listing.published_at.date()).days)


def decote_subscore(
    listing: Listing, market_ppm2: float | None, cfg: ScoringConfig
) -> tuple[float | None, float | None]:
    """Le nerf de la guerre : prix/m² du bien vs médiane DVF du micro-quartier.

    Retourne (sous-score, decote_pct). decote_pct > 0 = sous le marché.
    """
    if not market_ppm2 or market_ppm2 <= 0:
        return None, None
    decote_pct = (market_ppm2 - listing.price_per_m2) / market_ppm2
    target = cfg.decote_target if cfg.decote_target > 0 else 1e-9
    return clamp(decote_pct / target), decote_pct


def futur_transport_subscore(
    transport: TransportContext, cfg: ScoringConfig, current_year: int
) -> float | None:
    """Le pari sur l'avenir : proximité d'une future gare, pondérée par l'horizon.

    Le marché price la hausse ~2-3 ans AVANT l'ouverture => l'horizon proche pèse plus.
    Si l'enrichissement n'a pas tourné => None (neutre). S'il a tourné sans rien trouver
    dans le rayon => 0.0 (pas d'upside, c'est une info, pas une absence d'info).
    """
    if not transport.checked:
        return None
    best = 0.0
    for station in transport.future_stations:
        years_until = station.opening_year - current_year
        if years_until <= 0:  # déjà ouverte => relève de l'accès actuel
            continue
        if station.distance_m > cfg.transport_max_radius_m:
            continue
        proximity = math.exp(-((station.distance_m / cfg.transport_future_scale_m) ** 2))
        best = max(best, proximity * cfg.horizon_factor(years_until))
    return best


def signaux_subscore(signals: SellerSignals) -> float:
    """Lire entre les lignes : urgence vendeur (bonus) vs red flags (malus)."""
    return clamp(0.5 + signals.urgency_score - signals.redflag_penalty)


def anciennete_subscore(listing: Listing, cfg: ScoringConfig, as_of: date) -> float | None:
    """Temps en ligne + baisses de prix = vendeur qui va craquer."""
    days = days_online(listing, as_of)
    if days is None:
        return None
    base = 1.0 - math.exp(-days / cfg.anciennete_tau_days)
    bonus = listing.price_drops() * cfg.price_drop_bonus
    return clamp(base + bonus)


def dpe_subscore(listing: Listing, cfg: ScoringConfig) -> tuple[float | None, list[str]]:
    """DPE = arme à double tranchant : décote/déficit foncier vs interdiction de louer."""
    if not listing.dpe:
        return None, ["DPE absent de l'annonce (à vérifier — souvent mauvais signe)"]
    dpe = listing.dpe.upper()
    bonus = cfg.dpe_bonus.get(dpe, 0.0)
    penalty = cfg.dpe_rental_ban_penalty.get(dpe, 0.0) if cfg.rental_focus else 0.0
    flags: list[str] = []
    if dpe in ("F", "G"):
        flags.append("Levier déficit foncier possible (travaux déductibles des revenus fonciers)")
    if dpe == "G":
        flags.append("⚠️ DPE G : location déjà interdite (loi Climat) — viser revente ou rénovation")
    elif dpe == "F":
        flags.append("⚠️ DPE F : location interdite dès 2028 — budgéter la rénovation énergétique")
    return clamp(0.5 + bonus - penalty), flags


def charges_subscore(listing: Listing, cfg: ScoringConfig) -> tuple[float | None, list[str]]:
    """Les charges de copro tuent le rendement : ratio charges annuelles / prix."""
    if listing.charges_annual is None:
        return None, []
    ratio = listing.charges_annual / listing.price
    ceiling = cfg.charges_ratio_max if cfg.charges_ratio_max > 0 else 1e-9
    flags: list[str] = []
    if ratio >= cfg.charges_ratio_flag:
        flags.append(f"Charges copro élevées ({ratio * 100:.1f}%/an du prix) — rentabilité grevée")
    return clamp(1.0 - ratio / ceiling), flags


def acces_actuel_subscore(
    transport: TransportContext, cfg: ScoringConfig, current_year: int
) -> float | None:
    """Accessibilité immédiate : gare actuelle (ou future déjà ouverte) la plus proche."""
    distances: list[float] = []
    if transport.current_station_m is not None:
        distances.append(transport.current_station_m)
    distances += [
        s.distance_m for s in transport.future_stations if s.opening_year <= current_year
    ]
    if not distances:
        return None
    nearest = min(distances)
    return clamp(math.exp(-((nearest / cfg.transport_current_scale_m) ** 2)))


def defense_multiplier(
    transport: TransportContext, cfg: ScoringConfig
) -> tuple[float, list[str]]:
    """L'aimant La Défense : multiplicateur si le porte-à-porte est ultra-compétitif."""
    minutes = transport.defense_minutes
    if minutes is None:
        return 1.0, ["Temps vers La Défense inconnu (routing non configuré)"]
    edge = max(0.0, (cfg.defense_target_min - minutes) / cfg.defense_target_min)
    multiplier = 1.0 + cfg.defense_alpha * edge
    flags: list[str] = []
    if minutes <= 20:
        flags.append(f"Accès La Défense ultra-compétitif (~{minutes:.0f} min porte-à-porte)")
    return multiplier, flags

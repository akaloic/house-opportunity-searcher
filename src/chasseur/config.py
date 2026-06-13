"""Configuration centrale — TOUT seuil/poids/budget vit ici, jamais en dur ailleurs.

Surcharge possible via variables d'environnement (préfixe ``CHASSEUR_``, imbrication
``__``) ou fichier ``.env``. Sans rien, les valeurs par défaut suffisent au mode démo.
"""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class ScoringWeights(BaseModel):
    """Poids des sous-scores. Renormalisés automatiquement si la somme != 1."""

    decote: float = 0.34
    futur_transport: float = 0.22
    signaux_vendeur: float = 0.14
    anciennete: float = 0.10
    dpe_travaux: float = 0.10
    charges: float = 0.06
    acces_actuel: float = 0.04

    def normalized(self) -> dict[str, float]:
        raw = self.model_dump()
        total = sum(raw.values())
        if total <= 0:
            raise ValueError("La somme des poids de scoring doit être strictement positive.")
        return {key: value / total for key, value in raw.items()}


class ScoringConfig(BaseModel):
    weights: ScoringWeights = Field(default_factory=ScoringWeights)

    # --- Décote marché ---
    decote_target: float = 0.15  # -15% sous la médiane micro-quartier => score plein
    alert_threshold: float = 70.0

    # --- Transport futur (Grand Paris Express) ---
    transport_future_scale_m: float = 800.0
    transport_current_scale_m: float = 600.0
    transport_max_radius_m: float = 2500.0
    # paliers (années_max, facteur) : plus l'ouverture est proche, plus ça pèse
    horizon_factors: list[tuple[int, float]] = Field(
        default_factory=lambda: [(2, 1.0), (4, 0.7), (7, 0.4)]
    )
    horizon_default_factor: float = 0.2

    # --- Ancienneté / baisses de prix ---
    anciennete_tau_days: float = 60.0
    price_drop_bonus: float = 0.12

    # --- Charges de copropriété ---
    charges_ratio_max: float = 0.020  # 2%/an du prix => score charges nul
    charges_ratio_flag: float = 0.012  # 1.2%/an => on lève un drapeau "charges élevées"

    # --- DPE / déficit foncier (loi Climat) ---
    rental_focus: bool = True
    dpe_bonus: dict[str, float] = Field(default_factory=lambda: {"F": 0.10, "G": 0.15})
    dpe_rental_ban_penalty: dict[str, float] = Field(
        default_factory=lambda: {"F": 0.10, "G": 0.25}
    )

    # --- Multiplicateur La Défense ---
    defense_alpha: float = 0.20
    defense_target_min: float = 30.0
    defense_avg_kmh: float = 22.0  # vitesse moyenne porte-à-porte (heuristique transit)
    defense_detour_factor: float = 1.4  # détour réseau vs vol d'oiseau
    defense_access_overhead_min: float = 7.0  # marche + attente quai

    # --- Coût complet / rendement ---
    notaire_rate: float = 0.075  # frais de notaire ancien (~7.5%)
    rent_per_m2_month: float | None = None  # None => rendement non estimé

    # --- Mode dégradé ---
    missing_subscore_policy: str = "neutral"  # "neutral" | "exclude"
    neutral_value: float = 0.5

    # --- Niveaux d'urgence ---
    level_pepite: float = 85.0
    level_hot: float = 70.0
    level_interesting: float = 55.0

    # --- Offre d'attaque (décote à proposer SOUS le prix affiché) ---
    offer_base: float = 0.05
    offer_max: float = 0.20
    offer_bonus_urgency: float = 0.05
    offer_bonus_stale_60: float = 0.03
    offer_bonus_stale_120: float = 0.06
    offer_bonus_price_drops: float = 0.04
    offer_bonus_dpe_f: float = 0.03
    offer_bonus_dpe_g: float = 0.05
    offer_bonus_multidiffusion: float = 0.04
    offer_bonus_particulier: float = 0.02

    def horizon_factor(self, years_until_opening: int) -> float:
        """Pondération selon l'horizon d'ouverture d'une future gare."""
        for max_years, factor in sorted(self.horizon_factors):
            if years_until_opening <= max_years:
                return factor
        return self.horizon_default_factor


class LexiconConfig(BaseModel):
    """Lexiques NLP (clés sans accents : le texte est normalisé avant matching)."""

    cap_urgency: float = 0.5  # plafond de l'effet "vendeur pressé"
    cap_redflag: float = 0.5  # plafond de la pénalité "red flags"
    urgency: dict[str, float] = Field(
        default_factory=lambda: {
            "succession": 0.30,
            "cause mutation": 0.25,
            "mutation professionnelle": 0.25,
            "divorce": 0.25,
            "separation": 0.20,
            "depart etranger": 0.20,
            "depart a l etranger": 0.20,
            "ideal investisseur": 0.15,
            "a debattre": 0.15,
            "negociable": 0.15,
            "prix negociable": 0.15,
            "libre rapidement": 0.20,
            "vente rapide": 0.20,
            "urgent": 0.20,
            "prix en baisse": 0.20,
            "baisse de prix": 0.20,
        }
    )
    redflags: dict[str, float] = Field(
        default_factory=lambda: {
            "souplex": 0.30,
            "rez de chaussee sur rue": 0.20,
            "rez-de-chaussee sur rue": 0.20,
            "atypique": 0.15,
            "vis a vis": 0.10,
            "vis-a-vis": 0.10,
            "sans ascenseur": 0.15,
            "a renover entierement": 0.15,
            "gros travaux": 0.15,
            "travaux a prevoir": 0.10,
            "bruyant": 0.15,
            "servitude": 0.20,
            "indivision": 0.10,
        }
    )


class RenovationConfig(BaseModel):
    """Coûts travaux indicatifs €/m² par état estimé (à la louche, ajustables)."""

    cost_per_m2: dict[str, float] = Field(
        default_factory=lambda: {
            "new": 0.0,
            "good": 0.0,
            "refresh": 350.0,
            "renovate": 900.0,
            "gut": 1300.0,
        }
    )


class AntibotConfig(BaseModel):
    proxies: list[str] = Field(default_factory=list)
    impersonate: str = "chrome"
    flaresolverr_url: str | None = None
    max_rpm: float = 20.0  # requêtes/min/domaine — rester poli
    min_delay_s: float = 1.5
    max_delay_s: float = 5.0
    max_retries: int = 3
    circuit_break_threshold: int = 3
    circuit_break_cooldown_s: float = 900.0


class SearchConfig(BaseModel):
    provider: str = "null"  # "null" | "tavily" | "serper"
    tavily_api_key: str | None = None
    serper_api_key: str | None = None
    max_results: int = 5


class AlertConfig(BaseModel):
    telegram_bot_token: str | None = None
    telegram_chat_id: str | None = None
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None
    email_to: str | None = None
    cooldown_hours: float = 24.0  # anti-spam : ne pas re-alerter avant N heures
    dry_run: bool = True  # par défaut on n'envoie rien, on imprime


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="CHASSEUR_",
        env_nested_delimiter="__",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Curseurs financiers
    budget_max: float = 310_000.0
    surface_min: float = 20.0
    surface_max: float = 200.0

    enabled_scrapers: list[str] = Field(default_factory=lambda: ["sample"])

    # Chemins (relatifs à la racine du repo)
    fixtures_path: Path = Path("fixtures/listings.sample.json")
    gpe_path: Path = Path("data/gpe_stations.json")
    market_medians_path: Path = Path("data/market_medians.sample.json")
    db_path: Path = Path("chasseur.sqlite")
    postgis_dsn: str | None = None

    scoring: ScoringConfig = Field(default_factory=ScoringConfig)
    lexicon: LexiconConfig = Field(default_factory=LexiconConfig)
    renovation: RenovationConfig = Field(default_factory=RenovationConfig)
    antibot: AntibotConfig = Field(default_factory=AntibotConfig)
    search: SearchConfig = Field(default_factory=SearchConfig)
    alert: AlertConfig = Field(default_factory=AlertConfig)


@lru_cache
def get_settings() -> Settings:
    return Settings()

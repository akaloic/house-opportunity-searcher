"""Modèles d'échange Pydantic v2 — une annonce, son contexte enrichi, son score."""

from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, computed_field


class Source(str, Enum):
    leboncoin = "leboncoin"
    seloger = "seloger"
    bienici = "bienici"
    pap = "pap"
    sample = "sample"


class PropertyType(str, Enum):
    apartment = "apartment"
    house = "house"
    other = "other"


class UrgencyLevel(str, Enum):
    watch = "watch"
    interesting = "interesting"
    hot = "hot"
    pepite = "pepite"


class Condition(str, Enum):
    new = "new"
    good = "good"
    refresh = "refresh"
    renovate = "renovate"
    gut = "gut"


class PricePoint(BaseModel):
    ts: datetime
    price: float


class Listing(BaseModel):
    """Annonce normalisée, identique quel que soit le portail d'origine."""

    source: Source
    source_id: str
    url: str = ""
    title: str = ""
    description: str = ""

    price: float = Field(gt=0)
    surface_m2: float = Field(gt=0)
    rooms: int | None = None
    bedrooms: int | None = None
    property_type: PropertyType = PropertyType.apartment
    floor: int | None = None
    floor_count: int | None = None  # nb total d'étages du bâtiment (pour "Xe sur Y")
    has_elevator: bool | None = None
    has_balcony: bool | None = None  # None = inconnu (le filtre tranchera via le texte)

    dpe: str | None = None
    ges: str | None = None
    charges_annual: float | None = None
    property_tax_annual: float | None = None

    postal_code: str | None = None
    city: str | None = None
    lat: float | None = None
    lon: float | None = None
    geocode_confidence: float | None = None

    published_at: datetime | None = None
    first_seen: datetime | None = None
    last_seen: datetime | None = None
    price_history: list[PricePoint] = Field(default_factory=list)

    is_professional: bool | None = None
    diffusion_count: int = 1
    raw: dict[str, object] = Field(default_factory=dict)

    @computed_field  # type: ignore[prop-decorator]
    @property
    def price_per_m2(self) -> float:
        return self.price / self.surface_m2

    @computed_field  # type: ignore[prop-decorator]
    @property
    def dedup_key(self) -> str:
        """Clé de dédup inter-portails (heuristique) : détecte la multi-diffusion."""
        return f"{self.postal_code}|{self.property_type.value}|{round(self.surface_m2)}|{self.rooms}"

    def price_drops(self) -> int:
        """Nombre de baisses de prix observées dans l'historique."""
        ordered = sorted(self.price_history, key=lambda point: point.ts)
        return sum(1 for prev, cur in zip(ordered, ordered[1:]) if cur.price < prev.price)


class FutureStation(BaseModel):
    name: str
    line: str
    distance_m: float
    opening_year: int
    source: str = ""


class SellerSignals(BaseModel):
    urgency_score: float = 0.0
    redflag_penalty: float = 0.0
    matched_urgency: list[str] = Field(default_factory=list)
    matched_redflags: list[str] = Field(default_factory=list)


class RenovationEstimate(BaseModel):
    condition: Condition
    cost_per_m2: float
    total_cost: float
    notes: str = ""


class TransportContext(BaseModel):
    current_station_m: float | None = None
    current_station_name: str | None = None
    future_stations: list[FutureStation] = Field(default_factory=list)
    checked: bool = False  # l'enrichissement transport a-t-il réellement tourné
    defense_minutes: float | None = None

    def nearest_future(self) -> FutureStation | None:
        return min(self.future_stations, key=lambda s: s.distance_m, default=None)


class EnrichedContext(BaseModel):
    """Tout ce que l'enrichissement a su récupérer autour de l'annonce."""

    market_ppm2: float | None = None
    seller_signals: SellerSignals = Field(default_factory=SellerSignals)
    renovation: RenovationEstimate | None = None
    transport: TransportContext = Field(default_factory=TransportContext)


class Score(BaseModel):
    total: float
    level: UrgencyLevel
    sub_scores: dict[str, float | None] = Field(default_factory=dict)
    weights: dict[str, float] = Field(default_factory=dict)
    defense_multiplier: float = 1.0
    decote_pct: float | None = None
    full_cost: float | None = None
    effective_ppm2: float | None = None
    net_yield: float | None = None
    suggested_offer_price: float | None = None
    suggested_discount: float | None = None
    flags: list[str] = Field(default_factory=list)
    recommendation: str = ""

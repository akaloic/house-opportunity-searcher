// Jeu de données DÉMO riche — axe La Défense (92), ~12 biens.
// Garantit un premier rendu spectaculaire sans backend ; sert aussi de
// fallback si `./data.live.json` (généré par le pipeline) est absent.
// Même contrat que window.PEPITE_DATA.

import type { PepiteData, Listing } from '../types'

const CRITERIA = [
  { key: 'decote', label: 'Décote vs marché (DVF)', short: 'Décote', icon: 'euro', accent: 'var(--viz-1)' },
  { key: 'futur_transport', label: 'Transport futur (Grand Paris)', short: 'GPE', icon: 'route', accent: 'var(--viz-2)' },
  { key: 'signaux_vendeur', label: 'Signaux vendeur (NLP)', short: 'Vendeur', icon: 'zap', accent: 'var(--viz-6)' },
  { key: 'anciennete', label: 'Ancienneté / levier négo', short: 'Négo', icon: 'history', accent: 'var(--viz-3)' },
  { key: 'dpe_travaux', label: 'DPE / déficit foncier', short: 'DPE', icon: 'leaf', accent: 'var(--viz-8)' },
  { key: 'charges', label: 'Charges copropriété', short: 'Charges', icon: 'layers', accent: 'var(--viz-5)' },
  { key: 'acces_actuel', label: 'Accès transports actuel', short: 'Accès', icon: 'train', accent: 'var(--brand-500)' },
]

const WEIGHTS = { decote: 34, futur_transport: 22, signaux_vendeur: 14, anciennete: 10, dpe_travaux: 10, charges: 6, acces_actuel: 4 }

// Photos libres (Unsplash CDN). En cas d'échec réseau, un placeholder dégradé s'affiche.
const P = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`
const PH = {
  living1: P('photo-1502672260266-1c1ef2d93688'),
  living2: P('photo-1493809842364-78817add7ffb'),
  living3: P('photo-1567496898669-ee935f5f647a'),
  living4: P('photo-1554995207-c18c203602cb'),
  kitchen1: P('photo-1556912173-3bb406ef7e77'),
  kitchen2: P('photo-1484154218962-a197022b5858'),
  bedroom1: P('photo-1505691938895-1758d7feb511'),
  bedroom2: P('photo-1522708323590-d24dbb6b0267'),
  building1: P('photo-1560185007-cde436f6a4d0'),
  interior1: P('photo-1560448204-e02f11c3d0e2'),
  interior2: P('photo-1565182999561-18d7dc61c393'),
}

type Core = {
  id: string; title: string; quartier: string; postal: string; price: number; surface: number
  rooms: number; floor: number; floors: number; balcon: boolean; elevator: boolean | null
  marketPpm2: number; dpe: string; freshMin: number; lat: number; lon: number; score: number
  metro: { line: string; name: string; min: number }[]
  crit: Record<string, number>; tags: string[]; photos: string[]
}

function mk(c: Core): Listing {
  const ppm2 = Math.round(c.price / c.surface)
  const x = Math.round(Math.max(4, Math.min(96, ((c.lon - 1.9) / 0.8) * 100)))
  const y = Math.round(Math.max(4, Math.min(96, ((49.0 - c.lat) / 0.25) * 100)))
  return {
    id: c.id,
    url: `https://example.invalid/annonce/${c.id}`,
    score: c.score,
    title: c.title,
    addr: `${c.quartier} ${c.postal}`,
    quartier: c.quartier,
    price: c.price,
    surface: c.surface,
    rooms: c.rooms,
    floor: c.floor,
    floors: c.floors,
    floorKnown: true,
    balcon: c.balcon,
    elevator: c.elevator,
    ppm2,
    marketPpm2: c.marketPpm2,
    dpe: c.dpe,
    source: 'Échantillon',
    freshMin: c.freshMin,
    photos: c.photos.length,
    photoUrls: c.photos,
    lat: c.lat,
    lon: c.lon,
    metro: c.metro,
    crit: c.crit,
    x,
    y,
    tags: c.tags,
    fav: false,
  }
}

const LISTINGS: Listing[] = [
  mk({
    id: 'cb-001', title: 'T2 lumineux 44 m², dernier étage', quartier: 'Courbevoie', postal: '92400',
    price: 268000, surface: 44, rooms: 2, floor: 5, floors: 5, balcon: true, elevator: true,
    marketPpm2: 7300, dpe: 'F', freshMin: 95, lat: 48.905, lon: 2.267, score: 88,
    metro: [{ line: 'M15', name: 'Bécon-les-Bruyères', min: 5 }, { line: 'L', name: 'Courbevoie', min: 9 }, { line: 'M1', name: 'La Défense', min: 14 }],
    crit: { decote: 96, futur_transport: 78, signaux_vendeur: 92, anciennete: 84, dpe_travaux: 48, charges: 70, acces_actuel: 80 },
    tags: ['Pépite', 'Sous le marché', 'Vendeur qui craque'], photos: [PH.living1, PH.kitchen1, PH.bedroom1, PH.interior1],
  }),
  mk({
    id: 'lg-002', title: 'T3 traversant 61 m² avec balcon', quartier: 'La Garenne-Colombes', postal: '92250',
    price: 372000, surface: 61, rooms: 3, floor: 3, floors: 6, balcon: true, elevator: true,
    marketPpm2: 7100, dpe: 'D', freshMin: 240, lat: 48.905, lon: 2.244, score: 84,
    metro: [{ line: 'L', name: 'La Garenne-Colombes', min: 4 }, { line: 'M15', name: 'Bécon-les-Bruyères', min: 12 }],
    crit: { decote: 82, futur_transport: 74, signaux_vendeur: 70, anciennete: 60, dpe_travaux: 70, charges: 64, acces_actuel: 78 },
    tags: ['Pépite', 'Sous le marché', 'Future gare'], photos: [PH.living2, PH.kitchen2, PH.bedroom2],
  }),
  mk({
    id: 'na-003', title: 'T2 38 m² proche futur RER E', quartier: 'Nanterre', postal: '92000',
    price: 239000, surface: 38, rooms: 2, floor: 2, floors: 4, balcon: false, elevator: false,
    marketPpm2: 6600, dpe: 'E', freshMin: 60, lat: 48.892, lon: 2.207, score: 81,
    metro: [{ line: 'RER', name: 'Nanterre-La Folie', min: 8 }, { line: 'M15', name: 'Nanterre', min: 16 }],
    crit: { decote: 86, futur_transport: 88, signaux_vendeur: 60, anciennete: 72, dpe_travaux: 56, charges: 60, acces_actuel: 66 },
    tags: ['Pépite', 'Future gare', 'EOLE'], photos: [PH.interior2, PH.living3],
  }),
  mk({
    id: 'co-004', title: '3 pièces 65 m² à rénover', quartier: 'Colombes', postal: '92700',
    price: 295000, surface: 65, rooms: 3, floor: 1, floors: 6, balcon: false, elevator: false,
    marketPpm2: 5600, dpe: 'G', freshMin: 228, lat: 48.923, lon: 2.254, score: 72,
    metro: [{ line: 'M15', name: 'Bois-Colombes', min: 17 }, { line: 'M15', name: 'Les Agnettes', min: 25 }],
    crit: { decote: 92, futur_transport: 48, signaux_vendeur: 58, anciennete: 80, dpe_travaux: 36, charges: 50, acces_actuel: 50 },
    tags: ['Sous le marché', 'Passoire (G)', 'Déficit foncier'], photos: [PH.interior1],
  }),
  mk({
    id: 'pu-005', title: 'T3 avec balcon 58 m²', quartier: 'Courbevoie', postal: '92400',
    price: 365000, surface: 58, rooms: 3, floor: 4, floors: 6, balcon: true, elevator: true,
    marketPpm2: 7300, dpe: 'C', freshMin: 30, lat: 48.897, lon: 2.252, score: 69,
    metro: [{ line: 'M1', name: 'La Défense', min: 15 }, { line: 'M15', name: 'Bécon-les-Bruyères', min: 23 }],
    crit: { decote: 70, futur_transport: 56, signaux_vendeur: 50, anciennete: 40, dpe_travaux: 78, charges: 68, acces_actuel: 82 },
    tags: ['Sous le marché', 'Future gare'], photos: [PH.living4, PH.kitchen1],
  }),
  mk({
    id: 'as-006', title: 'Souplex atypique 42 m²', quartier: 'Asnières-sur-Seine', postal: '92600',
    price: 268000, surface: 42, rooms: 2, floor: 0, floors: 4, balcon: false, elevator: false,
    marketPpm2: 7000, dpe: 'E', freshMin: 116, lat: 48.917, lon: 2.288, score: 58,
    metro: [{ line: 'M15', name: 'Les Agnettes', min: 10 }, { line: 'L', name: 'Asnières', min: 14 }],
    crit: { decote: 64, futur_transport: 52, signaux_vendeur: 56, anciennete: 44, dpe_travaux: 54, charges: 62, acces_actuel: 70 },
    tags: ['Sous le marché', 'Future gare'], photos: [PH.bedroom2],
  }),
  mk({
    id: 'bc-007', title: 'T4 familial 82 m²', quartier: 'Bois-Colombes', postal: '92270',
    price: 489000, surface: 82, rooms: 4, floor: 2, floors: 5, balcon: true, elevator: true,
    marketPpm2: 6300, dpe: 'D', freshMin: 540, lat: 48.917, lon: 2.270, score: 64,
    metro: [{ line: 'L', name: 'Bois-Colombes', min: 6 }, { line: 'M15', name: 'Bois-Colombes', min: 11 }],
    crit: { decote: 66, futur_transport: 60, signaux_vendeur: 44, anciennete: 56, dpe_travaux: 70, charges: 58, acces_actuel: 74 },
    tags: ['Sous le marché', 'Future gare'], photos: [PH.living1, PH.living3],
  }),
  mk({
    id: 'su-008', title: 'T2 vue Seine 46 m²', quartier: 'Suresnes', postal: '92150',
    price: 348000, surface: 46, rooms: 2, floor: 3, floors: 7, balcon: true, elevator: true,
    marketPpm2: 7600, dpe: 'C', freshMin: 75, lat: 48.871, lon: 2.229, score: 55,
    metro: [{ line: 'T2', name: 'Suresnes-Longchamp', min: 7 }, { line: 'L', name: 'Suresnes-Mont-Valérien', min: 12 }],
    crit: { decote: 50, futur_transport: 40, signaux_vendeur: 52, anciennete: 48, dpe_travaux: 76, charges: 60, acces_actuel: 68 },
    tags: ['Vue dégagée'], photos: [PH.living2],
  }),
  mk({
    id: 'le-009', title: 'Studio 26 m² investisseur', quartier: 'Levallois-Perret', postal: '92300',
    price: 252000, surface: 26, rooms: 1, floor: 4, floors: 6, balcon: false, elevator: true,
    marketPpm2: 9200, dpe: 'D', freshMin: 18, lat: 48.894, lon: 2.287, score: 52,
    metro: [{ line: 'M3', name: 'Louise Michel', min: 5 }, { line: 'L', name: 'Clichy-Levallois', min: 10 }],
    crit: { decote: 58, futur_transport: 30, signaux_vendeur: 62, anciennete: 36, dpe_travaux: 68, charges: 54, acces_actuel: 88 },
    tags: ['Idéal investisseur'], photos: [PH.interior2],
  }),
  mk({
    id: 'ru-010', title: 'T3 76 m² résidence récente', quartier: 'Rueil-Malmaison', postal: '92500',
    price: 419000, surface: 76, rooms: 3, floor: 2, floors: 4, balcon: true, elevator: true,
    marketPpm2: 6100, dpe: 'B', freshMin: 320, lat: 48.878, lon: 2.190, score: 48,
    metro: [{ line: 'RER', name: 'Rueil-Malmaison', min: 12 }, { line: 'T2', name: 'Belvédère', min: 9 }],
    crit: { decote: 44, futur_transport: 34, signaux_vendeur: 40, anciennete: 38, dpe_travaux: 88, charges: 56, acces_actuel: 58 },
    tags: ['DPE B'], photos: [PH.living4, PH.kitchen2],
  }),
  mk({
    id: 'pu-011', title: 'T2 refait à neuf 40 m²', quartier: 'Puteaux', postal: '92800',
    price: 332000, surface: 40, rooms: 2, floor: 5, floors: 8, balcon: true, elevator: true,
    marketPpm2: 8200, dpe: 'C', freshMin: 41, lat: 48.884, lon: 2.239, score: 38,
    metro: [{ line: 'M1', name: 'La Défense', min: 11 }, { line: 'RER', name: 'Nanterre-Préfecture', min: 22 }],
    crit: { decote: 36, futur_transport: 30, signaux_vendeur: 38, anciennete: 30, dpe_travaux: 78, charges: 60, acces_actuel: 84 },
    tags: ['Au prix du marché'], photos: [PH.interior1],
  }),
  mk({
    id: 'ne-012', title: 'T3 standing 70 m²', quartier: 'Neuilly-sur-Seine', postal: '92200',
    price: 742000, surface: 70, rooms: 3, floor: 3, floors: 6, balcon: false, elevator: true,
    marketPpm2: 10300, dpe: 'D', freshMin: 600, lat: 48.884, lon: 2.270, score: 31,
    metro: [{ line: 'M1', name: 'Les Sablons', min: 6 }, { line: 'M1', name: 'Pont de Neuilly', min: 10 }],
    crit: { decote: 28, futur_transport: 22, signaux_vendeur: 34, anciennete: 28, dpe_travaux: 70, charges: 46, acces_actuel: 86 },
    tags: ['Premium'], photos: [PH.living1],
  }),
]

const SOURCES = [
  { name: 'Échantillon', status: 'online', scanned: 12, found: 12, blocked: 0, latency: 0, proxy: 'direct' },
  { name: 'Leboncoin', status: 'idle', scanned: 0, found: 0, blocked: 0, latency: 0, proxy: '-' },
  { name: 'SeLoger', status: 'idle', scanned: 0, found: 0, blocked: 0, latency: 0, proxy: '-' },
  { name: "Bien'ici", status: 'idle', scanned: 0, found: 0, blocked: 0, latency: 0, proxy: '-' },
  { name: 'PAP', status: 'idle', scanned: 0, found: 0, blocked: 0, latency: 0, proxy: '-' },
]

const LOGS = [
  { time: '20:00:12', level: 'ok', source: 'sample', message: 'cb-001 scoré 88 (hot) : pépite détectée' },
  { time: '20:00:12', level: 'info', source: 'sample', message: 'lg-002 scoré 84 (hot)' },
  { time: '20:00:11', level: 'info', source: 'sample', message: 'na-003 scoré 81 (hot) : proche EOLE' },
  { time: '20:00:11', level: 'info', source: 'sample', message: 'co-004 scoré 72 (interesting)' },
  { time: '20:00:10', level: 'info', source: 'sample', message: 'enrichissement DVF terminé · 12 biens' },
]

export const DEMO_DATA: PepiteData = {
  CRITERIA,
  WEIGHTS,
  LISTINGS,
  SOURCES,
  LOGS,
}

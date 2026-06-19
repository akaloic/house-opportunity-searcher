// Contrat de données — miroir exact de `window.PEPITE_DATA` généré par
// `chasseur export-web` (src/chasseur/dashboard/webexport.py).

export interface Criterion {
  key: string
  label: string
  short: string
  icon: string
  accent: string
}

export type Weights = Record<string, number>

export interface MetroStation {
  line: string
  name: string
  min: number
}

export interface Listing {
  id: string
  url: string
  score: number
  title: string
  addr: string
  quartier: string
  price: number
  surface: number
  rooms: number
  floor: number
  floors: number
  floorKnown: boolean
  balcon: boolean
  elevator: boolean | null
  ppm2: number
  marketPpm2: number
  dpe: string
  source: string
  freshMin: number
  photos: number
  photoUrls: string[]
  lat: number | null
  lon: number | null
  metro: MetroStation[]
  crit: Record<string, number>
  x: number
  y: number
  tags: string[]
  fav: boolean
}

export interface SourceStat {
  name: string
  status: string
  scanned: number
  found: number
  blocked: number
  latency: number
  proxy: string
}

export interface LogEntry {
  time?: string
  level?: string
  source?: string
  message?: string
}

export interface PepiteData {
  CRITERIA: Criterion[]
  WEIGHTS: Weights
  LISTINGS: Listing[]
  SOURCES: SourceStat[]
  LOGS: LogEntry[]
}

export type ViewId = 'overview' | 'opportunities' | 'detail' | 'scoring' | 'monitoring'

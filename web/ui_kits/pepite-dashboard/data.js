/* Pépite — mock veille data. Listings ("pépites"), scoring breakdown,
   scraper sources, and a log stream. All fictional, for the UI kit. */

const CRITERIA = [
  { key: 'prixM2',     label: 'Prix / m² vs quartier', short: 'Prix/m²',   icon: 'euro',   accent: 'var(--viz-1)' },
  { key: 'transports', label: 'Proximité transports',  short: 'Transports', icon: 'train',  accent: 'var(--viz-2)' },
  { key: 'freshness',  label: 'Fraîcheur annonce',     short: 'Fraîcheur',  icon: 'clock',  accent: 'var(--viz-6)' },
  { key: 'dpe',        label: 'Potentiel DPE',         short: 'DPE',        icon: 'leaf',   accent: 'var(--viz-8)' },
  { key: 'etage',      label: 'Étage / luminosité',    short: 'Étage',      icon: 'building', accent: 'var(--viz-3)' },
  { key: 'nuisances',  label: 'Absence nuisances',     short: 'Calme',      icon: 'volume', accent: 'var(--viz-5)' },
];

// Default engine weights (sum normalized in UI)
const WEIGHTS = { prixM2: 32, transports: 24, freshness: 14, dpe: 12, etage: 9, nuisances: 9 };

const LISTINGS = [
  {
    id: 'PP-4821', score: 92, title: 'T3 traversant · 68 m²', addr: 'Rue de la Mare, 75020',
    quartier: 'Belleville', price: 612000, surface: 68, rooms: 3, floor: 4, floors: 6,
    ppm2: 9000, marketPpm2: 10850, dpe: 'C', source: 'SeLoger', freshMin: 38, photos: 14,
    metro: [{ line: 'M11', name: 'Pyrénées', min: 4 }, { line: 'M2', name: 'Couronnes', min: 7 }],
    crit: { prixM2: 95, transports: 88, freshness: 90, dpe: 72, etage: 80, nuisances: 70 },
    x: 78, y: 30, tags: ['Pépite', 'Sous le marché'], fav: true,
  },
  {
    id: 'PP-4806', score: 84, title: 'T2 rénové · 44 m²', addr: 'Rue Oberkampf, 75011',
    quartier: 'Oberkampf', price: 489000, surface: 44, rooms: 2, floor: 3, floors: 5,
    ppm2: 11114, marketPpm2: 12400, dpe: 'B', source: 'Leboncoin', freshMin: 12, photos: 9,
    metro: [{ line: 'M9', name: 'Saint-Ambroise', min: 3 }, { line: 'M3', name: 'Rue Saint-Maur', min: 6 }],
    crit: { prixM2: 80, transports: 92, freshness: 96, dpe: 88, etage: 70, nuisances: 60 },
    x: 64, y: 47, tags: ['Pépite', 'Fraîche'], fav: false,
  },
  {
    id: 'PP-4790', score: 76, title: 'Studio · 27 m²', addr: 'Rue du Faubourg du Temple, 75010',
    quartier: 'Canal St-Martin', price: 298000, surface: 27, rooms: 1, floor: 5, floors: 7,
    ppm2: 11037, marketPpm2: 11600, dpe: 'D', source: 'PAP', freshMin: 95, photos: 6,
    metro: [{ line: 'M5', name: 'Jacques Bonsergent', min: 5 }, { line: 'M11', name: 'Goncourt', min: 8 }],
    crit: { prixM2: 68, transports: 84, freshness: 64, dpe: 55, etage: 90, nuisances: 72 },
    x: 52, y: 38, tags: ['Bon plan'], fav: false,
  },
  {
    id: 'PP-4775', score: 71, title: 'T4 familial · 86 m²', addr: 'Avenue Gambetta, 75020',
    quartier: 'Gambetta', price: 742000, surface: 86, rooms: 4, floor: 2, floors: 8,
    ppm2: 8628, marketPpm2: 9100, dpe: 'C', source: 'SeLoger', freshMin: 142, photos: 18,
    metro: [{ line: 'M3', name: 'Gambetta', min: 3 }, { line: 'M3bis', name: 'Pelleport', min: 9 }],
    crit: { prixM2: 64, transports: 78, freshness: 52, dpe: 70, etage: 58, nuisances: 80 },
    x: 86, y: 42, tags: ['Bon plan'], fav: false,
  },
  {
    id: 'PP-4761', score: 58, title: 'T2 · 41 m²', addr: 'Rue de Charonne, 75011',
    quartier: 'Charonne', price: 465000, surface: 41, rooms: 2, floor: 1, floors: 4,
    ppm2: 11341, marketPpm2: 11500, dpe: 'E', source: 'Leboncoin', freshMin: 210, photos: 7,
    metro: [{ line: 'M9', name: 'Charonne', min: 4 }, { line: 'M2', name: 'Alexandre Dumas', min: 8 }],
    crit: { prixM2: 52, transports: 74, freshness: 40, dpe: 32, etage: 44, nuisances: 66 },
    x: 70, y: 58, tags: [], fav: false,
  },
  {
    id: 'PP-4744', score: 47, title: 'T3 · 61 m²', addr: 'Boulevard de Ménilmontant, 75011',
    quartier: 'Ménilmontant', price: 598000, surface: 61, rooms: 3, floor: 0, floors: 6,
    ppm2: 9803, marketPpm2: 9600, dpe: 'F', source: 'SeLoger', freshMin: 320, photos: 11,
    metro: [{ line: 'M2', name: 'Ménilmontant', min: 2 }],
    crit: { prixM2: 44, transports: 70, freshness: 28, dpe: 18, etage: 30, nuisances: 40 },
    x: 74, y: 36, tags: ['Surcoté'], fav: false,
  },
  {
    id: 'PP-4720', score: 38, title: 'Studio · 22 m²', addr: 'Rue de Belleville, 75019',
    quartier: 'Belleville', price: 279000, surface: 22, rooms: 1, floor: 6, floors: 6,
    ppm2: 12681, marketPpm2: 11200, dpe: 'D', source: 'PAP', freshMin: 480, photos: 4,
    metro: [{ line: 'M11', name: 'Pyrénées', min: 6 }],
    crit: { prixM2: 24, transports: 76, freshness: 14, dpe: 50, etage: 88, nuisances: 36 },
    x: 80, y: 22, tags: ['Surcoté'], fav: false,
  },
  {
    id: 'PP-4698', score: 81, title: 'T2 atypique · 39 m²', addr: 'Rue Saint-Maur, 75011',
    quartier: 'Saint-Maur', price: 442000, surface: 39, rooms: 2, floor: 4, floors: 5,
    ppm2: 11333, marketPpm2: 12600, dpe: 'B', source: 'Leboncoin', freshMin: 26, photos: 12,
    metro: [{ line: 'M3', name: 'Rue Saint-Maur', min: 2 }, { line: 'M9', name: 'Voltaire', min: 7 }],
    crit: { prixM2: 78, transports: 90, freshness: 94, dpe: 86, etage: 76, nuisances: 64 },
    x: 60, y: 52, tags: ['Pépite', 'Fraîche'], fav: true,
  },
];

const SOURCES = [
  { name: 'SeLoger',    status: 'online',  scanned: 982, found: 6, blocked: 3,  latency: 412, proxy: 'FR-residential' },
  { name: 'Leboncoin',  status: 'running', scanned: 1144, found: 5, blocked: 41, latency: 880, proxy: 'FR-mobile' },
  { name: 'PAP',        status: 'online',  scanned: 218,  found: 3, blocked: 0,  latency: 305, proxy: 'FR-datacenter' },
  { name: 'Bien\u2019ici', status: 'warning', scanned: 137, found: 1, blocked: 18, latency: 1640, proxy: 'FR-residential' },
  { name: 'Logic-Immo', status: 'blocked', scanned: 0,    found: 0, blocked: 96, latency: 0,    proxy: 'FR-datacenter' },
];

const LOGS = [
  { time: '14:32:08', level: 'ok',    source: 'seloger', message: 'Annonce PP-4821 scorée 92 → match alerte « Belleville T3 »' },
  { time: '14:32:05', level: 'info',  source: 'leboncoin', message: 'Pagination 4/12 · 38 annonces parsées · file=412' },
  { time: '14:31:58', level: 'warn',  source: 'bienici', message: 'Latence proxy 1640ms — rotation FR-residential[7]' },
  { time: '14:31:44', level: 'ok',    source: 'pap', message: 'Géocodage 75010 résolu (cache hit 84%)' },
  { time: '14:31:31', level: 'error', source: 'logic-immo', message: 'HTTP 403 · challenge Datadome détecté · backoff 240s' },
  { time: '14:31:12', level: 'info',  source: 'engine', message: 'Recalcul scores · 2481 annonces · poids v3 appliqués' },
  { time: '14:30:55', level: 'ok',    source: 'leboncoin', message: 'Annonce PP-4806 scorée 84 → alerte mail envoyée (1 dest.)' },
  { time: '14:30:40', level: 'debug', source: 'engine', message: 'prix_m2_quartier[75011]=12400 maj depuis DVF' },
  { time: '14:30:22', level: 'warn',  source: 'seloger', message: 'Captcha image · résolu via solver (2.1s)' },
  { time: '14:30:03', level: 'ok',    source: 'pap', message: 'Cycle scrape terminé · 218 annonces · 3 nouvelles' },
];

window.PEPITE_DATA = { CRITERIA, WEIGHTS, LISTINGS, SOURCES, LOGS };
window.fmtEur = (n) => n.toLocaleString('fr-FR');
window.fmtAgo = (m) => m < 60 ? `${m} min` : m < 1440 ? `${Math.round(m/60)} h` : `${Math.round(m/1440)} j`;

// Plan d'action / négociation — fonctions pures (entrée = bien, sortie = reco chiffrée).
// Reflète les heuristiques "expert immobilier" du projet (CLAUDE.md §2) :
// coût complet (prix + travaux + frais de notaire), offre d'attaque, leviers, loi Climat.

import type { Listing } from '../types'
import { decotePct } from './format'

const NOTAIRE_RATE = 0.075 // ancien ≈ 7,5 %
const clamp01 = (x: number) => Math.max(0, Math.min(1, x))

export interface Lever {
  tone: 'gold' | 'success' | 'danger' | 'info' | 'neutral'
  text: string
}

export interface NegotiationPlan {
  travauxPpm2: number
  travaux: number
  fraisNotaire: number
  coutComplet: number
  offreSuggeree: number
  ecartOffre: number
  ecartPct: number
  leviers: Lever[]
  dpeAlerte: string | null
  verdict: string
  source: 'engine' | 'heuristic'
  netYield?: number | null
  defenseMinutes?: number | null
  redflags?: string[]
}

// €/m² de travaux estimés « à la louche » selon mots-clés du titre + DPE.
function estimateTravauxPpm2(l: Listing): number {
  const t = (l.title || '').toLowerCase()
  if (/rénover enti|à rénover|gros travaux|à restaurer|tout à refaire/.test(t)) return 1000
  if (/à rafraîchir|travaux|à refaire|à moderniser|à rénover/.test(t)) return 350
  const dpe = (l.dpe || '').toUpperCase()
  if (dpe === 'G') return 700
  if (dpe === 'F') return 480
  if (dpe === 'E') return 150
  return 0
}

function dpeAlerte(dpe: string): string | null {
  switch ((dpe || '').toUpperCase()) {
    case 'G': return 'Location interdite depuis 2025 (loi Climat)'
    case 'F': return 'Location interdite en 2028 (loi Climat)'
    case 'E': return 'Location interdite en 2034 (loi Climat)'
    default: return null
  }
}

function buildLevers(l: Listing): Lever[] {
  const out: Lever[] = []
  const dec = decotePct(l)
  const days = Math.round(l.freshMin / 1440)
  const dpe = (l.dpe || '').toUpperCase()
  const topFloor = l.floorKnown && l.floors > 0 && l.floor >= l.floors

  if (dec >= 3) out.push({ tone: 'gold', text: `${dec.toFixed(0)} % sous la médiane DVF du quartier` })
  if ((l.crit.signaux_vendeur ?? 0) >= 60) out.push({ tone: 'success', text: 'Signaux vendeur détectés (mutation / succession / « à débattre »)' })
  if (days >= 45) out.push({ tone: 'success', text: `En ligne depuis ${days} j sans baisse — vendeur qui faiblit` })
  if ((l.crit.futur_transport ?? 0) >= 55 || l.tags.some((t) => /gare|gpe|eole/i.test(t)))
    out.push({ tone: 'info', text: 'Future gare Grand Paris < 800 m — plus-value avant ouverture' })
  if (dpe === 'F' || dpe === 'G') out.push({ tone: 'danger', text: 'Passoire énergétique — levier de prix + déficit foncier' })
  if (l.floorKnown && l.floor === 0) out.push({ tone: 'neutral', text: 'RDC : vérifier vis-à-vis / sécurité — argument de prix' })
  if (topFloor && l.elevator === false) out.push({ tone: 'neutral', text: 'Dernier étage sans ascenseur — argument de prix' })

  if (out.length === 0) out.push({ tone: 'neutral', text: 'Peu de leviers : bien proche du marché, négocier à la marge' })
  return out.slice(0, 5)
}

export function buildNegotiationPlan(l: Listing): NegotiationPlan {
  const travauxPpm2 = estimateTravauxPpm2(l)
  const travaux = Math.round(travauxPpm2 * l.surface)
  const fraisNotaire = Math.round(l.price * NOTAIRE_RATE)
  const coutComplet = l.price + travaux + fraisNotaire

  // Effet de levier 0..1 : signaux vendeur (50 %) + ancienneté en ligne (50 %, plafonné à 60 j).
  const leverage = clamp01((l.crit.signaux_vendeur ?? 0) / 100 * 0.5 + Math.min(1, l.freshMin / (60 * 1440)) * 0.5)
  const marginPct = 0.02 + leverage * 0.07 // 2 % à 9 %
  const fair = l.marketPpm2 * l.surface
  const offreSuggeree = Math.round(
    l.price > fair ? Math.min(l.price * (1 - marginPct), fair) : l.price * (1 - marginPct),
  )
  const ecartOffre = Math.max(0, l.price - offreSuggeree)
  const ecartPct = l.price > 0 ? (ecartOffre / l.price) * 100 : 0

  const verdict =
    l.score >= 80 ? 'Pépite : se positionner vite avec une offre ferme et argumentée.'
    : l.score >= 65 ? 'Bon plan : offre d\'attaque justifiée par la décote et les leviers.'
    : l.score >= 45 ? 'Correct : ne négocier que si plusieurs leviers se confirment.'
    : 'À surveiller : n\'engager qu\'en cas de forte baisse de prix.'

  return {
    travauxPpm2, travaux, fraisNotaire, coutComplet,
    offreSuggeree, ecartOffre, ecartPct,
    leviers: buildLevers(l), dpeAlerte: dpeAlerte(l.dpe), verdict, source: 'heuristic',
  }
}

// Couleur d'un flag moteur selon son contenu (les flags sont des phrases d'expert).
function flagTone(f: string): Lever['tone'] {
  const s = f.toLowerCase()
  if (s.startsWith('⚠️') || /interdit/.test(s)) return 'danger'
  if (/décote|decote/.test(s)) return 'gold'
  if (/future gare|grand paris|eole|gpe/.test(s)) return 'info'
  if (/défense|defense|déficit foncier|deficit foncier/.test(s)) return 'success'
  return 'neutral'
}

const isDataGap = (f: string) => /non calcul|inconnu|non renseign|non configur|incertain/i.test(f)

// Plan affiché : privilégie la reco RÉELLE du moteur (l.reco) ; à défaut (démo
// embarquée), retombe sur l'heuristique client buildNegotiationPlan.
export function resolvePlan(l: Listing): NegotiationPlan {
  const r = l.reco
  if (!r) return buildNegotiationPlan(l)

  const travaux = r.renovation?.totalCost ?? 0
  const travauxPpm2 = r.renovation?.costPerM2 ?? 0
  const coutComplet = r.fullCost ?? l.price + travaux + Math.round(l.price * NOTAIRE_RATE)
  const fraisNotaire = Math.max(0, coutComplet - l.price - travaux)
  const offreSuggeree = r.suggestedOfferPrice ?? l.price
  const ecartOffre = Math.max(0, l.price - offreSuggeree)
  const ecartPct = r.suggestedDiscount != null ? r.suggestedDiscount * 100 : l.price > 0 ? (ecartOffre / l.price) * 100 : 0

  const leviers: Lever[] = (r.flags || [])
    .filter((f) => !isDataGap(f))
    .slice(0, 5)
    .map((f) => ({ tone: flagTone(f), text: f.replace(/^⚠️\s*/, '') }))

  return {
    travauxPpm2, travaux, fraisNotaire, coutComplet,
    offreSuggeree, ecartOffre, ecartPct,
    leviers: leviers.length ? leviers : buildLevers(l),
    dpeAlerte: dpeAlerte(l.dpe),
    verdict: r.recommendation || buildNegotiationPlan(l).verdict,
    source: 'engine',
    netYield: r.netYield,
    defenseMinutes: r.defenseMinutes,
    redflags: r.sellerSignals?.redflags,
  }
}

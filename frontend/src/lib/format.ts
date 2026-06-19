// Helpers de formatage — alignés sur fmtEur/fmtAgo du pipeline.

export const fmtEur = (n: number): string => Math.round(n).toLocaleString('fr-FR')

export const fmtAgo = (m: number): string =>
  m < 60 ? `${m} min` : m < 1440 ? `${Math.round(m / 60)} h` : `${Math.round(m / 1440)} j`

export const pct = (n: number, digits = 1): string =>
  `${n > 0 ? '+' : ''}${n.toFixed(digits).replace('.', ',')} %`

// Couleur d'un score 0-100 sur l'échelle séquentielle (surévalué → pépite).
export function scoreColor(v: number): string {
  if (v >= 80) return 'var(--score-100)'
  if (v >= 65) return 'var(--score-75)'
  if (v >= 45) return 'var(--score-50)'
  if (v >= 25) return 'var(--score-25)'
  return 'var(--score-0)'
}

export function scoreLabel(v: number): string {
  if (v >= 80) return 'Pépite'
  if (v >= 65) return 'Bon plan'
  if (v >= 45) return 'Correct'
  if (v >= 25) return 'À surveiller'
  return 'Surévalué'
}

// Décote en % (positif = sous le marché). Basée sur le €/m².
export const decotePct = (l: { ppm2: number; marketPpm2: number }): number =>
  l.marketPpm2 > 0 ? Math.round(((l.marketPpm2 - l.ppm2) / l.marketPpm2) * 1000) / 10 : 0

// Économie € absolue vs marché (décote €/m² × surface).
export const economyEur = (l: { ppm2: number; marketPpm2: number; surface: number }): number =>
  Math.max(0, (l.marketPpm2 - l.ppm2) * l.surface)

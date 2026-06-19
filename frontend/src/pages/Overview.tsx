import { lazy, Suspense } from 'react'
import { Sparkles, ArrowRight, Building2, MapPin, Train, Zap, Euro, Gauge, Layers, Map as MapIcon, BarChart3, Radar as RadarIcon } from 'lucide-react'
import type { PepiteData, Listing, ViewId } from '../types'
import { fmtEur, decotePct, economyEur, scoreLabel } from '../lib/format'
import { useCountUp } from '../lib/useCountUp'
import { Card, Panel, StatCard, Badge, Delta, Button } from '../components/ui'
import { ScoreGauge, ScoreRadar, ScoreBars } from '../components/charts'
import { OppCard, FeedRow } from '../components/listing'

const MapPanel = lazy(() => import('../components/MapPanel'))

function median(nums: number[]): number {
  if (nums.length === 0) return 0
  const s = [...nums].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

export default function Overview({
  data, onOpen, onNavigate, favs, toggleFav,
}: {
  data: PepiteData; onOpen: (l: Listing) => void; onNavigate: (v: ViewId) => void
  favs: Set<string>; toggleFav: (id: string) => void
}) {
  const ranked = [...data.LISTINGS].sort((a, b) => b.score - a.score)
  const top = ranked[0]
  const pepites = ranked.filter((l) => l.score >= 80)
  const totalEconomy = ranked.reduce((s, l) => s + economyEur(l), 0)
  const animEco = useCountUp(totalEconomy)
  const medDecote = median(ranked.map(decotePct).filter((d) => d > 0))
  const medMarket = median(ranked.map((l) => l.marketPpm2))

  // Profil de scoring moyen (radar) — moyenne de chaque critère sur tous les biens.
  const avgAxes = data.CRITERIA.map((c) => ({
    short: c.short,
    value: Math.round(ranked.reduce((s, l) => s + (l.crit[c.key] ?? 0), 0) / Math.max(1, ranked.length)),
  }))

  const topDec = top ? decotePct(top) : 0
  const topEco = top ? economyEur(top) : 0

  return (
    <div className="page">
      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="hero-left anim d1">
          <span className="hero-eyebrow"><span className="pulse" />Veille active · Île-de-France · axe La Défense</span>
          <h1 className="hero-title">
            Détectez la <span className="grad">pépite immobilière</span><br />avant tout le monde.
          </h1>
          <p className="hero-sub">
            Chaque annonce est scorée sur 7 critères d'expert — décote DVF, futures gares du Grand Paris,
            signaux vendeur — pour révéler les biens sous-évalués.
          </p>

          <div className="hero-bignum">
            <span className="cur">≈ {fmtEur(animEco)} €</span>
          </div>
          <div className="hero-bignum-label">d'économie potentielle vs marché DVF · {pepites.length} pépites détectées</div>

          <div className="hero-cta">
            <Button variant="brand" leftIcon={<ArrowRight size={16} />} onClick={() => onNavigate('opportunities')}>
              Explorer les opportunités
            </Button>
            {top && (
              <Button variant="ghost" leftIcon={<Sparkles size={16} />} onClick={() => onOpen(top)}>
                Voir la pépite n°1
              </Button>
            )}
          </div>

          <div className="hero-chips">
            <div><div className="hero-chip-v">{pepites.length}</div><div className="hero-chip-l">Pépites ≥ 80</div></div>
            <div><div className="hero-chip-v">−{medDecote.toFixed(0)} %</div><div className="hero-chip-l">Décote médiane</div></div>
            <div><div className="hero-chip-v">{ranked.length}</div><div className="hero-chip-l">Biens scannés</div></div>
            <div><div className="hero-chip-v">{top?.score ?? 0}</div><div className="hero-chip-l">Meilleur score</div></div>
          </div>
        </div>

        {/* featured pépite */}
        {top && (
          <Card hover glowGold className="feat anim d3" onClick={() => onOpen(top)}>
            <div className="feat-media">
              {top.photoUrls[0]
                ? <img src={top.photoUrls[0]} alt="" referrerPolicy="no-referrer" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                : <div className="feat-media-grid" />}
              <div className="feat-tag"><Badge tone="gold" dot>Pépite n°1 · {scoreLabel(top.score)}</Badge></div>
              <div className="feat-score"><ScoreGauge value={top.score} size={62} thickness={6} /></div>
            </div>
            <div className="feat-body">
              <div>
                <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-strong)' }}>{top.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 5, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{top.addr}</span>
                  {top.metro[0] && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Train size={12} />{top.metro[0].line} · {top.metro[0].min} min</span>}
                </div>
              </div>
              <div className="feat-row">
                <div>
                  <div className="feat-price">{fmtEur(top.price)} €</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-faint)' }}>{fmtEur(top.ppm2)} €/m²</span>
                    {topDec > 0 && <Delta value={topDec} invert />}
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end' }}>
                  {top.tags.slice(0, 2).map((t) => <Badge key={t} tone="neutral">{t}</Badge>)}
                </div>
              </div>
              {topEco > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 11px', background: 'var(--success-soft)', borderRadius: 'var(--radius-md)' }}>
                  <Zap size={15} color="var(--success-500)" />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-default)' }}>
                    <b style={{ color: 'var(--success-500)' }}>{fmtEur(topEco)} €</b> sous le marché estimé · levier de négo
                  </span>
                </div>
              )}
            </div>
          </Card>
        )}
      </section>

      {/* ---------------- KPI ---------------- */}
      <div className="kpi-grid anim d4">
        <StatCard label="Pépites détectées" value={String(pepites.length)} unit={`/ ${ranked.length}`} icon={<Zap size={15} />} accent="var(--gold-400)" foot={<span style={{ color: 'var(--text-faint)' }}>score ≥ 80 / 100</span>} />
        <StatCard label="Décote médiane" value={`−${medDecote.toFixed(0)}`} unit="%" icon={<Euro size={15} />} foot={<span style={{ color: 'var(--success-500)' }}>vs médiane DVF quartier</span>} />
        <StatCard label="Médiane marché /m²" value={fmtEur(medMarket)} unit="€" icon={<Layers size={15} />} foot={<span style={{ color: 'var(--text-faint)' }}>micro-quartier, &lt; 24 mois</span>} />
        <StatCard label="Meilleur score" value={String(top?.score ?? 0)} unit="/100" icon={<Gauge size={15} />} foot={top ? <span style={{ color: 'var(--text-faint)' }}>{top.quartier}</span> : null} />
      </div>

      {/* ---------------- Opportunités du moment ---------------- */}
      <div className="section-gap anim d5">
        <div className="section-head">
          <div className="section-title">Opportunités du moment</div>
          <Button variant="ghost" size="sm" leftIcon={<Building2 size={15} />} onClick={() => onNavigate('opportunities')}>Tout voir</Button>
        </div>
        <div className="opp-grid">
          {ranked.slice(0, 4).map((l) => (
            <OppCard key={l.id} l={l} onOpen={onOpen} fav={favs.has(l.id)} onToggleFav={toggleFav} />
          ))}
        </div>
      </div>

      {/* ---------------- Carte + analyses ---------------- */}
      <div className="split section-gap anim d6">
        <Panel title="Cartographie des opportunités" subtitle="Pins réels colorés par score · OSM + DVF" icon={<MapIcon size={16} />} noPadding bodyStyle={{ padding: 10 }}>
          <Suspense fallback={<div style={{ height: 480, display: 'grid', placeItems: 'center', color: 'var(--text-faint)' }}>Chargement de la carte…</div>}>
            <MapPanel listings={ranked} selectedId={top?.id} onSelect={onOpen} height={480} />
          </Suspense>
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel title="Top pépites" subtitle="Clic → fiche détail" icon={<Sparkles size={16} />} noPadding>
            <div style={{ maxHeight: 270, overflow: 'auto' }}>
              {ranked.slice(0, 5).map((l) => (
                <FeedRow key={l.id} l={l} onOpen={onOpen} fav={favs.has(l.id)} />
              ))}
            </div>
          </Panel>

          <Panel title="Répartition des scores" subtitle="Distribution des biens scannés" icon={<BarChart3 size={16} />}>
            <ScoreBars values={ranked.map((l) => l.score)} />
          </Panel>

          <Panel title="Profil de scoring moyen" subtitle="Forces du portefeuille détecté" icon={<RadarIcon size={16} />}>
            <ScoreRadar axes={avgAxes} size={200} />
          </Panel>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import {
  ChevronLeft, ChevronRight, Eye, Star, MapPin, Train, Clock, Ruler, Grid3x3,
  Layers, Maximize2, Building2, Leaf, Route, TrendingDown, TrendingUp, Gauge,
  Target, AlertTriangle,
} from 'lucide-react'
import type { PepiteData, Listing } from '../types'
import { fmtEur, fmtAgo, decotePct, scoreColor, scoreLabel } from '../lib/format'
import { resolvePlan, type Lever } from '../lib/negotiation'
import { Card, Panel, Badge, Delta, Button, IconButton, Icon, CountUp } from '../components/ui'
import { useRevealOnScroll } from '../lib/useInView'
import { ScoreGauge, ScoreRadar } from '../components/charts'

const LEVER_COLOR: Record<Lever['tone'], string> = {
  gold: 'var(--gold-400)', success: 'var(--success-500)', danger: 'var(--danger-500)',
  info: 'var(--info-500)', neutral: 'var(--text-muted)',
}

function CostRow({ label, value, accent, total }: { label: string; value: string; accent?: boolean; total?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderTop: total ? '1px solid var(--border-default)' : 'none' }}>
      <span style={{ fontSize: 'var(--text-xs)', color: total ? 'var(--text-default)' : 'var(--text-muted)', fontWeight: total ? 600 : 400 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: total ? 'var(--text-md)' : 'var(--text-sm)', fontWeight: total ? 700 : 500, color: accent ? 'var(--gold-400)' : 'var(--text-strong)' }}>{value}</span>
    </div>
  )
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '11px 13px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{icon}{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-strong)' }}>{value}</span>
    </div>
  )
}

function Photo({ src, big, idx, total, onClick }: { src?: string; big?: boolean; idx: number; total: number; onClick?: () => void }) {
  return (
    <div onClick={src ? onClick : undefined} style={{
      position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden',
      background: 'linear-gradient(135deg, var(--surface-3), var(--surface-1))', border: '1px solid var(--border-subtle)',
      aspectRatio: big ? '16/10' : '1/1', display: 'grid', placeItems: 'center', cursor: src ? 'zoom-in' : 'default',
    }}>
      {src
        ? <img src={src} loading="lazy" alt="" referrerPolicy="no-referrer" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        : <Maximize2 size={big ? 24 : 16} color="var(--text-disabled)" />}
      {big && total > 0 && <span style={{ position: 'absolute', bottom: 8, right: 9, fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', background: 'rgba(6,7,14,0.7)', padding: '2px 6px', borderRadius: 4 }}>{idx}/{total}</span>}
    </div>
  )
}

function Contribution({ short, icon, accent, weight, value, totalW }: { short: string; icon: string; accent: string; weight: number; value: number; totalW: number }) {
  const wn = Math.round((weight / totalW) * 100)
  const pts = Math.round((value / 100) * (weight / totalW) * 100)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 44px', alignItems: 'center', gap: 12, padding: '7px 0' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-default)' }}>
        <Icon name={icon} size={13} color={accent} />{short}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 6, borderRadius: 'var(--radius-pill)', background: 'var(--surface-4)', overflow: 'hidden' }}>
          <div style={{ width: `${value}%`, height: '100%', background: accent, borderRadius: 'var(--radius-pill)', boxShadow: `0 0 8px ${accent}55` }} />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', minWidth: 44 }}>×{wn}%</span>
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', textAlign: 'right' }}>+{pts}</span>
    </div>
  )
}

export default function Detail({
  data, listing, onBack, onOpen, fav, toggleFav,
}: { data: PepiteData; listing: Listing; onBack: () => void; onOpen: (l: Listing) => void; fav: boolean; toggleFav: (id: string) => void }) {
  const l = listing
  const revealRef = useRevealOnScroll<HTMLDivElement>()
  const all = [...data.LISTINGS].sort((a, b) => b.score - a.score)
  const idx = Math.max(0, all.findIndex((x) => x.id === l.id))
  const prev = all[idx - 1] || null
  const next = all[idx + 1] || null
  const photos = l.photoUrls || []
  const [lb, setLb] = useState(-1)

  useEffect(() => {
    if (lb < 0 || !photos.length) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLb(-1)
      else if (e.key === 'ArrowRight') setLb((i) => (i + 1) % photos.length)
      else if (e.key === 'ArrowLeft') setLb((i) => (i - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lb, photos.length])

  const floorBase = !l.floorKnown ? 'n.c.' : l.floor === 0 ? 'RDC' : `${l.floor}ᵉ`
  const floorVal = l.floorKnown && l.floors > 0 ? `${floorBase} / ${l.floors}` : floorBase
  const elevatorVal = l.elevator === true ? 'Oui' : l.elevator === false ? 'Non' : 'n.c.'
  const dec = decotePct(l)
  const totalW = Object.values(data.WEIGHTS).reduce((a, b) => a + b, 0)
  const axes = data.CRITERIA.map((c) => ({ short: c.short, value: l.crit[c.key] ?? 0 }))
  const marketDelta = l.marketPpm2 - l.ppm2
  const plan = resolvePlan(l)

  return (
    <div className="page" ref={revealRef}>
      {/* header */}
      <div className="anim d1" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <IconButton label="Retour" onClick={onBack}><ChevronLeft size={18} /></IconButton>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>{l.title}</h2>
            {l.score >= 80 && <Badge tone="gold" dot>Pépite</Badge>}
            <Badge tone="info">{l.source}</Badge>
            <Badge tone="neutral"><span className="mono">{l.id}</span></Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 5, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            <MapPin size={14} />{l.addr} · {l.quartier}
            <span style={{ color: 'var(--text-faint)' }}>· détectée il y a {fmtAgo(l.freshMin)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconButton size="sm" label="Précédent" disabled={!prev} onClick={() => prev && onOpen(prev)}><ChevronLeft size={15} /></IconButton>
          <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-faint)', minWidth: 44, textAlign: 'center' }}>{idx + 1} / {all.length}</span>
          <IconButton size="sm" label="Suivant" disabled={!next} onClick={() => next && onOpen(next)}><ChevronRight size={15} /></IconButton>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" leftIcon={<Eye size={15} />} disabled={!l.url || l.url.includes('example.invalid')} onClick={() => l.url && window.open(l.url, '_blank', 'noopener')}>Voir l'annonce</Button>
          <Button variant={fav ? 'ghost' : 'gold'} leftIcon={<Star size={15} fill={fav ? 'var(--gold-400)' : 'none'} />} onClick={() => toggleFav(l.id)}>{fav ? 'Suivi ✓' : 'Suivre'}</Button>
        </div>
      </div>

      <div className="detail-grid">
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="anim d2">
          <Card style={{ overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 2, background: 'var(--border-subtle)' }}>
              <div style={{ background: 'var(--surface-1)', padding: 2 }}><Photo src={photos[0]} big idx={1} total={l.photos} onClick={() => setLb(0)} /></div>
              <div style={{ position: 'relative', background: 'var(--bg-sunken)', display: 'grid', placeItems: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border-subtle) 1px,transparent 1px),linear-gradient(90deg,var(--border-subtle) 1px,transparent 1px)', backgroundSize: '24px 24px', opacity: 0.4 }} />
                <div style={{ textAlign: 'center', color: 'var(--text-faint)', zIndex: 1 }}>
                  <Route size={26} color="var(--brand-400)" style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em' }}>STREET VIEW</div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}>{l.addr}</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6, padding: 10 }}>
              {Array.from({ length: 6 }).map((_, i) => <Photo key={i} src={photos[i + 1]} idx={i + 2} total={l.photos} onClick={() => setLb(i + 1)} />)}
            </div>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(104px,1fr))', gap: 10 }}>
            <Fact icon={<Ruler size={12} />} label="Surface" value={`${l.surface} m²`} />
            <Fact icon={<Grid3x3 size={12} />} label="Pièces" value={`${l.rooms}`} />
            <Fact icon={<Layers size={12} />} label="Étage" value={floorVal} />
            <Fact icon={<Maximize2 size={12} />} label="Balcon" value={l.balcon ? 'Oui' : '—'} />
            <Fact icon={<Building2 size={12} />} label="Ascenseur" value={elevatorVal} />
            <Fact icon={<Leaf size={12} />} label="DPE" value={l.dpe} />
          </div>

          <Panel title="Transports & accessibilité" subtitle="Temps de marche · isochrone 15 min" icon={<Train size={16} />}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: 16, alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {l.metro.length === 0 && <span style={{ color: 'var(--text-faint)', fontSize: 'var(--text-sm)' }}>Aucune gare renseignée.</span>}
                {l.metro.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 36, height: 22, borderRadius: 'var(--radius-sm)', background: 'var(--surface-3)', border: '1px solid var(--border-default)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--brand-400)', flexShrink: 0 }}>{m.line}</span>
                    <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>{m.name}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}><Clock size={12} />{m.min} min</span>
                  </div>
                ))}
              </div>
              <div style={{ position: 'relative', height: 120, borderRadius: 'var(--radius-md)', background: 'var(--bg-sunken)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                {[58, 40, 22].map((s, i) => (
                  <div key={i} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: s, height: s, borderRadius: '50%', border: `1.5px solid ${['rgba(75,163,245,0.4)', 'rgba(45,212,167,0.5)', 'rgba(242,179,61,0.7)'][i]}`, background: ['transparent', 'rgba(45,212,167,0.05)', 'rgba(242,179,61,0.12)'][i] }} />
                ))}
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 7, height: 7, borderRadius: '50%', background: 'var(--gold-400)', boxShadow: '0 0 8px var(--gold-glow)' }} />
                <span style={{ position: 'absolute', bottom: 5, left: 6, fontSize: 9, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>5 · 10 · 15 min</span>
              </div>
            </div>
          </Panel>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="anim d3">
          <Card glowGold={l.score >= 80} style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <ScoreGauge value={l.score} size={92} thickness={7} label={scoreLabel(l.score)} />
              <div style={{ flex: 1 }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>Prix de vente</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'var(--text-strong)', lineHeight: 1, letterSpacing: '-0.02em' }}><CountUp end={l.price} durationMs={900} suffix=" €" /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>{fmtEur(l.ppm2)} €/m²</span>
                  {dec !== 0 && <Delta value={dec} invert />}
                </div>
              </div>
            </div>
          </Card>

          {/* Plan d'action — reco chiffrée */}
          <Panel
            title="Plan d'action"
            subtitle={plan.source === 'engine' ? 'Moteur de scoring · reco chiffrée' : 'Estimation · stratégie de négociation'}
            icon={<Target size={16} />} className="card-glow-gold"
            actions={<Badge tone={plan.source === 'engine' ? 'brand' : 'neutral'} dot={plan.source === 'engine'}>{plan.source === 'engine' ? 'moteur' : 'estimation'}</Badge>}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 5 }}>Offre d'attaque suggérée</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--brand-400)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  <CountUp end={plan.offreSuggeree} durationMs={900} suffix=" €" />
                </div>
              </div>
              {plan.ecartOffre > 0 && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--success-500)' }}>−{fmtEur(plan.ecartOffre)} €</div>
                  <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>vs prix affiché · −{plan.ecartPct.toFixed(0)} %</div>
                </div>
              )}
            </div>

            <div className="eyebrow" style={{ marginBottom: 2 }}>Coût de revient complet</div>
            <CostRow label="Prix affiché" value={`${fmtEur(l.price)} €`} />
            <CostRow label={`Travaux estimés${plan.travauxPpm2 ? ` (${plan.travauxPpm2} €/m²)` : ''}`} value={plan.travaux ? `+ ${fmtEur(plan.travaux)} €` : '—'} accent={plan.travaux > 0} />
            <CostRow label="Frais de notaire (7,5 %)" value={`+ ${fmtEur(plan.fraisNotaire)} €`} />
            <CostRow label="Coût de revient" value={`${fmtEur(plan.coutComplet)} €`} total />

            <div className="eyebrow" style={{ margin: '14px 0 8px' }}>Leviers de négociation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {plan.leviers.map((lev, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 'var(--text-xs)', color: 'var(--text-default)', lineHeight: 1.45 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: LEVER_COLOR[lev.tone], marginTop: 5, flexShrink: 0, boxShadow: `0 0 6px ${LEVER_COLOR[lev.tone]}88` }} />
                  {lev.text}
                </div>
              ))}
            </div>

            {(plan.defenseMinutes != null || plan.netYield != null) && (
              <div style={{ display: 'flex', gap: 22, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                {plan.defenseMinutes != null && (
                  <div>
                    <div className="eyebrow" style={{ marginBottom: 4 }}>La Défense</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--brand-400)' }}>{Math.round(plan.defenseMinutes)} min</div>
                  </div>
                )}
                {plan.netYield != null && (
                  <div>
                    <div className="eyebrow" style={{ marginBottom: 4 }}>Rendement net est.</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-strong)' }}>{(plan.netYield * 100).toFixed(1).replace('.', ',')} %</div>
                  </div>
                )}
              </div>
            )}

            {plan.dpeAlerte && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '9px 11px', background: 'var(--danger-soft)', borderRadius: 'var(--radius-md)' }}>
                <AlertTriangle size={15} color="var(--danger-500)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--text-default)' }}>{plan.dpeAlerte}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 12, padding: '10px 12px', background: 'var(--brand-soft)', borderRadius: 'var(--radius-md)' }}>
              <Target size={15} color="var(--brand-400)" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-default)', fontWeight: 500 }}>{plan.verdict}</span>
            </div>
          </Panel>

          <Panel title="Comparaison au marché" subtitle={`Médiane quartier ${l.quartier} (DVF)`} icon={<TrendingDown size={16} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ k: 'Cette annonce', v: l.ppm2, c: 'var(--brand-500)' }, { k: `Médiane ${l.quartier}`, v: l.marketPpm2, c: 'var(--text-faint)' }].map((row, i) => {
                const maxv = Math.max(l.ppm2, l.marketPpm2)
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{row.k}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-default)' }}>{fmtEur(row.v)} €/m²</span>
                    </div>
                    <div style={{ height: 9, borderRadius: 'var(--radius-pill)', background: 'var(--surface-4)', overflow: 'hidden' }}>
                      <div style={{ width: `${(row.v / maxv) * 100}%`, height: '100%', background: row.c, borderRadius: 'var(--radius-pill)' }} />
                    </div>
                  </div>
                )
              })}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 2, padding: '9px 11px', background: marketDelta > 0 ? 'var(--success-soft)' : 'var(--danger-soft)', borderRadius: 'var(--radius-md)' }}>
                <Icon name={marketDelta > 0 ? 'trending-down' : 'trending-up'} size={15} color={marketDelta > 0 ? 'var(--success-500)' : 'var(--danger-500)'} />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-default)' }}>
                  {marketDelta > 0
                    ? <><b style={{ color: 'var(--success-500)' }}>{fmtEur(Math.abs(marketDelta * l.surface))} €</b> sous le marché estimé</>
                    : <><b style={{ color: 'var(--danger-500)' }}>{fmtEur(Math.abs(marketDelta * l.surface))} €</b> au-dessus du marché</>}
                </span>
              </div>
            </div>
          </Panel>

          <Panel title="Justification du score" subtitle="score = Σ ( critère × poids )" icon={<Gauge size={16} />}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
              <div style={{ width: '100%', maxWidth: 280 }}>
                <ScoreRadar axes={axes} size={210} color={l.score >= 80 ? 'var(--gold-500)' : 'var(--brand-500)'} />
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 6 }}>
              {data.CRITERIA.map((c) => (
                <Contribution key={c.key} short={c.short} icon={c.icon} accent={c.accent} weight={data.WEIGHTS[c.key] ?? 0} value={l.crit[c.key] ?? 0} totalW={totalW} />
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-default)', marginTop: 6, paddingTop: 10 }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-default)' }}>Score pondéré total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: scoreColor(l.score) }}>{l.score}<span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-faint)' }}> / 100</span></span>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* lightbox */}
      {lb >= 0 && photos[lb] && (
        <div onClick={() => setLb(-1)} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(4,5,12,0.78)', backdropFilter: 'blur(18px) saturate(140%)', WebkitBackdropFilter: 'blur(18px) saturate(140%)', display: 'grid', placeItems: 'center', padding: 48 }}>
          <img src={photos[lb]} alt="" referrerPolicy="no-referrer" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '92%', maxHeight: '92%', objectFit: 'contain', borderRadius: 'var(--radius-lg)', boxShadow: '0 30px 90px rgba(0,0,0,0.6)', border: '1px solid var(--border-default)' }} />
          {photos.length > 1 && <>
            <button onClick={(e) => { e.stopPropagation(); setLb((lb - 1 + photos.length) % photos.length) }} aria-label="Précédent" style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: 999, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-default)', color: 'var(--text-strong)', cursor: 'pointer', fontSize: 24 }}>‹</button>
            <button onClick={(e) => { e.stopPropagation(); setLb((lb + 1) % photos.length) }} aria-label="Suivant" style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: 999, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-default)', color: 'var(--text-strong)', cursor: 'pointer', fontSize: 24 }}>›</button>
          </>}
          <button onClick={() => setLb(-1)} aria-label="Fermer" style={{ position: 'absolute', top: 20, right: 24, width: 44, height: 44, borderRadius: 999, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-default)', color: 'var(--text-strong)', cursor: 'pointer', fontSize: 22 }}>×</button>
        </div>
      )}
    </div>
  )
}

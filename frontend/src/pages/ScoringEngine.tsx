import { useMemo, useState } from 'react'
import { SlidersHorizontal, Filter, Zap, Bell, Mail, Check, Plus } from 'lucide-react'
import type { PepiteData, Listing } from '../types'
import { fmtEur } from '../lib/format'
import { Panel, Badge, Button, RangeSlider, Switch, Icon } from '../components/ui'
import { useRevealOnScroll } from '../lib/useInView'
import { useT } from '../i18n'
import { ScoreGauge } from '../components/charts'

const DPE_RANK: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 }
const CFG_KEY = 'pepite_config'

function loadCfg(): any {
  try { return JSON.parse(localStorage.getItem(CFG_KEY) || 'null') || {} } catch { return {} }
}

export default function ScoringEngine({ data }: { data: PepiteData }) {
  const t = useT()
  const { CRITERIA, WEIGHTS, LISTINGS } = data
  const revealRef = useRevealOnScroll<HTMLDivElement>()
  const PRESETS: Record<string, Record<string, number>> = {
    'Équilibré': WEIGHTS,
    'Investisseur': { decote: 40, futur_transport: 26, signaux_vendeur: 12, anciennete: 8, dpe_travaux: 6, charges: 5, acces_actuel: 3 },
    'Cash-flow': { decote: 30, futur_transport: 14, signaux_vendeur: 10, anciennete: 8, dpe_travaux: 10, charges: 16, acces_actuel: 12 },
  }
  const saved = useMemo(loadCfg, [])
  const DEFAULT_ZONES: Record<string, boolean> = { '92400': true, '92800': true, '92000': true, '92700': false, '92250': true }
  const [weights, setWeights] = useState<Record<string, number>>({ ...WEIGHTS, ...(saved.weights || {}) })
  const [zones, setZones] = useState<Record<string, boolean>>(saved.zones || { ...DEFAULT_ZONES })
  const [priceMax, setPriceMax] = useState<number>(saved.priceMax ?? 360)
  const [surfMin, setSurfMin] = useState<number>(saved.surfMin ?? 25)
  const [alertEmail, setAlertEmail] = useState<boolean>(saved.alertEmail ?? true)
  const [instant, setInstant] = useState<boolean>(saved.instant ?? false)
  const [threshold, setThreshold] = useState<number>(saved.threshold ?? 70)
  const [dpe, setDpe] = useState<string>(saved.dpe || 'E')
  const [dirty, setDirty] = useState(false)
  const [savedTick, setSavedTick] = useState(false)

  const totalW = Object.values(weights).reduce((a, b) => a + b, 0) || 1
  const setW = (k: string, v: number) => { setWeights((w) => ({ ...w, [k]: v })); setDirty(true) }
  const applyPreset = (name: string) => { setWeights({ ...PRESETS[name] }); setDirty(true) }
  const touch = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); setDirty(true) }

  const save = () => {
    try { localStorage.setItem(CFG_KEY, JSON.stringify({ weights, zones, priceMax, surfMin, alertEmail, instant, threshold, dpe })) } catch { /* ignore */ }
    setDirty(false); setSavedTick(true); setTimeout(() => setSavedTick(false), 2200)
  }
  const reset = () => {
    setWeights({ ...WEIGHTS }); setZones({ ...DEFAULT_ZONES }); setPriceMax(360); setSurfMin(25)
    setAlertEmail(true); setInstant(false); setThreshold(70); setDpe('E'); setDirty(true)
  }

  const passes = (l: Listing) => {
    if (l.price > priceMax * 1000) return false
    if (l.surface < surfMin) return false
    if (dpe !== 'Tous' && DPE_RANK[l.dpe] != null && DPE_RANK[l.dpe] > (DPE_RANK[dpe] ?? 6)) return false
    return true
  }
  const scored = LISTINGS.filter(passes).map((l) => {
    const s = CRITERIA.reduce((acc, c) => acc + (l.crit[c.key] ?? 0) * (weights[c.key] ?? 0), 0) / totalW
    return { ...l, preview: Math.round(s) }
  }).sort((a, b) => b.preview - a.preview)
  const preview = scored.slice(0, 5)
  const matches = scored.filter((l) => l.preview >= threshold).length

  return (
    <div className="page" ref={revealRef}>
      <div className="section-head anim d1" style={{ marginBottom: 18 }}>
        <div className="section-title">{t('Moteur de scoring')}</div>
        <Badge tone="neutral">{t("7 critères d'expert · pondérables")}</Badge>
      </div>

      <div className="scoring-grid">
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="anim d2">
          <Panel
            title={t('Pondération du scoring')} subtitle={t("Ajustez les poids : l'aperçu se recalcule en direct")}
            icon={<SlidersHorizontal size={16} />}
            actions={
              <div style={{ display: 'flex', gap: 6 }}>
                {Object.keys(PRESETS).map((p) => (
                  <button key={p} onClick={() => applyPreset(p)} className="btn btn-sm btn-ghost" style={{ fontSize: 11, height: 26 }}>{t(p)}</button>
                ))}
              </div>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {CRITERIA.map((c) => (
                <div key={c.key} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: 10, alignItems: 'start' }}>
                  <Icon name={c.icon} size={16} color={c.accent} style={{ marginTop: 2 }} />
                  <RangeSlider label={t(c.label)} value={weights[c.key] ?? 0} min={0} max={50} accent={c.accent} onChange={(v) => setW(c.key, v)} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{t('Somme des poids · normalisée à 100 %')}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' }}>{totalW} {t('pts')}</span>
            </div>
          </Panel>

          <Panel title={t('Filtres stricts')} subtitle={t('Exclusion ferme : appliqués avant le scoring')} icon={<Filter size={16} />}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <RangeSlider label={t('Prix maximum')} value={priceMax} min={150} max={1200} step={10} accent="var(--gold-500)" suffix=" k€" onChange={touch(setPriceMax)} />
              <RangeSlider label={t('Surface minimum')} value={surfMin} min={10} max={120} accent="var(--viz-2)" suffix=" m²" onChange={touch(setSurfMin)} />
            </div>
            <div style={{ marginTop: 16 }}>
              <div className="eyebrow" style={{ marginBottom: 9 }}>{t('Zones géographiques')}</div>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {Object.keys(zones).map((z) => (
                  <button key={z} onClick={() => { setZones((s) => ({ ...s, [z]: !s[z] })); setDirty(true) }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 11px', borderRadius: 'var(--radius-pill)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 500,
                      background: zones[z] ? 'var(--brand-soft)' : 'var(--surface-3)', color: zones[z] ? 'var(--brand-400)' : 'var(--text-muted)',
                      border: `1px solid ${zones[z] ? 'rgba(45,212,167,0.35)' : 'var(--border-default)'}` }}>
                    {zones[z] && <Check size={12} />}{z}
                  </button>
                ))}
                <button onClick={() => { const z = (window.prompt(t('Code postal à ajouter (ex : 92110)')) || '').trim(); if (z) { setZones((s) => ({ ...s, [z]: true })); setDirty(true) } }}
                  style={{ height: 28, padding: '0 11px', borderRadius: 'var(--radius-pill)', border: '1px dashed var(--border-strong)', background: 'transparent', color: 'var(--text-faint)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}><Plus size={12} />{t('Zone')}</button>
              </div>
            </div>
            <div style={{ marginTop: 16, maxWidth: 200 }}>
              <div className="eyebrow" style={{ marginBottom: 7 }}>{t('DPE maximum')}</div>
              <select className="field" value={dpe} onChange={(e) => { setDpe(e.target.value); setDirty(true) }}>
                {['B', 'C', 'D', 'E', 'Tous'].map((d) => <option key={d} value={d}>{d === 'Tous' ? t('Tous') : d}</option>)}
              </select>
            </div>
          </Panel>
        </div>

        {/* RIGHT */}
        <div className="anim d3 scoring-aside" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel title={t('Aperçu temps réel')} subtitle={t('Re-classement instantané')} icon={<Zap size={16} />}
            actions={<Badge tone={matches > 0 ? 'gold' : 'neutral'} dot={matches > 0}>{matches} {t('alertes')}</Badge>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {preview.length === 0 && <div style={{ padding: '18px 4px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 'var(--text-xs)' }}>{t('Aucun bien ne passe les filtres stricts.')}</div>}
              {preview.map((l, i) => {
                const diff = l.preview - l.score
                return (
                  <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 0', borderBottom: i < preview.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-faint)', width: 16 }}>{i + 1}</span>
                    <ScoreGauge value={l.preview} size={40} thickness={4} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-default)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>{l.quartier} · {fmtEur(l.price)} €</div>
                    </div>
                    {diff !== 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: diff > 0 ? 'var(--success-500)' : 'var(--danger-500)' }}>{diff > 0 ? '+' : ''}{diff}</span>}
                  </div>
                )
              })}
            </div>
          </Panel>

          <Panel title={t('Alertes')} icon={<Bell size={16} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <RangeSlider label={t("Seuil d'alerte (score min.)")} value={threshold} min={40} max={95} accent="var(--gold-500)" onChange={touch(setThreshold)} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}><Mail size={15} color="var(--text-muted)" />{t('Alerte e-mail')}</span>
                <Switch checked={alertEmail} onChange={touch(setAlertEmail)} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}><Zap size={15} color="var(--text-muted)" />{t('Notification instantanée')}</span>
                <Switch checked={instant} onChange={touch(setInstant)} />
              </div>
            </div>
          </Panel>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" onClick={reset}>{t('Réinitialiser')}</Button>
            <Button variant="brand" disabled={!dirty} onClick={save} leftIcon={<Check size={15} />}>{savedTick ? t('Enregistré ✓') : t('Enregistrer')}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

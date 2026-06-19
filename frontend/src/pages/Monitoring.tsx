import { useState } from 'react'
import { Layers, TrendingUp, Wifi, Server, List, Shield, Activity, Check, AlertTriangle, Download, Pause, Play } from 'lucide-react'
import type { PepiteData, SourceStat, LogEntry } from '../types'
import { Panel, StatCard, Badge, IconButton } from '../components/ui'
import { useRevealOnScroll } from '../lib/useInView'
import { Sparkline } from '../components/charts'

const THROUGHPUT = [38, 42, 31, 55, 61, 48, 72, 80, 66, 90, 84, 102, 95, 78, 88, 110, 124, 98, 86, 70, 64, 58, 49, 53]
const TF_LABELS = ['00:00', '06:00', '12:00', '18:00', 'now']

function StatusDot({ status, label }: { status: string; label?: string }) {
  const map: Record<string, string> = { online: 'var(--success-500)', running: 'var(--success-500)', idle: 'var(--text-faint)', warning: 'var(--warning-500)', blocked: 'var(--danger-500)' }
  const c = map[status] || 'var(--text-faint)'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-xs)', color: 'var(--text-default)' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, boxShadow: status === 'online' || status === 'running' ? `0 0 8px ${c}` : 'none' }} />
      {label}
    </span>
  )
}

function SourceRow({ s }: { s: SourceStat }) {
  const rate = s.scanned > 0 ? Math.round((1 - s.blocked / (s.scanned + s.blocked)) * 100) : 0
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '150px 80px 70px 90px 1fr', alignItems: 'center', gap: 12, padding: '11px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--text-xs)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <StatusDot status={s.status} />
        <span style={{ fontWeight: 600, color: 'var(--text-strong)', fontSize: 'var(--text-sm)' }}>{s.name}</span>
      </div>
      <span className="mono" style={{ color: 'var(--text-default)' }}>{s.scanned.toLocaleString('fr-FR')}</span>
      <span className="mono" style={{ color: s.found > 0 ? 'var(--gold-400)' : 'var(--text-faint)', fontWeight: 600 }}>{s.found}</span>
      <span className="mono" style={{ color: s.blocked > 20 ? 'var(--danger-500)' : 'var(--text-muted)' }}>{s.blocked} bloq.</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 5, borderRadius: 999, background: 'var(--surface-4)', overflow: 'hidden', maxWidth: 110 }}>
          <div style={{ width: `${rate}%`, height: '100%', background: rate > 80 ? 'var(--success-500)' : rate > 50 ? 'var(--warning-500)' : 'var(--danger-500)', borderRadius: 999 }} />
        </div>
        <span className="mono" style={{ color: 'var(--text-faint)', width: 32 }}>{rate}%</span>
        <Badge tone="neutral"><span className="mono" style={{ fontSize: 10 }}>{s.proxy}</span></Badge>
      </div>
    </div>
  )
}

function LogRow({ g }: { g: LogEntry }) {
  const lvl: Record<string, string> = { ok: 'var(--success-500)', info: 'var(--info-500)', warning: 'var(--warning-500)', error: 'var(--danger-500)' }
  const c = lvl[g.level || 'info'] || 'var(--text-muted)'
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '4px 12px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', lineHeight: 1.7 }}>
      <span style={{ color: 'var(--text-disabled)' }}>{g.time}</span>
      <span style={{ color: c, fontWeight: 700, width: 44, textTransform: 'uppercase' }}>{g.level}</span>
      <span style={{ color: 'var(--text-faint)', width: 56 }}>{g.source}</span>
      <span style={{ color: 'var(--text-default)', flex: 1 }}>{g.message}</span>
    </div>
  )
}

export default function Monitoring({ data }: { data: PepiteData }) {
  const [paused, setPaused] = useState(false)
  const revealRef = useRevealOnScroll<HTMLDivElement>()
  const peak = THROUGHPUT.indexOf(Math.max(...THROUGHPUT))

  const exportLogs = () => {
    const lines = data.LOGS.map((g) => `${g.time || ''}  ${String(g.level || 'info').toUpperCase().padEnd(5)} ${g.source || ''}  ${g.message || ''}`.trim())
    const blob = new Blob([lines.join('\n') + '\n'], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `pepite-logs-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }

  return (
    <div className="page" ref={revealRef}>
      <div className="section-head anim d1" style={{ marginBottom: 18 }}>
        <div className="section-title">Monitoring technique</div>
        <StatusDot status="running" label="Pipeline actif" />
      </div>

      <div className="kpi-grid anim d2" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
        <StatCard label="Uptime · 30j" value="99,4" unit="%" icon={<Shield size={15} />} foot={<span style={{ color: 'var(--success-500)' }}>+0,2 %</span>} />
        <StatCard label="Requêtes / min" value="124" icon={<Activity size={15} />} foot={<div style={{ width: 70 }}><Sparkline data={THROUGHPUT.slice(-10)} height={22} /></div>} />
        <StatCard label="Taux de succès" value="91,2" unit="%" icon={<Check size={15} />} foot={<span style={{ color: 'var(--warning-500)' }}>−1,4 %</span>} />
        <StatCard label="Requêtes bloquées" value="158" icon={<AlertTriangle size={15} />} accent="var(--danger-500)" foot={<span style={{ color: 'var(--danger-500)' }}>+62</span>} />
        <StatCard label="Proxies sains" value="42" unit="/ 48" icon={<Server size={15} />} foot={<span style={{ color: 'var(--text-faint)' }}>−3</span>} />
      </div>

      <div className="split section-gap anim d3">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel title="Sources de scraping" icon={<Layers size={16} />} noPadding>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 80px 70px 90px 1fr', gap: 12, padding: '9px 14px', borderBottom: '1px solid var(--border-default)' }}>
              {['Source', 'Scannées', 'Pépites', 'Bloquées', 'Taux · proxy'].map((h) => <span key={h} className="eyebrow" style={{ fontSize: 10 }}>{h}</span>)}
            </div>
            {data.SOURCES.map((s) => <SourceRow key={s.name} s={s} />)}
          </Panel>

          <Panel title="Débit de scraping" subtitle="Requêtes / minute · 24 dernières heures" icon={<TrendingUp size={16} />}>
            <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
              {THROUGHPUT.map((v, i) => {
                const max = Math.max(...THROUGHPUT)
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                    <div style={{ height: `${(v / max) * 100}%`, background: i === peak ? 'var(--gold-500)' : 'var(--brand-500)', opacity: 0.45 + (v / max) * 0.55, borderRadius: '3px 3px 0 0' }} title={`${v} req/min`} />
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
              {TF_LABELS.map((l, i) => <span key={i}>{l}</span>)}
            </div>
          </Panel>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel title="Pool de proxies" icon={<Wifi size={16} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ k: 'FR · Residential', v: 18, t: 20, c: 'var(--success-500)' }, { k: 'FR · Mobile', v: 14, t: 16, c: 'var(--success-500)' }, { k: 'FR · Datacenter', v: 10, t: 12, c: 'var(--warning-500)' }].map((p, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-default)' }}>{p.k}</span>
                    <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{p.v}/{p.t}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: 'var(--surface-4)', overflow: 'hidden' }}>
                    <div style={{ width: `${(p.v / p.t) * 100}%`, height: '100%', background: p.c, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Santé système" icon={<Server size={16} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[['Queue Redis', 'online', '1 240 jobs'], ['Worker pool', 'online', '8 / 8 actifs'], ['Géocodeur IGN', 'online', '84 % cache'], ['Solver captcha', 'warning', 'file 2.1s'], ['SMTP alertes', 'online', '3 envoyés']].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <StatusDot status={r[1]} label={r[0]} />
                  <span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{r[2]}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="section-gap anim d4">
        <Panel title="Console de logs" subtitle="Flux agrégé · toutes sources" icon={<List size={16} />} noPadding
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <StatusDot status={paused ? 'idle' : 'running'} label={paused ? 'En pause' : 'Live'} />
              <IconButton size="sm" label={paused ? 'Reprendre' : 'Pause'} onClick={() => setPaused((p) => !p)}>{paused ? <Play size={14} /> : <Pause size={14} />}</IconButton>
              <IconButton size="sm" label="Exporter" onClick={exportLogs}><Download size={14} /></IconButton>
            </div>
          }>
          <div style={{ background: 'var(--bg-sunken)', maxHeight: 240, overflow: 'auto', padding: '8px 0' }}>
            {data.LOGS.map((g, i) => <LogRow key={i} g={g} />)}
          </div>
        </Panel>
      </div>
    </div>
  )
}

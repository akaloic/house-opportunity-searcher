import type { ReactNode, CSSProperties } from 'react'
import {
  Euro, Route, Zap, History, Leaf, Layers, Train, MapPin, TrendingDown, TrendingUp,
  Star, Gauge, Ruler, Maximize2, Clock, Building2, HelpCircle, ArrowUpRight,
} from 'lucide-react'

// Registry name(string)→composant, pour les icônes pilotées par les données (CRITERIA).
const ICONS: Record<string, typeof Euro> = {
  euro: Euro, route: Route, zap: Zap, history: History, leaf: Leaf, layers: Layers,
  train: Train, 'map-pin': MapPin, 'trending-down': TrendingDown, 'trending-up': TrendingUp,
  star: Star, gauge: Gauge, ruler: Ruler, maximize: Maximize2, clock: Clock, building: Building2,
  'arrow-up-right': ArrowUpRight,
}

export function Icon({ name, size = 16, color, style }: { name: string; size?: number; color?: string; style?: CSSProperties }) {
  const C = ICONS[name] ?? HelpCircle
  return <C size={size} color={color} style={style} strokeWidth={1.9} />
}

/* ---------------- Badge ---------------- */
type Tone = 'neutral' | 'gold' | 'brand' | 'info' | 'success' | 'danger'
export function Badge({ tone = 'neutral', dot, children }: { tone?: Tone; dot?: boolean; children: ReactNode }) {
  return (
    <span className={`badge badge-${tone}`}>
      {dot && <span className="dot" />}
      {children}
    </span>
  )
}

/* ---------------- Delta (variation chiffrée) ---------------- */
// invert=true : une baisse de prix est "bonne" → on l'affiche en vert.
export function Delta({ value, invert, suffix = '%' }: { value: number; invert?: boolean; suffix?: string }) {
  const good = invert ? value > 0 : value > 0
  const cls = good ? 'delta-up' : 'delta-down'
  const Arrow = good ? TrendingDown : TrendingUp
  const sign = value > 0 ? '−' : '+' // invert: décote positive = on paie moins
  if (!invert) return <span className={`delta ${value >= 0 ? 'delta-up' : 'delta-down'}`}>{value >= 0 ? '+' : ''}{value.toFixed(1).replace('.', ',')}{suffix}</span>
  return (
    <span className={`delta ${cls}`}>
      <Arrow size={13} />{sign}{Math.abs(value).toFixed(1).replace('.', ',')}{suffix}
    </span>
  )
}

/* ---------------- Buttons ---------------- */
export function Button({
  variant = 'brand', size = 'md', leftIcon, onClick, disabled, children, type = 'button',
}: {
  variant?: 'brand' | 'gold' | 'ghost'; size?: 'md' | 'sm'; leftIcon?: ReactNode
  onClick?: () => void; disabled?: boolean; children: ReactNode; type?: 'button' | 'submit'
}) {
  return (
    <button type={type} className={`btn btn-${variant}${size === 'sm' ? ' btn-sm' : ''}`} onClick={onClick} disabled={disabled}>
      {leftIcon}{children}
    </button>
  )
}

export function IconButton({
  size = 'md', onClick, disabled, label, active, children,
}: { size?: 'md' | 'sm'; onClick?: () => void; disabled?: boolean; label: string; active?: boolean; children: ReactNode }) {
  return (
    <button
      className={`iconbtn${size === 'sm' ? ' iconbtn-sm' : ''}`}
      onClick={onClick} disabled={disabled} aria-label={label} title={label}
      style={active ? { background: 'var(--brand-soft)', color: 'var(--brand-400)', borderColor: 'rgba(45,212,167,0.3)' } : undefined}
    >
      {children}
    </button>
  )
}

/* ---------------- Card / Panel ---------------- */
export function Card({ hover, glowGold, className = '', style, onClick, children }: {
  hover?: boolean; glowGold?: boolean; className?: string; style?: CSSProperties; onClick?: () => void; children: ReactNode
}) {
  return (
    <div
      className={`card${hover ? ' card-hover' : ''}${glowGold ? ' card-glow-gold' : ''} ${className}`}
      style={style} onClick={onClick}
    >
      {children}
    </div>
  )
}

export function Panel({
  title, subtitle, icon, actions, noPadding, className = '', style, bodyStyle, children,
}: {
  title?: ReactNode; subtitle?: ReactNode; icon?: ReactNode; actions?: ReactNode
  noPadding?: boolean; className?: string; style?: CSSProperties; bodyStyle?: CSSProperties; children: ReactNode
}) {
  return (
    <Card className={`panel ${className}`} style={style}>
      {(title || actions) && (
        <div className="panel-head">
          {icon && <div className="panel-ico">{icon}</div>}
          {title && (
            <div style={{ minWidth: 0 }}>
              <div className="panel-title">{title}</div>
              {subtitle && <div className="panel-sub">{subtitle}</div>}
            </div>
          )}
          {actions && <div className="panel-actions">{actions}</div>}
        </div>
      )}
      <div className="panel-body" style={{ ...(noPadding ? { padding: 0 } : {}), ...bodyStyle }}>
        {children}
      </div>
    </Card>
  )
}

/* ---------------- RangeSlider ---------------- */
export function RangeSlider({
  label, value, min = 0, max = 100, step = 1, accent = 'var(--brand-500)', suffix = '', onChange,
}: { label: string; value: number; min?: number; max?: number; step?: number; accent?: string; suffix?: string; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-strong)' }}>{value}{suffix}</span>
      </div>
      <input
        type="range" className="rng" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ background: `linear-gradient(90deg, ${accent} ${pct}%, var(--surface-4) ${pct}%)`, ['--thumb' as string]: accent }}
      />
    </div>
  )
}

/* ---------------- Switch ---------------- */
export function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      style={{
        width: 40, height: 23, borderRadius: 999, border: '1px solid var(--border-default)', cursor: 'pointer', padding: 2,
        background: checked ? 'var(--brand-500)' : 'var(--surface-3)', transition: 'background var(--dur-fast) var(--ease-out)', position: 'relative',
      }}
    >
      <span style={{ display: 'block', width: 17, height: 17, borderRadius: '50%', background: checked ? 'var(--text-on-brand)' : 'var(--text-muted)', transform: `translateX(${checked ? 17 : 0}px)`, transition: 'transform var(--dur-fast) var(--ease-out)' }} />
    </button>
  )
}

/* ---------------- StatCard ---------------- */
export function StatCard({
  label, value, unit, icon, accent, foot,
}: { label: string; value: string; unit?: string; icon?: ReactNode; accent?: string; foot?: ReactNode }) {
  return (
    <Card className="stat">
      <div className="stat-label">
        {icon && <span style={{ color: accent || 'var(--brand-400)', display: 'inline-flex' }}>{icon}</span>}
        {label}
      </div>
      <div className="stat-value" style={accent ? { color: accent } : undefined}>
        {value}{unit && <span className="stat-unit">{unit}</span>}
      </div>
      {foot && <div className="stat-foot">{foot}</div>}
    </Card>
  )
}

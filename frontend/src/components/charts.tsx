import { useEffect, useRef, useState } from 'react'
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  AreaChart, Area, Tooltip,
} from 'recharts'
import { scoreColor } from '../lib/format'
import { useInView } from '../lib/useInView'

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/* ---------------- ScoreGauge — jauge circulaire SVG ---------------- */
export function ScoreGauge({
  value, size = 64, thickness = 6, showValue = true, label, animate = true,
}: { value: number; size?: number; thickness?: number; showValue?: boolean; label?: string; animate?: boolean }) {
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value)) / 100
  const color = scoreColor(value)
  const { ref, inView } = useInView<HTMLDivElement>()
  const shown = !animate || prefersReduced() ? true : inView
  return (
    <div ref={ref} style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-4)" strokeWidth={thickness} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={thickness}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - (shown ? pct : 0))}
          style={{ transition: 'stroke-dashoffset 1.05s var(--ease-out)', filter: `drop-shadow(0 0 5px ${color}66)` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
        {showValue && (
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size * 0.3, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(value)}
          </span>
        )}
        {label && <span style={{ fontSize: Math.max(8, size * 0.12), color: 'var(--text-faint)', marginTop: 2, fontWeight: 600 }}>{label}</span>}
      </div>
    </div>
  )
}

/* ---------------- ScoreRadar — recharts ---------------- */
export function ScoreRadar({
  axes, size = 210, color = 'var(--brand-500)',
}: { axes: { short: string; value: number }[]; size?: number; color?: string }) {
  const data = axes.map((a) => ({ axis: a.short, value: a.value }))
  return (
    <div style={{ width: '100%', height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="var(--border-subtle)" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
          <Radar dataKey="value" stroke={color} fill={color} fillOpacity={0.28} strokeWidth={2} isAnimationActive animationBegin={150} animationDuration={1100} animationEasing="ease-out" />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ---------------- Sparkline / AreaTrend ---------------- */
function TrendTip({ active, payload, suffix }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(6,7,14,0.92)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: 'var(--text-strong)', fontFamily: 'var(--font-mono)' }}>
      {Math.round(payload[0].value).toLocaleString('fr-FR')}{suffix}
    </div>
  )
}

export function AreaTrend({
  data, color = 'var(--brand-500)', height = 200, suffix = '', showTip = true, gradientId = 'g',
}: { data: { x: string | number; y: number }[]; color?: string; height?: number; suffix?: string; showTip?: boolean; gradientId?: string }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 6, right: 4, bottom: 0, left: 4 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showTip && <Tooltip content={<TrendTip suffix={suffix} />} cursor={{ stroke: 'var(--border-default)' }} />}
          <Area type="monotone" dataKey="y" stroke={color} strokeWidth={2.4} fill={`url(#${gradientId})`} dot={false} activeDot={{ r: 4, fill: color, stroke: 'var(--bg-base)', strokeWidth: 2 }} isAnimationActive />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function Sparkline({ data, color = 'var(--brand-500)', height = 40, gradientId = 'sg' }: { data: number[]; color?: string; height?: number; gradientId?: string }) {
  const d = data.map((y, i) => ({ x: i, y }))
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={d} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="y" stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} dot={false} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ---------------- Distribution — barres de scores ---------------- */
export function ScoreBars({ values }: { values: number[] }) {
  // Buckets : 0-25, 25-45, 45-65, 65-80, 80-100
  const buckets = [0, 0, 0, 0, 0]
  const colors = ['var(--score-0)', 'var(--score-25)', 'var(--score-50)', 'var(--score-75)', 'var(--score-100)']
  const labels = ['<25', '25-45', '45-65', '65-80', '≥80']
  for (const v of values) {
    if (v >= 80) buckets[4]++
    else if (v >= 65) buckets[3]++
    else if (v >= 45) buckets[2]++
    else if (v >= 25) buckets[1]++
    else buckets[0]++
  }
  const max = Math.max(1, ...buckets)
  const { ref, inView } = useInView<HTMLDivElement>()
  const shown = prefersReduced() ? true : inView
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 130, paddingTop: 8 }}>
      {buckets.map((b, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
          <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ width: '100%', height: shown ? `${(b / max) * 100}%` : 0, minHeight: shown && b > 0 ? 6 : 0, background: colors[i], opacity: 0.85, borderRadius: '5px 5px 0 0', transition: `height 0.8s var(--ease-out) ${i * 70}ms`, boxShadow: `0 0 12px ${colors[i]}33` }} title={`${b} bien(s)`} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)' }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

/* ---------------- DrawCurve — courbe d'aire qui se trace à l'entrée ---------------- */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  return d
}

export function DrawCurve({
  data, color = 'var(--brand-500)', height = 150, gradientId = 'dc', durationMs = 1500,
}: { data: number[]; color?: string; height?: number; gradientId?: string; durationMs?: number }) {
  const W = 600
  const H = height
  const pad = 14
  const { ref, inView } = useInView<SVGSVGElement>()
  const shown = prefersReduced() ? true : inView
  const lineRef = useRef<SVGPathElement>(null)
  const [len, setLen] = useState(1)
  useEffect(() => {
    if (lineRef.current) {
      try { setLen(lineRef.current.getTotalLength() || 1) } catch { setLen(1) }
    }
  }, [data.length, height])

  if (data.length < 2) return <div style={{ height }} />
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (W - 2 * pad),
    y: H - pad - ((v - min) / span) * (H - 2 * pad),
  }))
  const line = smoothPath(pts)
  const area = `${line} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`
  const last = pts[pts.length - 1]

  return (
    <svg ref={ref} width="100%" height={height} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.42} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} style={{ opacity: shown ? 1 : 0, transition: `opacity 1s ease ${durationMs * 0.35}ms` }} />
      <path
        ref={lineRef} d={line} fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round"
        style={{ strokeDasharray: len, strokeDashoffset: shown ? 0 : len, transition: `stroke-dashoffset ${durationMs}ms var(--ease-out)`, filter: `drop-shadow(0 1px 6px ${color}55)` }}
      />
      <circle cx={last.x} cy={last.y} r={4.5} fill={color} stroke="var(--bg-base)" strokeWidth={2}
        style={{ opacity: shown ? 1 : 0, transition: `opacity 0.4s ease ${durationMs}ms` }} />
    </svg>
  )
}

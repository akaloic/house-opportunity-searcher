import React from 'react';

/**
 * Multi-criteria radar / spider chart. The canonical way to show a
 * decomposed Pépite score across its weighted axes at a glance.
 */
export function ScoreRadar({
  axes = [], size = 200, max = 100, color = 'var(--brand-500)',
  rings = 4, showLabels = true, style,
}) {
  const cx = size / 2, cy = size / 2;
  const pad = showLabels ? 34 : 10;
  const r = size / 2 - pad;
  const n = axes.length || 1;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i, radius) => [cx + radius * Math.cos(angle(i)), cy + radius * Math.sin(angle(i))];

  const dataPts = axes.map((a, i) => pt(i, (Math.max(0, Math.min(max, a.value)) / max) * r));
  const dataPath = dataPts.map((p) => p.join(',')).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', overflow: 'visible', ...style }}>
      {/* grid rings */}
      {Array.from({ length: rings }).map((_, ri) => {
        const rr = (r * (ri + 1)) / rings;
        const poly = axes.map((_, i) => pt(i, rr).join(',')).join(' ');
        return <polygon key={ri} points={poly} fill="none" stroke="var(--border-subtle)" strokeWidth="1" />;
      })}
      {/* spokes */}
      {axes.map((_, i) => {
        const [x, y] = pt(i, r);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border-subtle)" strokeWidth="1" />;
      })}
      {/* data polygon */}
      <polygon points={dataPath} fill={color} fillOpacity="0.16" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {dataPts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={color} stroke="var(--surface-1)" strokeWidth="1.5" />
      ))}
      {/* axis labels */}
      {showLabels && axes.map((a, i) => {
        const [x, y] = pt(i, r + 16);
        const anchor = Math.abs(x - cx) < 6 ? 'middle' : x > cx ? 'start' : 'end';
        return (
          <text key={i} x={x} y={y} textAnchor={anchor} dominantBaseline="middle"
            fontSize="10" fontWeight="600" fill="var(--text-muted)"
            style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.01em' }}>
            {a.short || a.label}
          </text>
        );
      })}
    </svg>
  );
}

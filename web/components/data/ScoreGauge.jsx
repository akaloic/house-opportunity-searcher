import React from 'react';

/**
 * Radial score gauge (0–100). Color follows the score scale
 * (red → gold → teal). Use for the headline "pépite score".
 */
export function ScoreGauge({ value = 0, size = 96, thickness = 8, label, showValue = true, style }) {
  const v = Math.max(0, Math.min(100, value));
  const color = scoreColor(v);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const dash = (v / 100) * c;
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6, ...style }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-4)" strokeWidth={thickness} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={thickness}
            strokeLinecap="round" strokeDasharray={`${dash} ${c}`}
            style={{ transition: 'stroke-dasharray var(--dur-slow) var(--ease-out)', filter: `drop-shadow(0 0 5px ${color}88)` }}
          />
        </svg>
        {showValue && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: size * 0.32, fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{Math.round(v)}</span>
            <span style={{ fontSize: 9, color: 'var(--text-faint)', letterSpacing: '0.08em', marginTop: 2 }}>/ 100</span>
          </div>
        )}
      </div>
      {label && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>}
    </div>
  );
}

export function scoreColor(v) {
  if (v >= 80) return 'var(--score-100)';
  if (v >= 65) return 'var(--score-75)';
  if (v >= 45) return 'var(--score-50)';
  if (v >= 25) return 'var(--score-25)';
  return 'var(--score-0)';
}

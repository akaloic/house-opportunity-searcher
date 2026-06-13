import React from 'react';

/**
 * Labeled horizontal score/criterion bar. Use for breaking a
 * multi-criteria score into its components.
 */
export function ScoreBar({ label, value = 0, max = 100, accent, suffix = '', size = 'md', style }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const color = accent || autoColor(pct);
  const barH = size === 'sm' ? 5 : 7;
  return (
    <div style={{ width: '100%', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-default)', fontVariantNumeric: 'tabular-nums' }}>{value}{suffix}</span>
      </div>
      <div style={{ height: barH, borderRadius: 'var(--radius-pill)', background: 'var(--surface-4)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 'var(--radius-pill)', background: color, boxShadow: `0 0 8px ${color}55`, transition: 'width var(--dur-slow) var(--ease-out)' }} />
      </div>
    </div>
  );
}

function autoColor(pct) {
  if (pct >= 80) return 'var(--score-100)';
  if (pct >= 65) return 'var(--score-75)';
  if (pct >= 45) return 'var(--score-50)';
  if (pct >= 25) return 'var(--score-25)';
  return 'var(--score-0)';
}

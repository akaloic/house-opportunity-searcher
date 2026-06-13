import React from 'react';

/**
 * KPI / metric card. Big mono number, label, optional delta + sparkline.
 */
export function StatCard({ label, value, unit, delta, deltaTone, icon, accent = 'var(--brand-400)', spark, style }) {
  const tone = deltaTone || (typeof delta === 'string' && delta.trim().startsWith('-') ? 'danger' : 'success');
  const deltaColor = tone === 'danger' ? 'var(--danger-500)' : tone === 'warning' ? 'var(--warning-500)' : tone === 'muted' ? 'var(--text-muted)' : 'var(--success-500)';
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 10, padding: 16,
      background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', minWidth: 0, ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span className="eyebrow" style={{ color: 'var(--text-muted)' }}>{label}</span>
        {icon && <span style={{ color: accent, display: 'flex', opacity: 0.9 }}>{icon}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{value}</span>
        {unit && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>{unit}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        {delta != null && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontWeight: 600, color: deltaColor, fontVariantNumeric: 'tabular-nums' }}>
            <Arrow up={tone !== 'danger'} muted={tone === 'muted'} />{delta}
          </span>
        )}
        {spark && <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>{spark}</div>}
      </div>
    </div>
  );
}

function Arrow({ up, muted }) {
  if (muted) return null;
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: up ? 'none' : 'rotate(180deg)' }}>
      <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

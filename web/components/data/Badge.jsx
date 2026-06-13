import React from 'react';

const TONES = {
  neutral: { bg: 'var(--surface-3)', fg: 'var(--text-muted)', bd: 'var(--border-default)' },
  brand:   { bg: 'var(--brand-soft)', fg: 'var(--brand-400)', bd: 'rgba(45,212,167,0.3)' },
  gold:    { bg: 'var(--gold-soft)', fg: 'var(--gold-400)', bd: 'rgba(242,179,61,0.32)' },
  success: { bg: 'var(--success-soft)', fg: 'var(--success-500)', bd: 'rgba(63,207,106,0.3)' },
  warning: { bg: 'var(--warning-soft)', fg: 'var(--warning-500)', bd: 'rgba(245,166,35,0.3)' },
  danger:  { bg: 'var(--danger-soft)', fg: 'var(--danger-500)', bd: 'rgba(242,88,91,0.3)' },
  info:    { bg: 'var(--info-soft)', fg: 'var(--info-500)', bd: 'rgba(75,163,245,0.3)' },
};

/**
 * Compact status / category badge.
 */
export function Badge({ tone = 'neutral', dot = false, icon, children, solid = false, style }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, height: 20, padding: '0 8px',
      borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-2xs)', fontWeight: 600,
      letterSpacing: '0.02em', whiteSpace: 'nowrap', lineHeight: 1,
      background: solid ? t.fg : t.bg, color: solid ? 'var(--bg-base)' : t.fg,
      border: `1px solid ${solid ? 'transparent' : t.bd}`, ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: solid ? 'var(--bg-base)' : t.fg, flexShrink: 0 }} />}
      {icon}
      {children}
    </span>
  );
}

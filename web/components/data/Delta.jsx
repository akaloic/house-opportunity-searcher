import React from 'react';

/**
 * Inline signed delta indicator (vs marché / vs précédent).
 */
export function Delta({ value, suffix = '%', invert = false, size = 'sm', style }) {
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
  const positive = num >= 0;
  const good = invert ? !positive : positive;
  const color = good ? 'var(--success-500)' : 'var(--danger-500)';
  const fz = size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)';
  const display = typeof value === 'number' ? `${positive ? '+' : ''}${value}${suffix}` : value;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color, fontFamily: 'var(--font-mono)', fontSize: fz, fontWeight: 600, fontVariantNumeric: 'tabular-nums', ...style }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: positive ? 'none' : 'rotate(180deg)' }}>
        <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
      </svg>
      {display}
    </span>
  );
}

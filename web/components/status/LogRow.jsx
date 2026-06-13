import React from 'react';

const LEVELS = {
  info:  { color: 'var(--info-500)', tag: 'INFO' },
  ok:    { color: 'var(--success-500)', tag: ' OK ' },
  warn:  { color: 'var(--warning-500)', tag: 'WARN' },
  error: { color: 'var(--danger-500)', tag: 'ERR ' },
  debug: { color: 'var(--text-faint)', tag: 'DBG ' },
};

/**
 * Monospace log line for the scraping console.
 */
export function LogRow({ time, level = 'info', source, message, style }) {
  const l = LEVELS[level] || LEVELS.info;
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 10, padding: '3px 12px',
      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', lineHeight: 1.7,
      borderRadius: 'var(--radius-xs)', ...style,
    }}>
      {time && <span style={{ color: 'var(--text-faint)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{time}</span>}
      <span style={{ color: l.color, fontWeight: 600, flexShrink: 0, letterSpacing: '0.04em', whiteSpace: 'pre' }}>{l.tag}</span>
      {source && <span style={{ color: 'var(--brand-400)', flexShrink: 0 }}>{source}</span>}
      <span style={{ color: 'var(--text-default)', minWidth: 0, wordBreak: 'break-word' }}>{message}</span>
    </div>
  );
}

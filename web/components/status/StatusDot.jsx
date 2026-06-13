import React from 'react';

const STATES = {
  online:  { color: 'var(--success-500)', label: 'En ligne', pulse: true },
  running: { color: 'var(--brand-500)', label: 'En cours', pulse: true },
  idle:    { color: 'var(--text-faint)', label: 'Au repos', pulse: false },
  warning: { color: 'var(--warning-500)', label: 'Dégradé', pulse: true },
  error:   { color: 'var(--danger-500)', label: 'Erreur', pulse: true },
  blocked: { color: 'var(--danger-500)', label: 'Bloqué', pulse: false },
};

/**
 * Status indicator dot with optional pulse + label.
 */
export function StatusDot({ status = 'idle', label, showLabel = true, size = 8, style }) {
  const s = STATES[status] || STATES.idle;
  const text = label ?? s.label;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, ...style }}>
      <span style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
        {s.pulse && <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: s.color, animation: 'pepite-ping 1.6s var(--ease-out) infinite' }} />}
      </span>
      {showLabel && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-default)', fontWeight: 500 }}>{text}</span>}
    </span>
  );
}

if (typeof document !== 'undefined' && !document.getElementById('pepite-ping')) {
  const st = document.createElement('style'); st.id = 'pepite-ping';
  st.textContent = '@keyframes pepite-ping{0%{transform:scale(1);opacity:.6}80%,100%{transform:scale(2.6);opacity:0}}';
  document.head.appendChild(st);
}

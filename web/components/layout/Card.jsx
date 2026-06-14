import React from 'react';

/**
 * Base surface container. The building block for every panel.
 */
export function Card({ padding = 'md', interactive = false, glow = false, children, style, ...rest }) {
  const pad = { none: 0, sm: 12, md: 16, lg: 20 }[padding] ?? 16;
  return (
    <div
      style={{
        background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', padding: pad,
        WebkitBackdropFilter: 'var(--glass-blur)', backdropFilter: 'var(--glass-blur)',
        boxShadow: (glow ? 'var(--glow-gold)' : 'var(--shadow-1)') + ', var(--glass-edge)',
        transition: 'border-color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        cursor: interactive ? 'pointer' : 'default', ...style,
      }}
      onMouseEnter={interactive ? (e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = 'var(--shadow-2)'; } : undefined}
      onMouseLeave={interactive ? (e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = glow ? 'var(--glow-gold)' : 'var(--shadow-1)'; } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}

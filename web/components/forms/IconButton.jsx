import React from 'react';

const SIZES = { sm: 30, md: 36, lg: 44 };

/**
 * Square icon-only button for dense toolbars.
 */
export function IconButton({
  size = 'md', variant = 'ghost', active = false, disabled = false,
  label, children, style, ...rest
}) {
  const dim = SIZES[size] || SIZES.md;
  const variants = {
    ghost: { background: active ? 'var(--surface-3)' : 'transparent', color: active ? 'var(--brand-400)' : 'var(--text-muted)', border: '1px solid transparent' },
    solid: { background: 'var(--surface-3)', color: 'var(--text-default)', border: '1px solid var(--border-default)' },
    brand: { background: 'var(--brand-soft)', color: 'var(--brand-400)', border: '1px solid rgba(45,212,167,0.3)' },
  };
  const v = variants[variant] || variants.ghost;
  return (
    <button
      aria-label={label} title={label} disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: dim, height: dim, borderRadius: 'var(--radius-md)', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1, flexShrink: 0,
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
        ...v, ...style,
      }}
      onMouseEnter={(e) => { if (!disabled && !active) { e.currentTarget.style.background = 'var(--surface-3)'; e.currentTarget.style.color = 'var(--text-strong)'; } }}
      onMouseLeave={(e) => { if (!disabled && !active) { e.currentTarget.style.background = v.background; e.currentTarget.style.color = v.color; } }}
      {...rest}
    >
      {children}
    </button>
  );
}

import React from 'react';

const SIZES = {
  sm: { height: 30, padding: '0 12px', font: 'var(--text-sm)', gap: 6, radius: 'var(--radius-sm)' },
  md: { height: 36, padding: '0 16px', font: 'var(--text-base)', gap: 8, radius: 'var(--radius-md)' },
  lg: { height: 44, padding: '0 22px', font: 'var(--text-md)', gap: 8, radius: 'var(--radius-md)' },
};

const VARIANTS = {
  primary: {
    background: 'var(--brand-500)', color: 'var(--text-on-brand)',
    border: '1px solid var(--brand-500)', fontWeight: 600,
    boxShadow: '0 1px 0 rgba(255,255,255,0.12) inset, 0 2px 8px rgba(45,212,167,0.25)',
  },
  gold: {
    background: 'var(--gold-500)', color: 'var(--text-on-gold)',
    border: '1px solid var(--gold-500)', fontWeight: 600,
    boxShadow: '0 1px 0 rgba(255,255,255,0.18) inset, 0 2px 8px rgba(242,179,61,0.25)',
  },
  secondary: {
    background: 'var(--surface-3)', color: 'var(--text-strong)',
    border: '1px solid var(--border-default)', fontWeight: 500,
  },
  ghost: {
    background: 'transparent', color: 'var(--text-default)',
    border: '1px solid transparent', fontWeight: 500,
  },
  danger: {
    background: 'var(--danger-soft)', color: 'var(--danger-500)',
    border: '1px solid rgba(242,88,91,0.35)', fontWeight: 600,
  },
};

/**
 * Pépite primary action button.
 */
export function Button({
  variant = 'primary', size = 'md', leftIcon, rightIcon, fullWidth = false,
  disabled = false, loading = false, children, style, ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const isDisabled = disabled || loading;
  return (
    <button
      disabled={isDisabled}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex', width: fullWidth ? '100%' : 'auto',
        alignItems: 'center', justifyContent: 'center', gap: s.gap,
        height: s.height, padding: s.padding, fontSize: s.font, lineHeight: 1,
        fontFamily: 'var(--font-sans)', borderRadius: s.radius, cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1, whiteSpace: 'nowrap', userSelect: 'none',
        transition: 'filter var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
        ...v, ...style,
      }}
      onMouseDown={(e) => { if (!isDisabled) e.currentTarget.style.transform = 'translateY(0.5px) scale(0.99)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.filter = 'none'; }}
      onMouseEnter={(e) => { if (!isDisabled) e.currentTarget.style.filter = variant === 'ghost' || variant === 'secondary' ? 'brightness(1.25)' : 'brightness(1.08)'; }}
      {...rest}
    >
      {loading && <Spinner />}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}

function Spinner() {
  return (
    <span style={{
      width: 13, height: 13, borderRadius: '50%', display: 'inline-block',
      border: '2px solid currentColor', borderTopColor: 'transparent',
      animation: 'pepite-spin 0.6s linear infinite', opacity: 0.9,
    }} />
  );
}

if (typeof document !== 'undefined' && !document.getElementById('pepite-kf')) {
  const st = document.createElement('style'); st.id = 'pepite-kf';
  st.textContent = '@keyframes pepite-spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(st);
}

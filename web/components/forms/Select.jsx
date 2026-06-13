import React from 'react';

/**
 * Native select styled to match Pépite inputs.
 */
export function Select({ size = 'md', invalid = false, disabled = false, children, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const h = { sm: 30, md: 36, lg: 44 }[size] || 36;
  const fz = { sm: 'var(--text-sm)', md: 'var(--text-base)', lg: 'var(--text-md)' }[size];
  const borderColor = invalid ? 'var(--danger-500)' : focus ? 'var(--brand-500)' : 'var(--border-default)';
  return (
    <div style={{ position: 'relative', display: 'inline-flex', width: '100%' }}>
      <select
        disabled={disabled}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          appearance: 'none', WebkitAppearance: 'none', width: '100%', height: h,
          padding: '0 34px 0 12px', background: disabled ? 'var(--surface-2)' : 'var(--surface-3)',
          color: 'var(--text-strong)', fontFamily: 'var(--font-sans)', fontSize: fz,
          border: `1px solid ${borderColor}`, borderRadius: 'var(--radius-md)', outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1,
          boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
          transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
          ...style,
        }}
        {...rest}
      >
        {children}
      </select>
      <span style={{
        position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)',
        pointerEvents: 'none', color: 'var(--text-faint)', display: 'flex',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
      </span>
    </div>
  );
}

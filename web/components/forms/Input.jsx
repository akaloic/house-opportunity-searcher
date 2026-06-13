import React from 'react';

/**
 * Text / number input with optional prefix-suffix affixes.
 */
export function Input({
  size = 'md', prefix, suffix, invalid = false, disabled = false,
  style, wrapStyle, ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const h = { sm: 30, md: 36, lg: 44 }[size] || 36;
  const fz = { sm: 'var(--text-sm)', md: 'var(--text-base)', lg: 'var(--text-md)' }[size];
  const borderColor = invalid ? 'var(--danger-500)' : focus ? 'var(--brand-500)' : 'var(--border-default)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, height: h, padding: '0 12px',
      background: disabled ? 'var(--surface-2)' : 'var(--surface-3)',
      border: `1px solid ${borderColor}`, borderRadius: 'var(--radius-md)',
      boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      opacity: disabled ? 0.55 : 1, ...wrapStyle,
    }}>
      {prefix && <span style={{ color: 'var(--text-faint)', fontSize: fz, display: 'flex', flexShrink: 0 }}>{prefix}</span>}
      <input
        disabled={disabled}
        onFocus={(e) => { setFocus(true); rest.onFocus && rest.onFocus(e); }}
        onBlur={(e) => { setFocus(false); rest.onBlur && rest.onBlur(e); }}
        style={{
          flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
          color: 'var(--text-strong)', fontFamily: 'var(--font-sans)', fontSize: fz,
          fontVariantNumeric: 'tabular-nums', ...style,
        }}
        {...rest}
      />
      {suffix && <span style={{ color: 'var(--text-faint)', fontSize: fz, display: 'flex', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>{suffix}</span>}
    </div>
  );
}

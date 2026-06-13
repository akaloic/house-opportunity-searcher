import React from 'react';

/**
 * On/off toggle switch.
 */
export function Switch({ checked, defaultChecked = false, disabled = false, label, onChange, size = 'md', style, ...rest }) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const on = checked != null ? checked : internal;
  const dims = size === 'sm' ? { w: 32, h: 18, k: 12 } : { w: 40, h: 22, k: 16 };
  const toggle = () => {
    if (disabled) return;
    const next = !on;
    if (checked == null) setInternal(next);
    onChange && onChange(next);
  };
  const sw = (
    <button
      role="switch" aria-checked={on} disabled={disabled} onClick={toggle}
      style={{
        position: 'relative', width: dims.w, height: dims.h, flexShrink: 0, padding: 0,
        borderRadius: 'var(--radius-pill)', cursor: disabled ? 'not-allowed' : 'pointer',
        background: on ? 'var(--brand-500)' : 'var(--surface-4)',
        border: `1px solid ${on ? 'var(--brand-500)' : 'var(--border-strong)'}`,
        boxShadow: on ? '0 0 10px var(--brand-glow)' : 'none', opacity: disabled ? 0.5 : 1,
        transition: 'background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
      }}
    >
      <span style={{
        position: 'absolute', top: '50%', left: on ? dims.w - dims.k - 3 : 2, transform: 'translateY(-50%)',
        width: dims.k, height: dims.k, borderRadius: '50%', background: on ? 'var(--text-on-brand)' : '#cdd5e0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.5)', transition: 'left var(--dur-base) var(--ease-spring)',
      }} />
    </button>
  );
  if (!label) return sw;
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', ...style }}>
      {sw}
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>{label}</span>
    </label>
  );
}

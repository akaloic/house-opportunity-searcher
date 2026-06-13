import React from 'react';

/**
 * Underline tab bar. Controlled or uncontrolled.
 */
export function Tabs({ tabs = [], value, defaultValue, onChange, size = 'md', style }) {
  const first = defaultValue ?? (tabs[0] && tabs[0].id);
  const [internal, setInternal] = React.useState(first);
  const active = value != null ? value : internal;
  const h = size === 'sm' ? 34 : 40;
  const fz = size === 'sm' ? 'var(--text-sm)' : 'var(--text-base)';
  return (
    <div role="tablist" style={{ display: 'flex', alignItems: 'stretch', gap: 2, borderBottom: '1px solid var(--border-subtle)', ...style }}>
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id} role="tab" aria-selected={on} disabled={t.disabled}
            onClick={() => { if (t.disabled) return; if (value == null) setInternal(t.id); onChange && onChange(t.id); }}
            style={{
              position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 7, height: h,
              padding: '0 14px', background: 'transparent', border: 'none', cursor: t.disabled ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: fz, fontWeight: on ? 600 : 500,
              color: on ? 'var(--text-strong)' : 'var(--text-muted)', opacity: t.disabled ? 0.4 : 1,
              transition: 'color var(--dur-fast) var(--ease-out)',
            }}
            onMouseEnter={(e) => { if (!on && !t.disabled) e.currentTarget.style.color = 'var(--text-default)'; }}
            onMouseLeave={(e) => { if (!on) e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            {t.icon}
            {t.label}
            {t.count != null && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', fontWeight: 600, color: on ? 'var(--brand-400)' : 'var(--text-faint)', background: on ? 'var(--brand-soft)' : 'var(--surface-3)', padding: '0 5px', borderRadius: 'var(--radius-sm)', minWidth: 16, textAlign: 'center' }}>{t.count}</span>
            )}
            <span style={{ position: 'absolute', left: 8, right: 8, bottom: -1, height: 2, borderRadius: '2px 2px 0 0', background: on ? 'var(--brand-500)' : 'transparent', boxShadow: on ? '0 0 8px var(--brand-glow)' : 'none', transition: 'background var(--dur-fast) var(--ease-out)' }} />
          </button>
        );
      })}
    </div>
  );
}

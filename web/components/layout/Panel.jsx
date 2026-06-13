import React from 'react';

/**
 * Titled panel with header bar + optional actions. Wraps dashboard
 * widgets (map, chart, log console).
 */
export function Panel({ title, subtitle, icon, actions, noPadding = false, children, style, bodyStyle }) {
  return (
    <section style={{
      display: 'flex', flexDirection: 'column', background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
      overflow: 'hidden', minHeight: 0, ...style,
    }}>
      {(title || actions) && (
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          padding: '11px 14px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
            {icon && <span style={{ color: 'var(--text-muted)', display: 'flex' }}>{icon}</span>}
            <div style={{ minWidth: 0 }}>
              {title && <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', letterSpacing: '-0.005em' }}>{title}</h3>}
              {subtitle && <p style={{ margin: '1px 0 0', fontSize: 'var(--text-2xs)', color: 'var(--text-faint)' }}>{subtitle}</p>}
            </div>
          </div>
          {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>{actions}</div>}
        </header>
      )}
      <div style={{ padding: noPadding ? 0 : 14, flex: 1, minHeight: 0, ...bodyStyle }}>{children}</div>
    </section>
  );
}

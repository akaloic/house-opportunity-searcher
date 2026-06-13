import React from 'react';

/**
 * Weight slider — the core control of the Pépite scoring engine.
 * Shows a live value pill and an optional accent color per criterion.
 */
export function RangeSlider({
  value, defaultValue = 50, min = 0, max = 100, step = 1,
  label, valueSuffix = '', accent = 'var(--brand-500)', disabled = false,
  showValue = true, onChange, style, ...rest
}) {
  const [internal, setInternal] = React.useState(defaultValue);
  const val = value != null ? value : internal;
  const pct = ((val - min) / (max - min)) * 100;
  const handle = (e) => {
    const v = Number(e.target.value);
    if (value == null) setInternal(v);
    onChange && onChange(v, e);
  };
  return (
    <div style={{ width: '100%', opacity: disabled ? 0.5 : 1, ...style }}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }}>
          {label && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-default)', fontWeight: 500 }}>{label}</span>}
          {showValue && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 600,
              color: accent, fontVariantNumeric: 'tabular-nums',
              background: 'var(--surface-3)', padding: '1px 8px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)', minWidth: 38, textAlign: 'center',
            }}>{val}{valueSuffix}</span>
          )}
        </div>
      )}
      <div style={{ position: 'relative', height: 18, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: '0', top: '50%', transform: 'translateY(-50%)', height: 6, borderRadius: 'var(--radius-pill)', background: 'var(--surface-4)' }} />
        <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', height: 6, width: `${pct}%`, borderRadius: 'var(--radius-pill)', background: accent, boxShadow: `0 0 10px ${accent}66` }} />
        <input
          type="range" min={min} max={max} step={step} value={val} disabled={disabled}
          onChange={handle}
          style={{
            position: 'relative', width: '100%', margin: 0, appearance: 'none', WebkitAppearance: 'none',
            background: 'transparent', cursor: disabled ? 'not-allowed' : 'pointer', height: 18,
            ['--pp-accent']: accent,
          }}
          {...rest}
        />
      </div>
    </div>
  );
}

if (typeof document !== 'undefined' && !document.getElementById('pepite-range-css')) {
  const st = document.createElement('style'); st.id = 'pepite-range-css';
  st.textContent = `
    input[type=range]::-webkit-slider-thumb{ -webkit-appearance:none; width:16px; height:16px; border-radius:50%;
      background:#fff; border:3px solid var(--pp-accent,#2DD4A7); box-shadow:0 2px 6px rgba(0,0,0,.5); cursor:grab; margin-top:0; }
    input[type=range]:active::-webkit-slider-thumb{ cursor:grabbing; transform:scale(1.12); }
    input[type=range]::-moz-range-thumb{ width:16px; height:16px; border-radius:50%; background:#fff;
      border:3px solid var(--pp-accent,#2DD4A7); box-shadow:0 2px 6px rgba(0,0,0,.5); cursor:grab; }
    input[type=range]::-webkit-slider-thumb{ transition:transform .12s ease; }
  `;
  document.head.appendChild(st);
}

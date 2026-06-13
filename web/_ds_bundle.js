/* @ds-bundle: {"format":3,"namespace":"PPiteDesignSystem_0c887c","components":[{"name":"Badge","sourcePath":"components/data/Badge.jsx"},{"name":"Delta","sourcePath":"components/data/Delta.jsx"},{"name":"ScoreBar","sourcePath":"components/data/ScoreBar.jsx"},{"name":"ScoreGauge","sourcePath":"components/data/ScoreGauge.jsx"},{"name":"ScoreRadar","sourcePath":"components/data/ScoreRadar.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"RangeSlider","sourcePath":"components/forms/RangeSlider.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"},{"name":"Panel","sourcePath":"components/layout/Panel.jsx"},{"name":"Tabs","sourcePath":"components/layout/Tabs.jsx"},{"name":"LogRow","sourcePath":"components/status/LogRow.jsx"},{"name":"StatusDot","sourcePath":"components/status/StatusDot.jsx"}],"sourceHashes":{"components/data/Badge.jsx":"9c121582dede","components/data/Delta.jsx":"08feb65fb4cf","components/data/ScoreBar.jsx":"e89abe677a0a","components/data/ScoreGauge.jsx":"57dbb56cf896","components/data/ScoreRadar.jsx":"f6778bfba614","components/data/StatCard.jsx":"fee5e89a3e11","components/forms/Button.jsx":"c97c2c89c580","components/forms/IconButton.jsx":"a28a699c0040","components/forms/Input.jsx":"8b776033909a","components/forms/RangeSlider.jsx":"42cf34fd40f9","components/forms/Select.jsx":"fed3dde4a163","components/forms/Switch.jsx":"5db94dcd963c","components/layout/Card.jsx":"edb38dcedc9b","components/layout/Panel.jsx":"df5dfa11f05f","components/layout/Tabs.jsx":"7163bf5d10fd","components/status/LogRow.jsx":"e94bd3a5917f","components/status/StatusDot.jsx":"75a9f86d0d69","ui_kits/pepite-dashboard/AppShell.jsx":"6e37a53703ea","ui_kits/pepite-dashboard/ConfigView.jsx":"4308710ce484","ui_kits/pepite-dashboard/DashboardView.jsx":"e70a07dba23e","ui_kits/pepite-dashboard/DetailView.jsx":"59d4d9741698","ui_kits/pepite-dashboard/MonitoringView.jsx":"792c1845d085","ui_kits/pepite-dashboard/data.js":"55dd12753b15","ui_kits/pepite-dashboard/icons.jsx":"2180da81323e"},"inlinedExternals":[],"unexposedExports":[{"name":"scoreColor","sourcePath":"components/data/ScoreGauge.jsx"}]} */

(() => {

const __ds_ns = (window.PPiteDesignSystem_0c887c = window.PPiteDesignSystem_0c887c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/data/Badge.jsx
try { (() => {
const TONES = {
  neutral: {
    bg: 'var(--surface-3)',
    fg: 'var(--text-muted)',
    bd: 'var(--border-default)'
  },
  brand: {
    bg: 'var(--brand-soft)',
    fg: 'var(--brand-400)',
    bd: 'rgba(45,212,167,0.3)'
  },
  gold: {
    bg: 'var(--gold-soft)',
    fg: 'var(--gold-400)',
    bd: 'rgba(242,179,61,0.32)'
  },
  success: {
    bg: 'var(--success-soft)',
    fg: 'var(--success-500)',
    bd: 'rgba(63,207,106,0.3)'
  },
  warning: {
    bg: 'var(--warning-soft)',
    fg: 'var(--warning-500)',
    bd: 'rgba(245,166,35,0.3)'
  },
  danger: {
    bg: 'var(--danger-soft)',
    fg: 'var(--danger-500)',
    bd: 'rgba(242,88,91,0.3)'
  },
  info: {
    bg: 'var(--info-soft)',
    fg: 'var(--info-500)',
    bd: 'rgba(75,163,245,0.3)'
  }
};

/**
 * Compact status / category badge.
 */
function Badge({
  tone = 'neutral',
  dot = false,
  icon,
  children,
  solid = false,
  style
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: 20,
      padding: '0 8px',
      borderRadius: 'var(--radius-sm)',
      fontSize: 'var(--text-2xs)',
      fontWeight: 600,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
      lineHeight: 1,
      background: solid ? t.fg : t.bg,
      color: solid ? 'var(--bg-base)' : t.fg,
      border: `1px solid ${solid ? 'transparent' : t.bd}`,
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: solid ? 'var(--bg-base)' : t.fg,
      flexShrink: 0
    }
  }), icon, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data/Delta.jsx
try { (() => {
/**
 * Inline signed delta indicator (vs marché / vs précédent).
 */
function Delta({
  value,
  suffix = '%',
  invert = false,
  size = 'sm',
  style
}) {
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
  const positive = num >= 0;
  const good = invert ? !positive : positive;
  const color = good ? 'var(--success-500)' : 'var(--danger-500)';
  const fz = size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)';
  const display = typeof value === 'number' ? `${positive ? '+' : ''}${value}${suffix}` : value;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      color,
      fontFamily: 'var(--font-mono)',
      fontSize: fz,
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "10",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3.2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: positive ? 'none' : 'rotate(180deg)'
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "19",
    x2: "12",
    y2: "5"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "5 12 12 5 19 12"
  })), display);
}
Object.assign(__ds_scope, { Delta });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Delta.jsx", error: String((e && e.message) || e) }); }

// components/data/ScoreBar.jsx
try { (() => {
/**
 * Labeled horizontal score/criterion bar. Use for breaking a
 * multi-criteria score into its components.
 */
function ScoreBar({
  label,
  value = 0,
  max = 100,
  accent,
  suffix = '',
  size = 'md',
  style
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const color = accent || autoColor(pct);
  const barH = size === 'sm' ? 5 : 7;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      color: 'var(--text-default)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value, suffix)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: barH,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-4)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: '100%',
      borderRadius: 'var(--radius-pill)',
      background: color,
      boxShadow: `0 0 8px ${color}55`,
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  })));
}
function autoColor(pct) {
  if (pct >= 80) return 'var(--score-100)';
  if (pct >= 65) return 'var(--score-75)';
  if (pct >= 45) return 'var(--score-50)';
  if (pct >= 25) return 'var(--score-25)';
  return 'var(--score-0)';
}
Object.assign(__ds_scope, { ScoreBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ScoreBar.jsx", error: String((e && e.message) || e) }); }

// components/data/ScoreGauge.jsx
try { (() => {
/**
 * Radial score gauge (0–100). Color follows the score scale
 * (red → gold → teal). Use for the headline "pépite score".
 */
function ScoreGauge({
  value = 0,
  size = 96,
  thickness = 8,
  label,
  showValue = true,
  style
}) {
  const v = Math.max(0, Math.min(100, value));
  const color = scoreColor(v);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const dash = v / 100 * c;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: 'rotate(-90deg)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--surface-4)",
    strokeWidth: thickness
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: color,
    strokeWidth: thickness,
    strokeLinecap: "round",
    strokeDasharray: `${dash} ${c}`,
    style: {
      transition: 'stroke-dasharray var(--dur-slow) var(--ease-out)',
      filter: `drop-shadow(0 0 5px ${color}88)`
    }
  })), showValue && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: size * 0.32,
      fontWeight: 700,
      color: 'var(--text-strong)',
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, Math.round(v)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: 'var(--text-faint)',
      letterSpacing: '0.08em',
      marginTop: 2
    }
  }, "/ 100"))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      fontWeight: 500
    }
  }, label));
}
function scoreColor(v) {
  if (v >= 80) return 'var(--score-100)';
  if (v >= 65) return 'var(--score-75)';
  if (v >= 45) return 'var(--score-50)';
  if (v >= 25) return 'var(--score-25)';
  return 'var(--score-0)';
}
Object.assign(__ds_scope, { ScoreGauge, scoreColor });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ScoreGauge.jsx", error: String((e && e.message) || e) }); }

// components/data/ScoreRadar.jsx
try { (() => {
/**
 * Multi-criteria radar / spider chart. The canonical way to show a
 * decomposed Pépite score across its weighted axes at a glance.
 */
function ScoreRadar({
  axes = [],
  size = 200,
  max = 100,
  color = 'var(--brand-500)',
  rings = 4,
  showLabels = true,
  style
}) {
  const cx = size / 2,
    cy = size / 2;
  const pad = showLabels ? 34 : 10;
  const r = size / 2 - pad;
  const n = axes.length || 1;
  const angle = i => Math.PI * 2 * i / n - Math.PI / 2;
  const pt = (i, radius) => [cx + radius * Math.cos(angle(i)), cy + radius * Math.sin(angle(i))];
  const dataPts = axes.map((a, i) => pt(i, Math.max(0, Math.min(max, a.value)) / max * r));
  const dataPath = dataPts.map(p => p.join(',')).join(' ');
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    style: {
      display: 'block',
      overflow: 'visible',
      ...style
    }
  }, Array.from({
    length: rings
  }).map((_, ri) => {
    const rr = r * (ri + 1) / rings;
    const poly = axes.map((_, i) => pt(i, rr).join(',')).join(' ');
    return /*#__PURE__*/React.createElement("polygon", {
      key: ri,
      points: poly,
      fill: "none",
      stroke: "var(--border-subtle)",
      strokeWidth: "1"
    });
  }), axes.map((_, i) => {
    const [x, y] = pt(i, r);
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: cx,
      y1: cy,
      x2: x,
      y2: y,
      stroke: "var(--border-subtle)",
      strokeWidth: "1"
    });
  }), /*#__PURE__*/React.createElement("polygon", {
    points: dataPath,
    fill: color,
    fillOpacity: "0.16",
    stroke: color,
    strokeWidth: "2",
    strokeLinejoin: "round"
  }), dataPts.map((p, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: p[0],
    cy: p[1],
    r: "3",
    fill: color,
    stroke: "var(--surface-1)",
    strokeWidth: "1.5"
  })), showLabels && axes.map((a, i) => {
    const [x, y] = pt(i, r + 16);
    const anchor = Math.abs(x - cx) < 6 ? 'middle' : x > cx ? 'start' : 'end';
    return /*#__PURE__*/React.createElement("text", {
      key: i,
      x: x,
      y: y,
      textAnchor: anchor,
      dominantBaseline: "middle",
      fontSize: "10",
      fontWeight: "600",
      fill: "var(--text-muted)",
      style: {
        fontFamily: 'var(--font-sans)',
        letterSpacing: '0.01em'
      }
    }, a.short || a.label);
  }));
}
Object.assign(__ds_scope, { ScoreRadar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ScoreRadar.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
/**
 * KPI / metric card. Big mono number, label, optional delta + sparkline.
 */
function StatCard({
  label,
  value,
  unit,
  delta,
  deltaTone,
  icon,
  accent = 'var(--brand-400)',
  spark,
  style
}) {
  const tone = deltaTone || (typeof delta === 'string' && delta.trim().startsWith('-') ? 'danger' : 'success');
  const deltaColor = tone === 'danger' ? 'var(--danger-500)' : tone === 'warning' ? 'var(--warning-500)' : tone === 'muted' ? 'var(--text-muted)' : 'var(--success-500)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: 16,
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      color: 'var(--text-muted)'
    }
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: accent,
      display: 'flex',
      opacity: 0.9
    }
  }, icon)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-3xl)',
      fontWeight: 700,
      color: 'var(--text-strong)',
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.01em',
      whiteSpace: 'nowrap'
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-faint)',
      fontFamily: 'var(--font-mono)'
    }
  }, unit)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, delta != null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      fontSize: 'var(--text-xs)',
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      color: deltaColor,
      fontVariantNumeric: 'tabular-nums'
    }
  }, /*#__PURE__*/React.createElement(Arrow, {
    up: tone !== 'danger',
    muted: tone === 'muted'
  }), delta), spark && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, spark)));
}
function Arrow({
  up,
  muted
}) {
  if (muted) return null;
  return /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: up ? 'none' : 'rotate(180deg)'
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "19",
    x2: "12",
    y2: "5"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "5 12 12 5 19 12"
  }));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    height: 30,
    padding: '0 12px',
    font: 'var(--text-sm)',
    gap: 6,
    radius: 'var(--radius-sm)'
  },
  md: {
    height: 36,
    padding: '0 16px',
    font: 'var(--text-base)',
    gap: 8,
    radius: 'var(--radius-md)'
  },
  lg: {
    height: 44,
    padding: '0 22px',
    font: 'var(--text-md)',
    gap: 8,
    radius: 'var(--radius-md)'
  }
};
const VARIANTS = {
  primary: {
    background: 'var(--brand-500)',
    color: 'var(--text-on-brand)',
    border: '1px solid var(--brand-500)',
    fontWeight: 600,
    boxShadow: '0 1px 0 rgba(255,255,255,0.12) inset, 0 2px 8px rgba(45,212,167,0.25)'
  },
  gold: {
    background: 'var(--gold-500)',
    color: 'var(--text-on-gold)',
    border: '1px solid var(--gold-500)',
    fontWeight: 600,
    boxShadow: '0 1px 0 rgba(255,255,255,0.18) inset, 0 2px 8px rgba(242,179,61,0.25)'
  },
  secondary: {
    background: 'var(--surface-3)',
    color: 'var(--text-strong)',
    border: '1px solid var(--border-default)',
    fontWeight: 500
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-default)',
    border: '1px solid transparent',
    fontWeight: 500
  },
  danger: {
    background: 'var(--danger-soft)',
    color: 'var(--danger-500)',
    border: '1px solid rgba(242,88,91,0.35)',
    fontWeight: 600
  }
};

/**
 * Pépite primary action button.
 */
function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled = false,
  loading = false,
  children,
  style,
  ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const isDisabled = disabled || loading;
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: isDisabled,
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      fontSize: s.font,
      lineHeight: 1,
      fontFamily: 'var(--font-sans)',
      borderRadius: s.radius,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
      whiteSpace: 'nowrap',
      userSelect: 'none',
      transition: 'filter var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
      ...v,
      ...style
    },
    onMouseDown: e => {
      if (!isDisabled) e.currentTarget.style.transform = 'translateY(0.5px) scale(0.99)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'none';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.filter = 'none';
    },
    onMouseEnter: e => {
      if (!isDisabled) e.currentTarget.style.filter = variant === 'ghost' || variant === 'secondary' ? 'brightness(1.25)' : 'brightness(1.08)';
    }
  }, rest), loading && /*#__PURE__*/React.createElement(Spinner, null), !loading && leftIcon, children, !loading && rightIcon);
}
function Spinner() {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 13,
      height: 13,
      borderRadius: '50%',
      display: 'inline-block',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      animation: 'pepite-spin 0.6s linear infinite',
      opacity: 0.9
    }
  });
}
if (typeof document !== 'undefined' && !document.getElementById('pepite-kf')) {
  const st = document.createElement('style');
  st.id = 'pepite-kf';
  st.textContent = '@keyframes pepite-spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(st);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: 30,
  md: 36,
  lg: 44
};

/**
 * Square icon-only button for dense toolbars.
 */
function IconButton({
  size = 'md',
  variant = 'ghost',
  active = false,
  disabled = false,
  label,
  children,
  style,
  ...rest
}) {
  const dim = SIZES[size] || SIZES.md;
  const variants = {
    ghost: {
      background: active ? 'var(--surface-3)' : 'transparent',
      color: active ? 'var(--brand-400)' : 'var(--text-muted)',
      border: '1px solid transparent'
    },
    solid: {
      background: 'var(--surface-3)',
      color: 'var(--text-default)',
      border: '1px solid var(--border-default)'
    },
    brand: {
      background: 'var(--brand-soft)',
      color: 'var(--brand-400)',
      border: '1px solid rgba(45,212,167,0.3)'
    }
  };
  const v = variants[variant] || variants.ghost;
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    title: label,
    disabled: disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      flexShrink: 0,
      transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
      ...v,
      ...style
    },
    onMouseEnter: e => {
      if (!disabled && !active) {
        e.currentTarget.style.background = 'var(--surface-3)';
        e.currentTarget.style.color = 'var(--text-strong)';
      }
    },
    onMouseLeave: e => {
      if (!disabled && !active) {
        e.currentTarget.style.background = v.background;
        e.currentTarget.style.color = v.color;
      }
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Text / number input with optional prefix-suffix affixes.
 */
function Input({
  size = 'md',
  prefix,
  suffix,
  invalid = false,
  disabled = false,
  style,
  wrapStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const h = {
    sm: 30,
    md: 36,
    lg: 44
  }[size] || 36;
  const fz = {
    sm: 'var(--text-sm)',
    md: 'var(--text-base)',
    lg: 'var(--text-md)'
  }[size];
  const borderColor = invalid ? 'var(--danger-500)' : focus ? 'var(--brand-500)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: h,
      padding: '0 12px',
      background: disabled ? 'var(--surface-2)' : 'var(--surface-3)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      opacity: disabled ? 0.55 : 1,
      ...wrapStyle
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)',
      fontSize: fz,
      display: 'flex',
      flexShrink: 0
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    disabled: disabled,
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      flex: 1,
      minWidth: 0,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: 'var(--text-strong)',
      fontFamily: 'var(--font-sans)',
      fontSize: fz,
      fontVariantNumeric: 'tabular-nums',
      ...style
    }
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)',
      fontSize: fz,
      display: 'flex',
      flexShrink: 0,
      fontFamily: 'var(--font-mono)'
    }
  }, suffix));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/RangeSlider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Weight slider — the core control of the Pépite scoring engine.
 * Shows a live value pill and an optional accent color per criterion.
 */
function RangeSlider({
  value,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  label,
  valueSuffix = '',
  accent = 'var(--brand-500)',
  disabled = false,
  showValue = true,
  onChange,
  style,
  ...rest
}) {
  const [internal, setInternal] = React.useState(defaultValue);
  const val = value != null ? value : internal;
  const pct = (val - min) / (max - min) * 100;
  const handle = e => {
    const v = Number(e.target.value);
    if (value == null) setInternal(v);
    onChange && onChange(v, e);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 9
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-default)',
      fontWeight: 500
    }
  }, label), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      color: accent,
      fontVariantNumeric: 'tabular-nums',
      background: 'var(--surface-3)',
      padding: '1px 8px',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border-subtle)',
      minWidth: 38,
      textAlign: 'center'
    }
  }, val, valueSuffix)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 18,
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: '0',
      top: '50%',
      transform: 'translateY(-50%)',
      height: 6,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-4)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      height: 6,
      width: `${pct}%`,
      borderRadius: 'var(--radius-pill)',
      background: accent,
      boxShadow: `0 0 10px ${accent}66`
    }
  }), /*#__PURE__*/React.createElement("input", _extends({
    type: "range",
    min: min,
    max: max,
    step: step,
    value: val,
    disabled: disabled,
    onChange: handle,
    style: {
      position: 'relative',
      width: '100%',
      margin: 0,
      appearance: 'none',
      WebkitAppearance: 'none',
      background: 'transparent',
      cursor: disabled ? 'not-allowed' : 'pointer',
      height: 18,
      ['--pp-accent']: accent
    }
  }, rest))));
}
if (typeof document !== 'undefined' && !document.getElementById('pepite-range-css')) {
  const st = document.createElement('style');
  st.id = 'pepite-range-css';
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
Object.assign(__ds_scope, { RangeSlider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/RangeSlider.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Native select styled to match Pépite inputs.
 */
function Select({
  size = 'md',
  invalid = false,
  disabled = false,
  children,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const h = {
    sm: 30,
    md: 36,
    lg: 44
  }[size] || 36;
  const fz = {
    sm: 'var(--text-sm)',
    md: 'var(--text-base)',
    lg: 'var(--text-md)'
  }[size];
  const borderColor = invalid ? 'var(--danger-500)' : focus ? 'var(--brand-500)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      height: h,
      padding: '0 34px 0 12px',
      background: disabled ? 'var(--surface-2)' : 'var(--surface-3)',
      color: 'var(--text-strong)',
      fontFamily: 'var(--font-sans)',
      fontSize: fz,
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, rest), children), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 11,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--text-faint)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/**
 * On/off toggle switch.
 */
function Switch({
  checked,
  defaultChecked = false,
  disabled = false,
  label,
  onChange,
  size = 'md',
  style,
  ...rest
}) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const on = checked != null ? checked : internal;
  const dims = size === 'sm' ? {
    w: 32,
    h: 18,
    k: 12
  } : {
    w: 40,
    h: 22,
    k: 16
  };
  const toggle = () => {
    if (disabled) return;
    const next = !on;
    if (checked == null) setInternal(next);
    onChange && onChange(next);
  };
  const sw = /*#__PURE__*/React.createElement("button", {
    role: "switch",
    "aria-checked": on,
    disabled: disabled,
    onClick: toggle,
    style: {
      position: 'relative',
      width: dims.w,
      height: dims.h,
      flexShrink: 0,
      padding: 0,
      borderRadius: 'var(--radius-pill)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: on ? 'var(--brand-500)' : 'var(--surface-4)',
      border: `1px solid ${on ? 'var(--brand-500)' : 'var(--border-strong)'}`,
      boxShadow: on ? '0 0 10px var(--brand-glow)' : 'none',
      opacity: disabled ? 0.5 : 1,
      transition: 'background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '50%',
      left: on ? dims.w - dims.k - 3 : 2,
      transform: 'translateY(-50%)',
      width: dims.k,
      height: dims.k,
      borderRadius: '50%',
      background: on ? 'var(--text-on-brand)' : '#cdd5e0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
      transition: 'left var(--dur-base) var(--ease-spring)'
    }
  }));
  if (!label) return sw;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style
    }
  }, sw, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-default)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Base surface container. The building block for every panel.
 */
function Card({
  padding = 'md',
  interactive = false,
  glow = false,
  children,
  style,
  ...rest
}) {
  const pad = {
    none: 0,
    sm: 12,
    md: 16,
    lg: 20
  }[padding] ?? 16;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: pad,
      boxShadow: glow ? 'var(--glow-gold)' : 'var(--shadow-1)',
      transition: 'border-color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      cursor: interactive ? 'pointer' : 'default',
      ...style
    },
    onMouseEnter: interactive ? e => {
      e.currentTarget.style.borderColor = 'var(--border-strong)';
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-2)';
    } : undefined,
    onMouseLeave: interactive ? e => {
      e.currentTarget.style.borderColor = 'var(--border-subtle)';
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = glow ? 'var(--glow-gold)' : 'var(--shadow-1)';
    } : undefined
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

// components/layout/Panel.jsx
try { (() => {
/**
 * Titled panel with header bar + optional actions. Wraps dashboard
 * widgets (map, chart, log console).
 */
function Panel({
  title,
  subtitle,
  icon,
  actions,
  noPadding = false,
  children,
  style,
  bodyStyle
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      minHeight: 0,
      ...style
    }
  }, (title || actions) && /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '11px 14px',
      borderBottom: '1px solid var(--border-subtle)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      minWidth: 0
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      display: 'flex'
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      color: 'var(--text-strong)',
      letterSpacing: '-0.005em'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '1px 0 0',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)'
    }
  }, subtitle))), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      flexShrink: 0
    }
  }, actions)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: noPadding ? 0 : 14,
      flex: 1,
      minHeight: 0,
      ...bodyStyle
    }
  }, children));
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Panel.jsx", error: String((e && e.message) || e) }); }

// components/layout/Tabs.jsx
try { (() => {
/**
 * Underline tab bar. Controlled or uncontrolled.
 */
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  size = 'md',
  style
}) {
  const first = defaultValue ?? (tabs[0] && tabs[0].id);
  const [internal, setInternal] = React.useState(first);
  const active = value != null ? value : internal;
  const h = size === 'sm' ? 34 : 40;
  const fz = size === 'sm' ? 'var(--text-sm)' : 'var(--text-base)';
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      alignItems: 'stretch',
      gap: 2,
      borderBottom: '1px solid var(--border-subtle)',
      ...style
    }
  }, tabs.map(t => {
    const on = t.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      role: "tab",
      "aria-selected": on,
      disabled: t.disabled,
      onClick: () => {
        if (t.disabled) return;
        if (value == null) setInternal(t.id);
        onChange && onChange(t.id);
      },
      style: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: h,
        padding: '0 14px',
        background: 'transparent',
        border: 'none',
        cursor: t.disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: fz,
        fontWeight: on ? 600 : 500,
        color: on ? 'var(--text-strong)' : 'var(--text-muted)',
        opacity: t.disabled ? 0.4 : 1,
        transition: 'color var(--dur-fast) var(--ease-out)'
      },
      onMouseEnter: e => {
        if (!on && !t.disabled) e.currentTarget.style.color = 'var(--text-default)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.color = 'var(--text-muted)';
      }
    }, t.icon, t.label, t.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        fontWeight: 600,
        color: on ? 'var(--brand-400)' : 'var(--text-faint)',
        background: on ? 'var(--brand-soft)' : 'var(--surface-3)',
        padding: '0 5px',
        borderRadius: 'var(--radius-sm)',
        minWidth: 16,
        textAlign: 'center'
      }
    }, t.count), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 8,
        right: 8,
        bottom: -1,
        height: 2,
        borderRadius: '2px 2px 0 0',
        background: on ? 'var(--brand-500)' : 'transparent',
        boxShadow: on ? '0 0 8px var(--brand-glow)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out)'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/status/LogRow.jsx
try { (() => {
const LEVELS = {
  info: {
    color: 'var(--info-500)',
    tag: 'INFO'
  },
  ok: {
    color: 'var(--success-500)',
    tag: ' OK '
  },
  warn: {
    color: 'var(--warning-500)',
    tag: 'WARN'
  },
  error: {
    color: 'var(--danger-500)',
    tag: 'ERR '
  },
  debug: {
    color: 'var(--text-faint)',
    tag: 'DBG '
  }
};

/**
 * Monospace log line for the scraping console.
 */
function LogRow({
  time,
  level = 'info',
  source,
  message,
  style
}) {
  const l = LEVELS[level] || LEVELS.info;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10,
      padding: '3px 12px',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      lineHeight: 1.7,
      borderRadius: 'var(--radius-xs)',
      ...style
    }
  }, time && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-faint)',
      flexShrink: 0,
      fontVariantNumeric: 'tabular-nums'
    }
  }, time), /*#__PURE__*/React.createElement("span", {
    style: {
      color: l.color,
      fontWeight: 600,
      flexShrink: 0,
      letterSpacing: '0.04em',
      whiteSpace: 'pre'
    }
  }, l.tag), source && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand-400)',
      flexShrink: 0
    }
  }, source), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-default)',
      minWidth: 0,
      wordBreak: 'break-word'
    }
  }, message));
}
Object.assign(__ds_scope, { LogRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/status/LogRow.jsx", error: String((e && e.message) || e) }); }

// components/status/StatusDot.jsx
try { (() => {
const STATES = {
  online: {
    color: 'var(--success-500)',
    label: 'En ligne',
    pulse: true
  },
  running: {
    color: 'var(--brand-500)',
    label: 'En cours',
    pulse: true
  },
  idle: {
    color: 'var(--text-faint)',
    label: 'Au repos',
    pulse: false
  },
  warning: {
    color: 'var(--warning-500)',
    label: 'Dégradé',
    pulse: true
  },
  error: {
    color: 'var(--danger-500)',
    label: 'Erreur',
    pulse: true
  },
  blocked: {
    color: 'var(--danger-500)',
    label: 'Bloqué',
    pulse: false
  }
};

/**
 * Status indicator dot with optional pulse + label.
 */
function StatusDot({
  status = 'idle',
  label,
  showLabel = true,
  size = 8,
  style
}) {
  const s = STATES[status] || STATES.idle;
  const text = label ?? s.label;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      background: s.color,
      boxShadow: `0 0 8px ${s.color}`
    }
  }), s.pulse && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      background: s.color,
      animation: 'pepite-ping 1.6s var(--ease-out) infinite'
    }
  })), showLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-default)',
      fontWeight: 500
    }
  }, text));
}
if (typeof document !== 'undefined' && !document.getElementById('pepite-ping')) {
  const st = document.createElement('style');
  st.id = 'pepite-ping';
  st.textContent = '@keyframes pepite-ping{0%{transform:scale(1);opacity:.6}80%,100%{transform:scale(2.6);opacity:0}}';
  document.head.appendChild(st);
}
Object.assign(__ds_scope, { StatusDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/status/StatusDot.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pepite-dashboard/AppShell.jsx
try { (() => {
/* AppShell — sidebar + topbar chrome for the Pépite dashboard. */
const DS = window.PPiteDesignSystem_0c887c || {};
const {
  Icon
} = window;
const NAV = [{
  id: 'dashboard',
  label: 'Dashboard',
  icon: 'dashboard'
}, {
  id: 'detail',
  label: 'Fiche détail',
  icon: 'building'
}, {
  id: 'config',
  label: 'Moteur de scoring',
  icon: 'sliders'
}, {
  id: 'monitoring',
  label: 'Monitoring',
  icon: 'activity'
}];
function NavItem({
  item,
  active,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      width: '100%',
      height: 38,
      padding: '0 11px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: active ? 600 : 500,
      color: active ? 'var(--text-strong)' : hover ? 'var(--text-default)' : 'var(--text-muted)',
      background: active ? 'var(--brand-soft)' : hover ? 'var(--surface-2)' : 'transparent',
      boxShadow: active ? 'inset 2px 0 0 var(--brand-500)' : 'none',
      transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: item.icon,
    size: 17,
    color: active ? 'var(--brand-400)' : 'currentColor'
  }), item.label);
}
function Sidebar({
  view,
  setView
}) {
  const {
    StatusDot
  } = DS;
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 'var(--sidebar-w)',
      flexShrink: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-1)',
      borderRight: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '16px 16px 14px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark.svg",
    alt: "",
    width: "30",
    height: "30",
    style: {
      borderRadius: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-lg)',
      color: 'var(--text-strong)',
      letterSpacing: '-0.01em'
    }
  }, "P\xE9pite"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'var(--text-faint)',
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.06em'
    }
  }, "VEILLE \xB7 IDF v3.2"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      padding: '4px 10px',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      padding: '8px 11px 6px'
    }
  }, "Navigation"), NAV.map(n => /*#__PURE__*/React.createElement(NavItem, {
    key: n.id,
    item: n,
    active: view === n.id,
    onClick: () => setView(n.id)
  })), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      padding: '18px 11px 6px'
    }
  }, "Recherches"), ['Belleville · T3 ≤ 620k', 'Oberkampf · T2 frais', 'IDF · DPE ≤ C'].map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      width: '100%',
      height: 32,
      padding: '0 11px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      textAlign: 'left'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--surface-2)';
      e.currentTarget.style.color = 'var(--text-default)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = 'var(--text-muted)';
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 2,
      background: ['var(--viz-1)', 'var(--viz-2)', 'var(--viz-4)'][i],
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, s)))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-subtle)',
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(StatusDot, {
    status: "running",
    label: "Scraper actif"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)'
    }
  }, "14:32")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: 'var(--surface-4)',
      border: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      fontWeight: 700,
      color: 'var(--brand-400)'
    }
  }, "DS"), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-default)',
      fontWeight: 600
    }
  }, "data-eng"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: 'var(--text-faint)',
      fontFamily: 'var(--font-mono)'
    }
  }, "admin \xB7 prod")))));
}
function Topbar({
  view,
  onRefresh
}) {
  const {
    Input,
    Select,
    IconButton,
    Badge
  } = DS;
  const titles = {
    dashboard: 'Dashboard · Île-de-France',
    detail: 'Fiche détail',
    config: 'Moteur de scoring',
    monitoring: 'Monitoring technique'
  };
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 'var(--topbar-h)',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '0 18px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-base)'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 'var(--text-md)',
      fontWeight: 600,
      color: 'var(--text-strong)',
      letterSpacing: '-0.01em',
      whiteSpace: 'nowrap'
    }
  }, titles[view]), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    placeholder: "Rechercher annonce, quartier, ID\u2026",
    prefix: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 15
    }),
    suffix: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        padding: '1px 5px',
        border: '1px solid var(--border-default)',
        borderRadius: 4,
        color: 'var(--text-faint)'
      }
    }, "\u2318K")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 150
    }
  }, /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    defaultValue: "24h"
  }, /*#__PURE__*/React.createElement("option", {
    value: "24h"
  }, "Derni\xE8res 24 h"), /*#__PURE__*/React.createElement("option", {
    value: "7j"
  }, "7 derniers jours"), /*#__PURE__*/React.createElement("option", {
    value: "30j"
  }, "30 derniers jours"))), /*#__PURE__*/React.createElement(IconButton, {
    size: "sm",
    variant: "solid",
    label: "Rafra\xEEchir",
    onClick: onRefresh
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    size: "sm",
    variant: "solid",
    label: "Alertes"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -3,
      right: -3,
      minWidth: 15,
      height: 15,
      padding: '0 3px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--gold-500)',
      color: 'var(--text-on-gold)',
      fontSize: 9,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      border: '2px solid var(--bg-base)'
    }
  }, "3")));
}
function AppShell({
  view,
  setView,
  onRefresh,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      background: 'var(--bg-base)'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    view: view,
    setView: setView
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: 0,
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(Topbar, {
    view: view,
    onRefresh: onRefresh
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minHeight: 0,
      overflow: 'auto'
    }
  }, children)));
}
window.AppShell = AppShell;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pepite-dashboard/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pepite-dashboard/ConfigView.jsx
try { (() => {
/* ConfigView (Vue 3) — moteur de scoring : poids en temps réel,
   filtres stricts, configuration des alertes. */
(() => {
  const DS = window.PPiteDesignSystem_0c887c || {};
  const {
    Icon,
    PEPITE_DATA,
    fmtEur
  } = window;
  const {
    CRITERIA,
    WEIGHTS,
    LISTINGS
  } = PEPITE_DATA;
  const PRESETS = {
    'Équilibré': WEIGHTS,
    'Investisseur': {
      prixM2: 42,
      transports: 20,
      freshness: 8,
      dpe: 8,
      etage: 6,
      nuisances: 16
    },
    'Premier achat': {
      prixM2: 24,
      transports: 30,
      freshness: 18,
      dpe: 16,
      etage: 8,
      nuisances: 4
    }
  };
  function ZoneChip({
    label,
    on,
    onToggle
  }) {
    return /*#__PURE__*/React.createElement("button", {
      onClick: onToggle,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 28,
        padding: '0 11px',
        borderRadius: 'var(--radius-pill)',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 500,
        background: on ? 'var(--brand-soft)' : 'var(--surface-3)',
        color: on ? 'var(--brand-400)' : 'var(--text-muted)',
        border: `1px solid ${on ? 'rgba(45,212,167,0.35)' : 'var(--border-default)'}`,
        transition: 'all var(--dur-fast) var(--ease-out)'
      }
    }, on && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 12
    }), label);
  }
  function ConfigView() {
    const {
      Panel,
      RangeSlider,
      Switch,
      Select,
      Button,
      Badge,
      ScoreGauge
    } = DS;
    const [weights, setWeights] = React.useState({
      ...WEIGHTS
    });
    const [zones, setZones] = React.useState({
      '75011': true,
      '75020': true,
      '75010': true,
      '75019': false,
      '92': false
    });
    const [priceMax, setPriceMax] = React.useState(650);
    const [surfMin, setSurfMin] = React.useState(35);
    const [alertEmail, setAlertEmail] = React.useState(true);
    const [threshold, setThreshold] = React.useState(78);
    const [dirty, setDirty] = React.useState(false);
    const totalW = Object.values(weights).reduce((a, b) => a + b, 0);
    const setW = (k, v) => {
      setWeights(w => ({
        ...w,
        [k]: v
      }));
      setDirty(true);
    };
    const applyPreset = name => {
      setWeights({
        ...PRESETS[name]
      });
      setDirty(true);
    };

    // live recompute
    const preview = LISTINGS.map(l => {
      const s = CRITERIA.reduce((acc, c) => acc + l.crit[c.key] * weights[c.key], 0) / totalW;
      return {
        ...l,
        preview: Math.round(s)
      };
    }).sort((a, b) => b.preview - a.preview).slice(0, 5);
    const matches = preview.filter(l => l.preview >= threshold).length;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 18,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 380px',
        gap: 14,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      title: "Pond\xE9ration du scoring",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "sliders",
        size: 16
      }),
      subtitle: "Ajustez les poids \u2014 l'aper\xE7u se recalcule en direct",
      actions: /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 6
        }
      }, Object.keys(PRESETS).map(p => /*#__PURE__*/React.createElement("button", {
        key: p,
        onClick: () => applyPreset(p),
        style: {
          height: 26,
          padding: '0 10px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-default)',
          background: 'var(--surface-3)',
          color: 'var(--text-muted)',
          fontSize: 'var(--text-2xs)',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font-sans)'
        },
        onMouseEnter: e => {
          e.currentTarget.style.color = 'var(--text-strong)';
          e.currentTarget.style.borderColor = 'var(--border-strong)';
        },
        onMouseLeave: e => {
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.borderColor = 'var(--border-default)';
        }
      }, p)))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, CRITERIA.map(c => /*#__PURE__*/React.createElement("div", {
      key: c.key,
      style: {
        display: 'grid',
        gridTemplateColumns: '22px 1fr',
        gap: 10,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 16,
      color: c.accent,
      style: {
        marginTop: 2
      }
    }), /*#__PURE__*/React.createElement(RangeSlider, {
      label: c.label,
      value: weights[c.key],
      min: 0,
      max: 50,
      accent: c.accent,
      valueSuffix: "",
      onChange: v => setW(c.key, v)
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 12,
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, "Somme des poids \xB7 normalis\xE9e \xE0 100%"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)',
        fontWeight: 700,
        color: 'var(--text-strong)'
      }
    }, totalW, " pts"))), /*#__PURE__*/React.createElement(Panel, {
      title: "Filtres stricts",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "filter",
        size: 16
      }),
      subtitle: "Exclusion ferme \u2014 appliqu\xE9s avant le scoring"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(RangeSlider, {
      label: "Prix maximum",
      value: priceMax,
      min: 150,
      max: 1200,
      step: 10,
      accent: "var(--gold-500)",
      valueSuffix: "k\u20AC",
      onChange: setPriceMax
    }), /*#__PURE__*/React.createElement(RangeSlider, {
      label: "Surface minimum",
      value: surfMin,
      min: 10,
      max: 120,
      accent: "var(--viz-2)",
      valueSuffix: " m\xB2",
      onChange: setSurfMin
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 9
      }
    }, "Zones g\xE9ographiques"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 7,
        flexWrap: 'wrap'
      }
    }, Object.keys(zones).map(z => /*#__PURE__*/React.createElement(ZoneChip, {
      key: z,
      label: z,
      on: zones[z],
      onToggle: () => {
        setZones(s => ({
          ...s,
          [z]: !s[z]
        }));
        setDirty(true);
      }
    })), /*#__PURE__*/React.createElement("button", {
      style: {
        height: 28,
        padding: '0 11px',
        borderRadius: 'var(--radius-pill)',
        border: '1px dashed var(--border-strong)',
        background: 'transparent',
        color: 'var(--text-faint)',
        fontSize: 'var(--text-xs)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 12
    }), "Zone"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14,
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 7
      }
    }, "DPE maximum"), /*#__PURE__*/React.createElement(Select, {
      size: "sm",
      defaultValue: "D"
    }, /*#__PURE__*/React.createElement("option", null, "B"), /*#__PURE__*/React.createElement("option", null, "C"), /*#__PURE__*/React.createElement("option", null, "D"), /*#__PURE__*/React.createElement("option", null, "E"), /*#__PURE__*/React.createElement("option", null, "Tous"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 7
      }
    }, "Type de bien"), /*#__PURE__*/React.createElement(Select, {
      size: "sm",
      defaultValue: "appt"
    }, /*#__PURE__*/React.createElement("option", {
      value: "appt"
    }, "Appartement"), /*#__PURE__*/React.createElement("option", {
      value: "maison"
    }, "Maison"), /*#__PURE__*/React.createElement("option", {
      value: "tous"
    }, "Tous")))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'sticky',
        top: 0
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      title: "Aper\xE7u temps r\xE9el",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "zap",
        size: 16
      }),
      subtitle: "Re-classement instantan\xE9 sur l'\xE9chantillon",
      actions: /*#__PURE__*/React.createElement(Badge, {
        tone: matches > 0 ? 'gold' : 'neutral',
        dot: matches > 0
      }, matches, " alertes")
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, preview.map((l, i) => {
      const diff = l.preview - l.score;
      return /*#__PURE__*/React.createElement("div", {
        key: l.id,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '8px 0',
          borderBottom: i < preview.length - 1 ? '1px solid var(--border-subtle)' : 'none'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-faint)',
          width: 16
        }
      }, i + 1), /*#__PURE__*/React.createElement(ScoreGauge, {
        value: l.preview,
        size: 40,
        thickness: 4
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          color: 'var(--text-default)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, l.title), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: 'var(--text-faint)',
          fontFamily: 'var(--font-mono)'
        }
      }, l.quartier, " \xB7 ", fmtEur(l.price), " \u20AC")), diff !== 0 && /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-2xs)',
          fontWeight: 700,
          color: diff > 0 ? 'var(--success-500)' : 'var(--danger-500)'
        }
      }, diff > 0 ? '+' : '', diff));
    }))), /*#__PURE__*/React.createElement(Panel, {
      title: "Alertes",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "bell",
        size: 16
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(RangeSlider, {
      label: "Seuil d'alerte (score min.)",
      value: threshold,
      min: 40,
      max: 95,
      accent: "var(--gold-500)",
      onChange: setThreshold
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 11,
        paddingTop: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-default)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "mail",
      size: 15,
      color: "var(--text-muted)"
    }), "Alerte e-mail"), /*#__PURE__*/React.createElement(Switch, {
      checked: alertEmail,
      onChange: setAlertEmail
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-default)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "zap",
      size: 15,
      color: "var(--text-muted)"
    }), "Notification instantan\xE9e"), /*#__PURE__*/React.createElement(Switch, {
      defaultChecked: false
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        paddingTop: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 7
      }
    }, "Fr\xE9quence du digest"), /*#__PURE__*/React.createElement(Select, {
      size: "sm",
      defaultValue: "instant"
    }, /*#__PURE__*/React.createElement("option", {
      value: "instant"
    }, "Instantan\xE9"), /*#__PURE__*/React.createElement("option", {
      value: "2h"
    }, "Toutes les 2 h"), /*#__PURE__*/React.createElement("option", {
      value: "day"
    }, "Quotidien \xB7 8h"))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "md",
      onClick: () => {
        setWeights({
          ...WEIGHTS
        });
        setDirty(false);
      }
    }, "R\xE9initialiser"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "md",
      fullWidth: true,
      disabled: !dirty,
      leftIcon: /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 15
      })
    }, "Enregistrer la config"))));
  }
  window.ConfigView = ConfigView;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pepite-dashboard/ConfigView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pepite-dashboard/DashboardView.jsx
try { (() => {
/* DashboardView (Vue 1) — KPIs + cartographie heatmap + flux de pépites. */
(() => {
  const DS = window.PPiteDesignSystem_0c887c || {};
  const {
    Icon,
    PEPITE_DATA,
    fmtEur,
    fmtAgo
  } = window;
  function scoreColor(v) {
    if (v >= 80) return 'var(--score-100)';
    if (v >= 65) return 'var(--score-75)';
    if (v >= 45) return 'var(--score-50)';
    if (v >= 25) return 'var(--score-25)';
    return 'var(--score-0)';
  }

  /* ---- CSS-drawn dark opportunity map ---- */
  function MapPanel({
    listings,
    selectedId,
    onSelect
  }) {
    const {
      IconButton,
      Badge
    } = DS;
    const heat = listings.map(l => {
      const c = l.score >= 80 ? '242,179,61' : l.score >= 60 ? '45,212,167' : '75,163,245';
      const a = (0.10 + l.score / 100 * 0.30).toFixed(2);
      return `radial-gradient(120px 120px at ${l.x}% ${l.y}%, rgba(${c},${a}), transparent 70%)`;
    }).join(',');
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: '100%',
        minHeight: 0,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--bg-sunken)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        opacity: 0.5
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(58,68,82,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(58,68,82,0.4) 1px, transparent 1px)',
        backgroundSize: '192px 192px'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '4%',
        top: '60%',
        width: 130,
        height: 90,
        borderRadius: 18,
        background: 'rgba(63,207,106,0.07)',
        border: '1px solid rgba(63,207,106,0.14)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: '6%',
        top: '8%',
        width: 100,
        height: 70,
        borderRadius: 16,
        background: 'rgba(63,207,106,0.07)',
        border: '1px solid rgba(63,207,106,0.14)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '-10%',
        bottom: '14%',
        width: '130%',
        height: 38,
        background: 'linear-gradient(180deg, rgba(75,163,245,0.16), rgba(75,163,245,0.06))',
        transform: 'rotate(-7deg)',
        borderTop: '1px solid rgba(75,163,245,0.3)',
        borderBottom: '1px solid rgba(75,163,245,0.2)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: heat,
        mixBlendMode: 'screen'
      }
    }), listings.map(l => {
      const sel = l.id === selectedId;
      const c = scoreColor(l.score);
      return /*#__PURE__*/React.createElement("button", {
        key: l.id,
        onClick: () => onSelect(l),
        title: `${l.title} · ${l.score}`,
        style: {
          position: 'absolute',
          left: `${l.x}%`,
          top: `${l.y}%`,
          transform: 'translate(-50%,-50%)',
          width: sel ? 40 : 32,
          height: sel ? 40 : 32,
          borderRadius: '50%',
          cursor: 'pointer',
          background: 'var(--surface-1)',
          border: `2px solid ${c}`,
          color: c,
          fontFamily: 'var(--font-mono)',
          fontSize: sel ? 13 : 12,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: sel ? 5 : l.score >= 80 ? 3 : 1,
          boxShadow: sel ? `0 0 0 4px ${c}33, 0 0 16px ${c}` : `0 0 10px ${c}66`,
          transition: 'all var(--dur-fast) var(--ease-out)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, l.score);
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 12,
        left: 12,
        display: 'flex',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "gold",
      dot: true
    }, listings.filter(l => l.score >= 80).length, " p\xE9pites"), /*#__PURE__*/React.createElement(Badge, {
      tone: "info"
    }, listings.length, " annonces")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 12,
        right: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      size: "sm",
      variant: "solid",
      label: "Zoom +"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 15
    })), /*#__PURE__*/React.createElement(IconButton, {
      size: "sm",
      variant: "solid",
      label: "Calques"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "layers",
      size: 15
    })), /*#__PURE__*/React.createElement(IconButton, {
      size: "sm",
      variant: "solid",
      label: "Plein \xE9cran"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "maximize",
      size: 15
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '7px 11px',
        background: 'rgba(10,13,19,0.82)',
        backdropFilter: 'blur(8px)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-default)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: 'var(--text-faint)',
        fontWeight: 600,
        letterSpacing: '0.06em'
      }
    }, "OPPORTUNIT\xC9"), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 110,
        height: 7,
        borderRadius: 'var(--radius-pill)',
        background: 'var(--heat-gradient)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)'
      }
    }, "faible\u2192forte")));
  }

  /* ---- one row in the pépites feed ---- */
  function PepiteRow({
    l,
    selected,
    onSelect
  }) {
    const {
      ScoreGauge,
      Badge,
      Delta
    } = DS;
    const deltaPct = Math.round((l.ppm2 - l.marketPpm2) / l.marketPpm2 * 1000) / 10;
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => onSelect(l),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        textAlign: 'left',
        padding: '11px 13px',
        border: 'none',
        borderBottom: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        background: selected ? 'var(--surface-2)' : 'transparent',
        boxShadow: selected ? 'inset 2px 0 0 var(--brand-500)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out)'
      },
      onMouseEnter: e => {
        if (!selected) e.currentTarget.style.background = 'var(--surface-2)';
      },
      onMouseLeave: e => {
        if (!selected) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement(ScoreGauge, {
      value: l.score,
      size: 46,
      thickness: 5,
      showValue: true
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        marginBottom: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        color: 'var(--text-strong)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, l.title), l.score >= 80 && /*#__PURE__*/React.createElement(Badge, {
      tone: "gold",
      dot: true
    }, "P\xE9pite")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 12
    }), l.quartier), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "train",
      size: 12
    }), l.metro[0].min, " min"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-faint)'
      }
    }, "\xB7 ", fmtAgo(l.freshMin)))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'var(--text-md)',
        color: 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, fmtEur(l.price), " \u20AC"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        justifyContent: 'flex-end',
        marginTop: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-faint)',
        fontFamily: 'var(--font-mono)'
      }
    }, fmtEur(l.ppm2), " \u20AC/m\xB2"), /*#__PURE__*/React.createElement(Delta, {
      value: deltaPct,
      invert: true,
      size: "sm"
    }))));
  }
  function DashboardView({
    onOpen
  }) {
    const {
      StatCard,
      Panel,
      Tabs,
      Badge
    } = DS;
    const listings = PEPITE_DATA.LISTINGS;
    const [sel, setSel] = React.useState(listings[0]);
    const ranked = [...listings].sort((a, b) => b.score - a.score);
    const select = l => setSel(l);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        minHeight: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "P\xE9pites \xB7 24h",
      value: "14",
      delta: "+6",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "zap",
        size: 16
      }),
      accent: "var(--gold-400)"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Annonces scann\xE9es",
      value: "2 481",
      delta: "+312",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "layers",
        size: 16
      })
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Prix m\xE9dian /m\xB2",
      value: "10 240",
      unit: "\u20AC",
      delta: "-2,1%",
      deltaTone: "muted",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "euro",
        size: 16
      })
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Score moyen",
      value: "67",
      unit: "/100",
      delta: "+4",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "gauge",
        size: 16
      })
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1.55fr) minmax(340px,1fr)',
        gap: 14,
        flex: 1,
        minHeight: 520
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      title: "Cartographie des opportunit\xE9s",
      subtitle: "Paris \xB7 \xCEle-de-France \u2014 heatmap pond\xE9r\xE9e par le score",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "map",
        size: 16
      }),
      noPadding: true,
      actions: /*#__PURE__*/React.createElement(Badge, {
        tone: "neutral"
      }, "DVF + IGN"),
      style: {
        minHeight: 0
      },
      bodyStyle: {
        padding: 10
      }
    }, /*#__PURE__*/React.createElement(MapPanel, {
      listings: listings,
      selectedId: sel.id,
      onSelect: select
    })), /*#__PURE__*/React.createElement(Panel, {
      title: "Flux de p\xE9pites",
      subtitle: "Tri\xE9 par score \xB7 temps r\xE9el",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "activity",
        size: 16
      }),
      noPadding: true,
      style: {
        minHeight: 0
      },
      actions: /*#__PURE__*/React.createElement(Tabs, {
        size: "sm",
        tabs: [{
          id: 'score',
          label: 'Score'
        }, {
          id: 'frais',
          label: 'Frais'
        }, {
          id: 'fav',
          label: 'Favoris',
          count: listings.filter(l => l.fav).length
        }]
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        overflow: 'auto',
        maxHeight: 520
      }
    }, ranked.map(l => /*#__PURE__*/React.createElement(PepiteRow, {
      key: l.id,
      l: l,
      selected: l.id === sel.id,
      onSelect: select
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onOpen(sel),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 34,
        padding: '0 14px',
        background: 'var(--brand-500)',
        color: 'var(--text-on-brand)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(45,212,167,0.25)'
      }
    }, "Ouvrir la fiche \xB7 ", sel.id, " ", /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-up-right",
      size: 15
    }))));
  }
  window.DashboardView = DashboardView;
  window.pepiteScoreColor = scoreColor;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pepite-dashboard/DashboardView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pepite-dashboard/DetailView.jsx
try { (() => {
/* DetailView (Vue 2) — fiche détail "deep dive": justification du score,
   photos / street view, transports, comparaison marché. */
(() => {
  const DS = window.PPiteDesignSystem_0c887c || {};
  const {
    Icon,
    PEPITE_DATA,
    fmtEur,
    fmtAgo
  } = window;
  const {
    CRITERIA,
    WEIGHTS
  } = PEPITE_DATA;
  function Fact({
    icon,
    label,
    value
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '10px 12px',
        background: 'var(--surface-2)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-faint)',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 12
    }), label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-md)',
        fontWeight: 600,
        color: 'var(--text-strong)'
      }
    }, value));
  }
  function PhotoBlock({
    idx,
    total,
    big
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: `linear-gradient(135deg, var(--surface-3), var(--surface-2))`,
        border: '1px solid var(--border-subtle)',
        aspectRatio: big ? '16/10' : '1/1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "image",
      size: big ? 28 : 18,
      color: "var(--text-disabled)"
    }), big && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: 8,
        right: 9,
        fontSize: 10,
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-faint)',
        background: 'rgba(6,8,12,0.7)',
        padding: '2px 6px',
        borderRadius: 4
      }
    }, idx, "/", total));
  }
  function Contribution({
    c,
    weight,
    value,
    totalW
  }) {
    const wn = Math.round(weight / totalW * 100);
    const pts = Math.round(value / 100 * (weight / totalW) * 100);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '128px 1fr 52px',
        alignItems: 'center',
        gap: 12,
        padding: '7px 0'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 'var(--text-xs)',
        color: 'var(--text-default)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 13,
      color: c.accent
    }), c.short), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 6,
        borderRadius: 'var(--radius-pill)',
        background: 'var(--surface-4)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${value}%`,
        height: '100%',
        background: c.accent,
        borderRadius: 'var(--radius-pill)',
        boxShadow: `0 0 8px ${c.accent}55`
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-faint)',
        minWidth: 56
      }
    }, "\xD7", wn, "% poids")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)',
        fontWeight: 700,
        color: 'var(--text-strong)',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums'
      }
    }, "+", pts));
  }
  function DetailView({
    listing,
    onBack
  }) {
    const {
      Panel,
      ScoreGauge,
      ScoreRadar,
      Badge,
      Delta,
      Button,
      IconButton,
      Card
    } = DS;
    const l = listing || PEPITE_DATA.LISTINGS[0];
    const totalW = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
    const deltaPct = Math.round((l.ppm2 - l.marketPpm2) / l.marketPpm2 * 1000) / 10;
    const axes = CRITERIA.map(c => ({
      short: c.short,
      label: c.label,
      value: l.crit[c.key]
    }));
    const marketDelta = l.marketPpm2 - l.ppm2;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      variant: "solid",
      label: "Retour",
      onClick: onBack
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-left",
      size: 17
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        color: 'var(--text-strong)',
        letterSpacing: '-0.01em'
      }
    }, l.title), l.score >= 80 && /*#__PURE__*/React.createElement(Badge, {
      tone: "gold",
      dot: true
    }, "P\xE9pite"), /*#__PURE__*/React.createElement(Badge, {
      tone: "info"
    }, l.source), /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)'
      }
    }, l.id))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 14
    }), l.addr, " \xB7 ", l.quartier, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-faint)'
      }
    }, "\xB7 d\xE9tect\xE9e il y a ", fmtAgo(l.freshMin)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "md",
      leftIcon: /*#__PURE__*/React.createElement(Icon, {
        name: "eye",
        size: 15
      })
    }, "Voir l'annonce"), /*#__PURE__*/React.createElement(Button, {
      variant: "gold",
      size: "md",
      leftIcon: /*#__PURE__*/React.createElement(Icon, {
        name: "star",
        size: 15
      })
    }, "Suivre"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 420px',
        gap: 14,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      noPadding: true,
      style: {
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: 2,
        background: 'var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface-1)',
        padding: 2
      }
    }, /*#__PURE__*/React.createElement(PhotoBlock, {
      idx: 1,
      total: l.photos,
      big: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        background: 'var(--bg-sunken)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(var(--border-subtle) 1px,transparent 1px),linear-gradient(90deg,var(--border-subtle) 1px,transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: 0.4
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        color: 'var(--text-faint)',
        zIndex: 1
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "route",
      size: 26,
      color: "var(--brand-400)",
      style: {
        margin: '0 auto 6px'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 600,
        letterSpacing: '0.04em'
      }
    }, "STREET VIEW"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontFamily: 'var(--font-mono)'
      }
    }, l.addr)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6,1fr)',
        gap: 6,
        padding: 10
      }
    }, Array.from({
      length: 6
    }).map((_, i) => /*#__PURE__*/React.createElement(PhotoBlock, {
      key: i,
      idx: i + 2,
      total: l.photos
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Fact, {
      icon: "ruler",
      label: "Surface",
      value: `${l.surface} m²`
    }), /*#__PURE__*/React.createElement(Fact, {
      icon: "building",
      label: "Pi\xE8ces",
      value: `${l.rooms}`
    }), /*#__PURE__*/React.createElement(Fact, {
      icon: "layers",
      label: "\xC9tage",
      value: `${l.floor}/${l.floors}`
    }), /*#__PURE__*/React.createElement(Fact, {
      icon: "leaf",
      label: "DPE",
      value: l.dpe
    })), /*#__PURE__*/React.createElement(Panel, {
      title: "Transports & accessibilit\xE9",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "train",
        size: 16
      }),
      subtitle: "Temps de marche r\xE9els \xB7 isochrone 15 min"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 150px',
        gap: 16,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, l.metro.map((m, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 34,
        height: 22,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--surface-4)',
        border: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--brand-400)',
        flexShrink: 0
      }
    }, m.line), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-default)'
      }
    }, m.name), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 12
    }), m.min, " min")))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: 120,
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-sunken)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)'
      }
    }, [58, 40, 22].map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        width: s,
        height: s,
        borderRadius: '50%',
        border: `1.5px solid ${['rgba(75,163,245,0.4)', 'rgba(45,212,167,0.5)', 'rgba(242,179,61,0.7)'][i]}`,
        background: ['transparent', 'rgba(45,212,167,0.05)', 'rgba(242,179,61,0.12)'][i]
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: 'var(--gold-400)',
        boxShadow: '0 0 8px var(--gold-glow)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: 5,
        left: 6,
        fontSize: 9,
        color: 'var(--text-faint)',
        fontFamily: 'var(--font-mono)'
      }
    }, "5 \xB7 10 \xB7 15 min"))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Card, {
      glow: l.score >= 80,
      padding: "lg"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(ScoreGauge, {
      value: l.score,
      size: 92,
      label: l.score >= 80 ? 'Pépite' : l.score >= 60 ? 'Bon plan' : 'Moyen'
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 6
      }
    }, "Prix de vente"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-3xl)',
        fontWeight: 700,
        color: 'var(--text-strong)',
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums'
      }
    }, fmtEur(l.price), " \u20AC"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-default)'
      }
    }, fmtEur(l.ppm2), " \u20AC/m\xB2"), /*#__PURE__*/React.createElement(Delta, {
      value: deltaPct,
      invert: true
    }))))), /*#__PURE__*/React.createElement(Panel, {
      title: "Comparaison au march\xE9",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "trending-down",
        size: 16
      }),
      subtitle: `Médiane quartier ${l.quartier} (DVF)`
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, [{
      k: 'Cette annonce',
      v: l.ppm2,
      c: 'var(--brand-500)'
    }, {
      k: `Médiane ${l.quartier}`,
      v: l.marketPpm2,
      c: 'var(--text-faint)'
    }].map((row, i) => {
      const maxv = Math.max(l.ppm2, l.marketPpm2);
      return /*#__PURE__*/React.createElement("div", {
        key: i
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 4
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)'
        }
      }, row.k), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          color: 'var(--text-default)'
        }
      }, fmtEur(row.v), " \u20AC/m\xB2")), /*#__PURE__*/React.createElement("div", {
        style: {
          height: 9,
          borderRadius: 'var(--radius-pill)',
          background: 'var(--surface-4)',
          overflow: 'hidden'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: `${row.v / maxv * 100}%`,
          height: '100%',
          background: row.c,
          borderRadius: 'var(--radius-pill)'
        }
      })));
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        marginTop: 2,
        padding: '8px 10px',
        background: marketDelta > 0 ? 'var(--success-soft)' : 'var(--danger-soft)',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: marketDelta > 0 ? 'trending-down' : 'trending-up',
      size: 15,
      color: marketDelta > 0 ? 'var(--success-500)' : 'var(--danger-500)'
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-default)'
      }
    }, marketDelta > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--success-500)'
      }
    }, fmtEur(Math.abs(marketDelta * l.surface)), " \u20AC"), " sous le march\xE9 estim\xE9") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--danger-500)'
      }
    }, fmtEur(Math.abs(marketDelta * l.surface)), " \u20AC"), " au-dessus du march\xE9"))))), /*#__PURE__*/React.createElement(Panel, {
      title: "Justification du score",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "gauge",
        size: 16
      }),
      subtitle: "score = \u03A3 ( crit\xE8re \xD7 poids normalis\xE9 )"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement(ScoreRadar, {
      size: 210,
      axes: axes,
      color: l.score >= 80 ? 'var(--gold-500)' : 'var(--brand-500)'
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: 6
      }
    }, CRITERIA.map(c => /*#__PURE__*/React.createElement(Contribution, {
      key: c.key,
      c: c,
      weight: WEIGHTS[c.key],
      value: l.crit[c.key],
      totalW: totalW
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid var(--border-default)',
        marginTop: 6,
        paddingTop: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        color: 'var(--text-default)'
      }
    }, "Score pond\xE9r\xE9 total"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-2xl)',
        fontWeight: 700,
        color: window.pepiteScoreColor(l.score),
        fontVariantNumeric: 'tabular-nums'
      }
    }, l.score, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-faint)'
      }
    }, " / 100"))))))));
  }
  window.DetailView = DetailView;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pepite-dashboard/DetailView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pepite-dashboard/MonitoringView.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* MonitoringView (Vue 4) — santé du scraper : sources, proxies, débit, logs. */
(() => {
  const DS = window.PPiteDesignSystem_0c887c || {};
  const {
    Icon,
    PEPITE_DATA
  } = window;
  const {
    SOURCES,
    LOGS
  } = PEPITE_DATA;
  function MiniBars({
    data,
    color = 'var(--brand-500)',
    height = 34
  }) {
    const max = Math.max(...data);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 2,
        height
      }
    }, data.map((v, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        height: `${Math.max(6, v / max * 100)}%`,
        background: color,
        opacity: 0.35 + v / max * 0.65,
        borderRadius: '2px 2px 0 0'
      }
    })));
  }
  const THROUGHPUT = [38, 42, 31, 55, 61, 48, 72, 80, 66, 90, 84, 102, 95, 78, 88, 110, 124, 98, 86, 70, 64, 58, 49, 53];
  function SourceRow({
    s
  }) {
    const {
      StatusDot,
      Badge
    } = DS;
    const rate = s.scanned > 0 ? Math.round((1 - s.blocked / (s.scanned + s.blocked)) * 100) : 0;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '150px 80px 70px 90px 80px 1fr',
        alignItems: 'center',
        gap: 12,
        padding: '11px 14px',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-xs)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9
      }
    }, /*#__PURE__*/React.createElement(StatusDot, {
      status: s.status,
      showLabel: false
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        color: 'var(--text-strong)',
        fontSize: 'var(--text-sm)'
      }
    }, s.name)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-default)'
      }
    }, s.scanned.toLocaleString('fr-FR')), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        color: s.found > 0 ? 'var(--gold-400)' : 'var(--text-faint)',
        fontWeight: 600
      }
    }, s.found), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        color: s.blocked > 20 ? 'var(--danger-500)' : 'var(--text-muted)'
      }
    }, s.blocked, " bloq."), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        color: s.latency > 1000 ? 'var(--warning-500)' : 'var(--text-muted)'
      }
    }, s.latency || '—', "ms"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 5,
        borderRadius: 'var(--radius-pill)',
        background: 'var(--surface-4)',
        overflow: 'hidden',
        maxWidth: 110
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${rate}%`,
        height: '100%',
        background: rate > 80 ? 'var(--success-500)' : rate > 50 ? 'var(--warning-500)' : 'var(--danger-500)',
        borderRadius: 'var(--radius-pill)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-faint)',
        width: 32
      }
    }, rate, "%"), /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 10
      }
    }, s.proxy))));
  }
  function MonitoringView() {
    const {
      Panel,
      StatCard,
      LogRow,
      StatusDot,
      Badge,
      IconButton,
      Button,
      Switch,
      Tabs
    } = DS;
    const [paused, setPaused] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5,1fr)',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Uptime \xB7 30j",
      value: "99,4",
      unit: "%",
      delta: "+0,2%",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "shield",
        size: 16
      })
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Requ\xEAtes / min",
      value: "124",
      delta: "+18",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "activity",
        size: 16
      }),
      spark: /*#__PURE__*/React.createElement(MiniBars, {
        data: THROUGHPUT.slice(-10),
        height: 26
      })
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Taux de succ\xE8s",
      value: "91,2",
      unit: "%",
      delta: "-1,4%",
      deltaTone: "warning",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 16
      })
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Requ\xEAtes bloqu\xE9es",
      value: "158",
      delta: "+62",
      deltaTone: "danger",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "alert",
        size: 16
      }),
      accent: "var(--danger-500)"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Proxies sains",
      value: "42",
      unit: "/ 48",
      delta: "-3",
      deltaTone: "muted",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "server",
        size: 16
      })
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 360px',
        gap: 14,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      title: "Sources de scraping",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "layers",
        size: 16
      }),
      noPadding: true,
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        size: "sm",
        leftIcon: /*#__PURE__*/React.createElement(Icon, {
          name: "refresh",
          size: 14
        })
      }, "Relancer")
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '150px 80px 70px 90px 80px 1fr',
        gap: 12,
        padding: '9px 14px',
        borderBottom: '1px solid var(--border-default)'
      }
    }, ['Source', 'Scannées', 'Pépites', 'Bloquées', 'Latence', 'Taux · proxy'].map(h => /*#__PURE__*/React.createElement("span", {
      key: h,
      className: "eyebrow",
      style: {
        fontSize: 10
      }
    }, h))), SOURCES.map(s => /*#__PURE__*/React.createElement(SourceRow, {
      key: s.name,
      s: s
    }))), /*#__PURE__*/React.createElement(Panel, {
      title: "D\xE9bit de scraping",
      subtitle: "Requ\xEAtes / minute \xB7 24 derni\xE8res heures",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "trending-up",
        size: 16
      }),
      actions: /*#__PURE__*/React.createElement(Tabs, {
        size: "sm",
        tabs: [{
          id: '24h',
          label: '24h'
        }, {
          id: '7j',
          label: '7j'
        }]
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 120,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 3
      }
    }, THROUGHPUT.map((v, i) => {
      const max = Math.max(...THROUGHPUT);
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          height: '100%'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: `${v / max * 100}%`,
          background: i === THROUGHPUT.length - 7 ? 'var(--gold-500)' : 'var(--brand-500)',
          opacity: 0.45 + v / max * 0.55,
          borderRadius: '3px 3px 0 0'
        },
        title: `${v} req/min`
      }));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 8,
        fontSize: 10,
        color: 'var(--text-faint)',
        fontFamily: 'var(--font-mono)'
      }
    }, /*#__PURE__*/React.createElement("span", null, "00:00"), /*#__PURE__*/React.createElement("span", null, "06:00"), /*#__PURE__*/React.createElement("span", null, "12:00"), /*#__PURE__*/React.createElement("span", null, "18:00"), /*#__PURE__*/React.createElement("span", null, "now")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      title: "Pool de proxies",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "wifi",
        size: 16
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, [{
      k: 'FR · Residential',
      v: 18,
      t: 20,
      c: 'var(--success-500)'
    }, {
      k: 'FR · Mobile',
      v: 14,
      t: 16,
      c: 'var(--success-500)'
    }, {
      k: 'FR · Datacenter',
      v: 10,
      t: 12,
      c: 'var(--warning-500)'
    }].map((p, i) => /*#__PURE__*/React.createElement("div", {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-default)'
      }
    }, p.k), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, p.v, "/", p.t)), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 6,
        borderRadius: 'var(--radius-pill)',
        background: 'var(--surface-4)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${p.v / p.t * 100}%`,
        height: '100%',
        background: p.c,
        borderRadius: 'var(--radius-pill)'
      }
    })))))), /*#__PURE__*/React.createElement(Panel, {
      title: "Sant\xE9 syst\xE8me",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "server",
        size: 16
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, [['Queue Redis', 'online', '1 240 jobs'], ['Worker pool', 'online', '8 / 8 actifs'], ['Géocodeur IGN', 'online', '84% cache'], ['Solver captcha', 'warning', 'file 2.1s'], ['SMTP alertes', 'online', '3 envoyés']].map((r, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement(StatusDot, {
      status: r[1],
      label: r[0]
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-faint)'
      }
    }, r[2]))))))), /*#__PURE__*/React.createElement(Panel, {
      title: "Console de logs",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "list",
        size: 16
      }),
      subtitle: "Flux en direct \xB7 agr\xE9g\xE9 toutes sources",
      noPadding: true,
      actions: /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }
      }, /*#__PURE__*/React.createElement(StatusDot, {
        status: paused ? 'idle' : 'running',
        label: paused ? 'En pause' : 'Live'
      }), /*#__PURE__*/React.createElement(IconButton, {
        size: "sm",
        variant: "solid",
        label: paused ? 'Reprendre' : 'Pause',
        onClick: () => setPaused(p => !p)
      }, /*#__PURE__*/React.createElement(Icon, {
        name: paused ? 'play' : 'pause',
        size: 14
      })), /*#__PURE__*/React.createElement(IconButton, {
        size: "sm",
        variant: "solid",
        label: "Exporter"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "download",
        size: 14
      })))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--bg-sunken)',
        maxHeight: 240,
        overflow: 'auto',
        padding: '8px 4px'
      }
    }, LOGS.map((g, i) => /*#__PURE__*/React.createElement(LogRow, _extends({
      key: i
    }, g))))));
  }
  window.MonitoringView = MonitoringView;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pepite-dashboard/MonitoringView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pepite-dashboard/data.js
try { (() => {
/* Pépite — mock veille data. Listings ("pépites"), scoring breakdown,
   scraper sources, and a log stream. All fictional, for the UI kit. */

const CRITERIA = [{
  key: 'prixM2',
  label: 'Prix / m² vs quartier',
  short: 'Prix/m²',
  icon: 'euro',
  accent: 'var(--viz-1)'
}, {
  key: 'transports',
  label: 'Proximité transports',
  short: 'Transports',
  icon: 'train',
  accent: 'var(--viz-2)'
}, {
  key: 'freshness',
  label: 'Fraîcheur annonce',
  short: 'Fraîcheur',
  icon: 'clock',
  accent: 'var(--viz-6)'
}, {
  key: 'dpe',
  label: 'Potentiel DPE',
  short: 'DPE',
  icon: 'leaf',
  accent: 'var(--viz-8)'
}, {
  key: 'etage',
  label: 'Étage / luminosité',
  short: 'Étage',
  icon: 'building',
  accent: 'var(--viz-3)'
}, {
  key: 'nuisances',
  label: 'Absence nuisances',
  short: 'Calme',
  icon: 'volume',
  accent: 'var(--viz-5)'
}];

// Default engine weights (sum normalized in UI)
const WEIGHTS = {
  prixM2: 32,
  transports: 24,
  freshness: 14,
  dpe: 12,
  etage: 9,
  nuisances: 9
};
const LISTINGS = [{
  id: 'PP-4821',
  score: 92,
  title: 'T3 traversant · 68 m²',
  addr: 'Rue de la Mare, 75020',
  quartier: 'Belleville',
  price: 612000,
  surface: 68,
  rooms: 3,
  floor: 4,
  floors: 6,
  ppm2: 9000,
  marketPpm2: 10850,
  dpe: 'C',
  source: 'SeLoger',
  freshMin: 38,
  photos: 14,
  metro: [{
    line: 'M11',
    name: 'Pyrénées',
    min: 4
  }, {
    line: 'M2',
    name: 'Couronnes',
    min: 7
  }],
  crit: {
    prixM2: 95,
    transports: 88,
    freshness: 90,
    dpe: 72,
    etage: 80,
    nuisances: 70
  },
  x: 78,
  y: 30,
  tags: ['Pépite', 'Sous le marché'],
  fav: true
}, {
  id: 'PP-4806',
  score: 84,
  title: 'T2 rénové · 44 m²',
  addr: 'Rue Oberkampf, 75011',
  quartier: 'Oberkampf',
  price: 489000,
  surface: 44,
  rooms: 2,
  floor: 3,
  floors: 5,
  ppm2: 11114,
  marketPpm2: 12400,
  dpe: 'B',
  source: 'Leboncoin',
  freshMin: 12,
  photos: 9,
  metro: [{
    line: 'M9',
    name: 'Saint-Ambroise',
    min: 3
  }, {
    line: 'M3',
    name: 'Rue Saint-Maur',
    min: 6
  }],
  crit: {
    prixM2: 80,
    transports: 92,
    freshness: 96,
    dpe: 88,
    etage: 70,
    nuisances: 60
  },
  x: 64,
  y: 47,
  tags: ['Pépite', 'Fraîche'],
  fav: false
}, {
  id: 'PP-4790',
  score: 76,
  title: 'Studio · 27 m²',
  addr: 'Rue du Faubourg du Temple, 75010',
  quartier: 'Canal St-Martin',
  price: 298000,
  surface: 27,
  rooms: 1,
  floor: 5,
  floors: 7,
  ppm2: 11037,
  marketPpm2: 11600,
  dpe: 'D',
  source: 'PAP',
  freshMin: 95,
  photos: 6,
  metro: [{
    line: 'M5',
    name: 'Jacques Bonsergent',
    min: 5
  }, {
    line: 'M11',
    name: 'Goncourt',
    min: 8
  }],
  crit: {
    prixM2: 68,
    transports: 84,
    freshness: 64,
    dpe: 55,
    etage: 90,
    nuisances: 72
  },
  x: 52,
  y: 38,
  tags: ['Bon plan'],
  fav: false
}, {
  id: 'PP-4775',
  score: 71,
  title: 'T4 familial · 86 m²',
  addr: 'Avenue Gambetta, 75020',
  quartier: 'Gambetta',
  price: 742000,
  surface: 86,
  rooms: 4,
  floor: 2,
  floors: 8,
  ppm2: 8628,
  marketPpm2: 9100,
  dpe: 'C',
  source: 'SeLoger',
  freshMin: 142,
  photos: 18,
  metro: [{
    line: 'M3',
    name: 'Gambetta',
    min: 3
  }, {
    line: 'M3bis',
    name: 'Pelleport',
    min: 9
  }],
  crit: {
    prixM2: 64,
    transports: 78,
    freshness: 52,
    dpe: 70,
    etage: 58,
    nuisances: 80
  },
  x: 86,
  y: 42,
  tags: ['Bon plan'],
  fav: false
}, {
  id: 'PP-4761',
  score: 58,
  title: 'T2 · 41 m²',
  addr: 'Rue de Charonne, 75011',
  quartier: 'Charonne',
  price: 465000,
  surface: 41,
  rooms: 2,
  floor: 1,
  floors: 4,
  ppm2: 11341,
  marketPpm2: 11500,
  dpe: 'E',
  source: 'Leboncoin',
  freshMin: 210,
  photos: 7,
  metro: [{
    line: 'M9',
    name: 'Charonne',
    min: 4
  }, {
    line: 'M2',
    name: 'Alexandre Dumas',
    min: 8
  }],
  crit: {
    prixM2: 52,
    transports: 74,
    freshness: 40,
    dpe: 32,
    etage: 44,
    nuisances: 66
  },
  x: 70,
  y: 58,
  tags: [],
  fav: false
}, {
  id: 'PP-4744',
  score: 47,
  title: 'T3 · 61 m²',
  addr: 'Boulevard de Ménilmontant, 75011',
  quartier: 'Ménilmontant',
  price: 598000,
  surface: 61,
  rooms: 3,
  floor: 0,
  floors: 6,
  ppm2: 9803,
  marketPpm2: 9600,
  dpe: 'F',
  source: 'SeLoger',
  freshMin: 320,
  photos: 11,
  metro: [{
    line: 'M2',
    name: 'Ménilmontant',
    min: 2
  }],
  crit: {
    prixM2: 44,
    transports: 70,
    freshness: 28,
    dpe: 18,
    etage: 30,
    nuisances: 40
  },
  x: 74,
  y: 36,
  tags: ['Surcoté'],
  fav: false
}, {
  id: 'PP-4720',
  score: 38,
  title: 'Studio · 22 m²',
  addr: 'Rue de Belleville, 75019',
  quartier: 'Belleville',
  price: 279000,
  surface: 22,
  rooms: 1,
  floor: 6,
  floors: 6,
  ppm2: 12681,
  marketPpm2: 11200,
  dpe: 'D',
  source: 'PAP',
  freshMin: 480,
  photos: 4,
  metro: [{
    line: 'M11',
    name: 'Pyrénées',
    min: 6
  }],
  crit: {
    prixM2: 24,
    transports: 76,
    freshness: 14,
    dpe: 50,
    etage: 88,
    nuisances: 36
  },
  x: 80,
  y: 22,
  tags: ['Surcoté'],
  fav: false
}, {
  id: 'PP-4698',
  score: 81,
  title: 'T2 atypique · 39 m²',
  addr: 'Rue Saint-Maur, 75011',
  quartier: 'Saint-Maur',
  price: 442000,
  surface: 39,
  rooms: 2,
  floor: 4,
  floors: 5,
  ppm2: 11333,
  marketPpm2: 12600,
  dpe: 'B',
  source: 'Leboncoin',
  freshMin: 26,
  photos: 12,
  metro: [{
    line: 'M3',
    name: 'Rue Saint-Maur',
    min: 2
  }, {
    line: 'M9',
    name: 'Voltaire',
    min: 7
  }],
  crit: {
    prixM2: 78,
    transports: 90,
    freshness: 94,
    dpe: 86,
    etage: 76,
    nuisances: 64
  },
  x: 60,
  y: 52,
  tags: ['Pépite', 'Fraîche'],
  fav: true
}];
const SOURCES = [{
  name: 'SeLoger',
  status: 'online',
  scanned: 982,
  found: 6,
  blocked: 3,
  latency: 412,
  proxy: 'FR-residential'
}, {
  name: 'Leboncoin',
  status: 'running',
  scanned: 1144,
  found: 5,
  blocked: 41,
  latency: 880,
  proxy: 'FR-mobile'
}, {
  name: 'PAP',
  status: 'online',
  scanned: 218,
  found: 3,
  blocked: 0,
  latency: 305,
  proxy: 'FR-datacenter'
}, {
  name: 'Bien\u2019ici',
  status: 'warning',
  scanned: 137,
  found: 1,
  blocked: 18,
  latency: 1640,
  proxy: 'FR-residential'
}, {
  name: 'Logic-Immo',
  status: 'blocked',
  scanned: 0,
  found: 0,
  blocked: 96,
  latency: 0,
  proxy: 'FR-datacenter'
}];
const LOGS = [{
  time: '14:32:08',
  level: 'ok',
  source: 'seloger',
  message: 'Annonce PP-4821 scorée 92 → match alerte « Belleville T3 »'
}, {
  time: '14:32:05',
  level: 'info',
  source: 'leboncoin',
  message: 'Pagination 4/12 · 38 annonces parsées · file=412'
}, {
  time: '14:31:58',
  level: 'warn',
  source: 'bienici',
  message: 'Latence proxy 1640ms — rotation FR-residential[7]'
}, {
  time: '14:31:44',
  level: 'ok',
  source: 'pap',
  message: 'Géocodage 75010 résolu (cache hit 84%)'
}, {
  time: '14:31:31',
  level: 'error',
  source: 'logic-immo',
  message: 'HTTP 403 · challenge Datadome détecté · backoff 240s'
}, {
  time: '14:31:12',
  level: 'info',
  source: 'engine',
  message: 'Recalcul scores · 2481 annonces · poids v3 appliqués'
}, {
  time: '14:30:55',
  level: 'ok',
  source: 'leboncoin',
  message: 'Annonce PP-4806 scorée 84 → alerte mail envoyée (1 dest.)'
}, {
  time: '14:30:40',
  level: 'debug',
  source: 'engine',
  message: 'prix_m2_quartier[75011]=12400 maj depuis DVF'
}, {
  time: '14:30:22',
  level: 'warn',
  source: 'seloger',
  message: 'Captcha image · résolu via solver (2.1s)'
}, {
  time: '14:30:03',
  level: 'ok',
  source: 'pap',
  message: 'Cycle scrape terminé · 218 annonces · 3 nouvelles'
}];
window.PEPITE_DATA = {
  CRITERIA,
  WEIGHTS,
  LISTINGS,
  SOURCES,
  LOGS
};
window.fmtEur = n => n.toLocaleString('fr-FR');
window.fmtAgo = m => m < 60 ? `${m} min` : m < 1440 ? `${Math.round(m / 60)} h` : `${Math.round(m / 1440)} j`;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pepite-dashboard/data.js", error: String((e && e.message) || e) }); }

// ui_kits/pepite-dashboard/icons.jsx
try { (() => {
/* Pépite icon set — Lucide path data (ISC). 24px grid, 1.75 stroke, round caps.
   Documented in readme ICONOGRAPHY. Use <Icon name="map-pin" size={18} />. */

const PATHS = {
  'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'sliders': '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/>',
  'dashboard': '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  'map-pin': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  'map': '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  'activity': '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  'bell': '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  'train': '<rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h.01"/><path d="M16 15h.01"/>',
  'euro': '<path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>',
  'ruler': '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>',
  'leaf': '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  'volume': '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>',
  'building': '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
  'trending-up': '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
  'trending-down': '<path d="M16 17h6v-6"/><path d="m22 17-8.5-8.5-5 5L2 7"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'filter': '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  'refresh': '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  'zap': '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  'shield': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  'eye': '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  'image': '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  'server': '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>',
  'wifi': '<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>',
  'alert': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'play': '<polygon points="6 3 20 12 6 21 6 3"/>',
  'pause': '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
  'star': '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.69 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.453 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"/>',
  'list': '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
  'grid': '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  'maximize': '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
  'layers': '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
  'route': '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  'gauge': '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  'settings': '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  'logout': '<path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>',
  'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'mail': '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  'history': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>'
};
function Icon({
  name,
  size = 18,
  stroke = 1.75,
  color = 'currentColor',
  style
}) {
  const d = PATHS[name];
  if (!d) return null;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0,
      display: 'block',
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: d
    }
  });
}
window.Icon = Icon;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pepite-dashboard/icons.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Delta = __ds_scope.Delta;

__ds_ns.ScoreBar = __ds_scope.ScoreBar;

__ds_ns.ScoreGauge = __ds_scope.ScoreGauge;

__ds_ns.ScoreRadar = __ds_scope.ScoreRadar;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.RangeSlider = __ds_scope.RangeSlider;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.LogRow = __ds_scope.LogRow;

__ds_ns.StatusDot = __ds_scope.StatusDot;

})();

/* DashboardView (Vue 1) — KPIs + cartographie heatmap + flux de pépites. */
(() => {
const DS = window.PPiteDesignSystem_0c887c || {};
const { Icon, PEPITE_DATA, fmtEur, fmtAgo } = window;

function scoreColor(v) {
  if (v >= 80) return 'var(--score-100)';
  if (v >= 65) return 'var(--score-75)';
  if (v >= 45) return 'var(--score-50)';
  if (v >= 25) return 'var(--score-25)';
  return 'var(--score-0)';
}

/* ---- CSS-drawn dark opportunity map ---- */
function MapPanel({ listings, selectedId, onSelect }) {
  const { IconButton, Badge } = DS;
  const heat = listings.map((l) => {
    const c = l.score >= 80 ? '242,179,61' : l.score >= 60 ? '45,212,167' : '75,163,245';
    const a = (0.10 + (l.score / 100) * 0.30).toFixed(2);
    return `radial-gradient(120px 120px at ${l.x}% ${l.y}%, rgba(${c},${a}), transparent 70%)`;
  }).join(',');
  return (
    <div style={{ position: 'relative', height: '100%', minHeight: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg-sunken)' }}>
      {/* street grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)', backgroundSize: '48px 48px', opacity: 0.5 }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(58,68,82,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(58,68,82,0.4) 1px, transparent 1px)', backgroundSize: '192px 192px' }} />
      {/* parks */}
      <div style={{ position: 'absolute', left: '4%', top: '60%', width: 130, height: 90, borderRadius: 18, background: 'rgba(63,207,106,0.07)', border: '1px solid rgba(63,207,106,0.14)' }} />
      <div style={{ position: 'absolute', right: '6%', top: '8%', width: 100, height: 70, borderRadius: 16, background: 'rgba(63,207,106,0.07)', border: '1px solid rgba(63,207,106,0.14)' }} />
      {/* Seine */}
      <div style={{ position: 'absolute', left: '-10%', bottom: '14%', width: '130%', height: 38, background: 'linear-gradient(180deg, rgba(75,163,245,0.16), rgba(75,163,245,0.06))', transform: 'rotate(-7deg)', borderTop: '1px solid rgba(75,163,245,0.3)', borderBottom: '1px solid rgba(75,163,245,0.2)' }} />
      {/* heat */}
      <div style={{ position: 'absolute', inset: 0, background: heat, mixBlendMode: 'screen' }} />

      {/* pins */}
      {listings.map((l) => {
        const sel = l.id === selectedId;
        const c = scoreColor(l.score);
        return (
          <button key={l.id} onClick={() => onSelect(l)} title={`${l.title} · ${l.score}`}
            style={{
              position: 'absolute', left: `${l.x}%`, top: `${l.y}%`, transform: 'translate(-50%,-50%)',
              width: sel ? 40 : 32, height: sel ? 40 : 32, borderRadius: '50%', cursor: 'pointer',
              background: 'var(--surface-1)', border: `2px solid ${c}`,
              color: c, fontFamily: 'var(--font-mono)', fontSize: sel ? 13 : 12, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: sel ? 5 : l.score >= 80 ? 3 : 1,
              boxShadow: sel ? `0 0 0 4px ${c}33, 0 0 16px ${c}` : `0 0 10px ${c}66`,
              transition: 'all var(--dur-fast) var(--ease-out)', fontVariantNumeric: 'tabular-nums',
            }}>
            {l.score}
          </button>
        );
      })}

      {/* map chrome */}
      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
        <Badge tone="gold" dot>{listings.filter((l) => l.score >= 80).length} pépites</Badge>
        <Badge tone="info">{listings.length} annonces</Badge>
      </div>
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <IconButton size="sm" variant="solid" label="Zoom +"><Icon name="plus" size={15} /></IconButton>
        <IconButton size="sm" variant="solid" label="Calques"><Icon name="layers" size={15} /></IconButton>
        <IconButton size="sm" variant="solid" label="Plein écran"><Icon name="maximize" size={15} /></IconButton>
      </div>
      {/* legend */}
      <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: 10, padding: '7px 11px', background: 'rgba(10,13,19,0.82)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
        <span style={{ fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, letterSpacing: '0.06em' }}>OPPORTUNITÉ</span>
        <div style={{ width: 110, height: 7, borderRadius: 'var(--radius-pill)', background: 'var(--heat-gradient)' }} />
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>faible→forte</span>
      </div>
    </div>
  );
}

/* ---- one row in the pépites feed ---- */
function PepiteRow({ l, selected, onSelect }) {
  const { ScoreGauge, Badge, Delta } = DS;
  const deltaPct = Math.round(((l.ppm2 - l.marketPpm2) / l.marketPpm2) * 1000) / 10;
  return (
    <button onClick={() => onSelect(l)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
        padding: '11px 13px', border: 'none', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer',
        background: selected ? 'var(--surface-2)' : 'transparent',
        boxShadow: selected ? 'inset 2px 0 0 var(--brand-500)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out)',
      }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = 'var(--surface-2)'; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = 'transparent'; }}>
      <ScoreGauge value={l.score} size={46} thickness={5} showValue />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</span>
          {l.score >= 80 && <Badge tone="gold" dot>Pépite</Badge>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="map-pin" size={12} />{l.quartier}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="train" size={12} />{l.metro[0].min} min</span>
          <span style={{ color: 'var(--text-faint)' }}>· {fmtAgo(l.freshMin)}</span>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{fmtEur(l.price)} €</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginTop: 2 }}>
          <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>{fmtEur(l.ppm2)} €/m²</span>
          <Delta value={deltaPct} invert size="sm" />
        </div>
      </div>
    </button>
  );
}

function DashboardView({ onOpen }) {
  const { StatCard, Panel, Tabs, Badge } = DS;
  const listings = PEPITE_DATA.LISTINGS;
  const [sel, setSel] = React.useState(listings[0]);
  const ranked = [...listings].sort((a, b) => b.score - a.score);
  const select = (l) => setSel(l);

  return (
    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14, minHeight: '100%' }}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <StatCard label="Pépites · 24h" value="14" delta="+6" icon={<Icon name="zap" size={16} />} accent="var(--gold-400)" />
        <StatCard label="Annonces scannées" value="2 481" delta="+312" icon={<Icon name="layers" size={16} />} />
        <StatCard label="Prix médian /m²" value="10 240" unit="€" delta="-2,1%" deltaTone="muted" icon={<Icon name="euro" size={16} />} />
        <StatCard label="Score moyen" value="67" unit="/100" delta="+4" icon={<Icon name="gauge" size={16} />} />
      </div>

      {/* Map + feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.55fr) minmax(340px,1fr)', gap: 14, flex: 1, minHeight: 520 }}>
        <Panel title="Cartographie des opportunités" subtitle="Paris · Île-de-France — heatmap pondérée par le score"
          icon={<Icon name="map" size={16} />} noPadding
          actions={<Badge tone="neutral">DVF + IGN</Badge>}
          style={{ minHeight: 0 }} bodyStyle={{ padding: 10 }}>
          <MapPanel listings={listings} selectedId={sel.id} onSelect={select} />
        </Panel>

        <Panel title="Flux de pépites" subtitle="Trié par score · temps réel" icon={<Icon name="activity" size={16} />}
          noPadding style={{ minHeight: 0 }}
          actions={<Tabs size="sm" tabs={[{ id: 'score', label: 'Score' }, { id: 'frais', label: 'Frais' }, { id: 'fav', label: 'Favoris', count: listings.filter((l) => l.fav).length }]} />}>
          <div style={{ overflow: 'auto', maxHeight: 520 }}>
            {ranked.map((l) => <PepiteRow key={l.id} l={l} selected={l.id === sel.id} onSelect={select} />)}
          </div>
        </Panel>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => onOpen(sel)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 14px',
          background: 'var(--brand-500)', color: 'var(--text-on-brand)', border: 'none',
          borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
          fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(45,212,167,0.25)',
        }}>
          Ouvrir la fiche · {sel.id} <Icon name="arrow-up-right" size={15} />
        </button>
      </div>
    </div>
  );
}

window.DashboardView = DashboardView;
window.pepiteScoreColor = scoreColor;
})();

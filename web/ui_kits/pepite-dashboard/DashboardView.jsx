/* DashboardView (Vue 1) — KPIs + cartographie réelle (Leaflet/OSM) + flux de pépites. */
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

/* ---- vraie carte Leaflet/OSM, pins colorés par score aux coordonnées réelles ---- */
function MapPanel({ listings, selectedId, onSelect }) {
  const { Badge } = DS;
  const elRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const layerRef = React.useRef(null);

  // init carte (une fois)
  React.useEffect(() => {
    if (!window.L || !elRef.current || mapRef.current) return;
    const map = window.L.map(elRef.current, { zoomControl: false, attributionControl: true })
      .setView([48.892, 2.238], 12);
    map.attributionControl.setPrefix('');
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19, subdomains: 'abcd', attribution: '© OpenStreetMap · © CARTO',
    }).addTo(map);
    window.L.control.zoom({ position: 'topright' }).addTo(map);
    layerRef.current = window.L.layerGroup().addTo(map);
    mapRef.current = map;
    // FIX tuiles grises : le conteneur (flex/grid) n'a sa taille qu'après layout.
    const fix = () => map.invalidateSize();
    setTimeout(fix, 0); setTimeout(fix, 300);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fix) : null;
    if (ro) ro.observe(elRef.current);
    return () => { if (ro) ro.disconnect(); map.remove(); mapRef.current = null; layerRef.current = null; };
  }, []);

  // (re)dessine les pins quand les annonces ou la sélection changent
  React.useEffect(() => {
    const group = layerRef.current;
    if (!group) return;
    group.clearLayers();
    listings.forEach((l) => {
      if (typeof l.lat !== 'number' || typeof l.lon !== 'number') return;
      const sel = l.id === selectedId;
      const c = window.pepiteScoreColor(l.score);
      const s = sel ? 38 : 30;
      const icon = window.L.divIcon({
        className: '', iconSize: [s, s], iconAnchor: [s / 2, s / 2],
        html: `<div style="width:${s}px;height:${s}px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--surface-1);border:2px solid ${c};color:${c};font:700 ${sel ? 13 : 12}px var(--font-mono);box-shadow:${sel ? `0 0 0 4px ${c}33,0 0 16px ${c}` : `0 0 10px ${c}66`};">${l.score}</div>`,
      });
      window.L.marker([l.lat, l.lon], { icon, zIndexOffset: sel ? 1000 : l.score * 2 })
        .on('click', () => onSelect(l))
        .addTo(group);
    });
  }, [listings, selectedId]);

  // recadre sur l'ensemble des biens quand la liste change
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const pts = listings.filter((l) => typeof l.lat === 'number' && typeof l.lon === 'number')
      .map((l) => [l.lat, l.lon]);
    if (pts.length) { try { map.fitBounds(pts, { padding: [40, 40], maxZoom: 15 }); } catch (e) {} }
  }, [listings]);

  const pepites = listings.filter((l) => l.score >= 80).length;
  return (
    <div style={{ position: 'relative', height: '100%', minHeight: 480, borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg-sunken)' }}>
      <div ref={elRef} style={{ position: 'absolute', inset: 0 }} />
      {!window.L && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontSize: 'var(--text-sm)' }}>Carte indisponible (Leaflet non chargé)</div>}
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1000, display: 'flex', gap: 6 }}>
        <Badge tone="gold" dot>{pepites} pépites</Badge>
        <Badge tone="info">{listings.length} annonces</Badge>
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
      {l.photoUrls && l.photoUrls[0] &&
        <img src={l.photoUrls[0]} referrerPolicy="no-referrer" loading="lazy" alt=""
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-subtle)' }} />}
      <ScoreGauge value={l.score} size={46} thickness={5} showValue />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</span>
          {l.score >= 80 && <Badge tone="gold" dot>Pépite</Badge>}
          {window.PepiteFav && window.PepiteFav.has(l.id) && <Icon name="star" size={12} color="var(--gold-400)" />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="map-pin" size={12} />{l.quartier}</span>
          {l.metro && l.metro[0] && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="train" size={12} />{l.metro[0].min} min</span>}
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
  const [sort, setSort] = React.useState('score');
  const [, bumpFav] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    const h = () => bumpFav();
    window.addEventListener('pepite-fav', h);
    return () => window.removeEventListener('pepite-fav', h);
  }, []);
  const isFav = (l) => !!(window.PepiteFav && window.PepiteFav.has(l.id));
  let ranked = [...listings];
  if (sort === 'fav') ranked = ranked.filter(isFav).sort((a, b) => b.score - a.score);
  else if (sort === 'frais') ranked.sort((a, b) => a.freshMin - b.freshMin);
  else ranked.sort((a, b) => b.score - a.score);
  const select = (l) => setSel(l);

  const avg = listings.length ? Math.round(listings.reduce((s, l) => s + l.score, 0) / listings.length) : 0;
  const medianPpm2 = (() => {
    const v = listings.map((l) => l.marketPpm2).filter(Boolean).sort((a, b) => a - b);
    return v.length ? fmtEur(v[Math.floor(v.length / 2)]) : '—';
  })();

  return (
    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14, minHeight: '100%' }}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <StatCard label="Pépites (≥80)" value={String(listings.filter((l) => l.score >= 80).length)} icon={<Icon name="zap" size={16} />} accent="var(--gold-400)" />
        <StatCard label="Annonces scannées" value={String(listings.length)} icon={<Icon name="layers" size={16} />} />
        <StatCard label="Médiane DVF /m²" value={medianPpm2} unit="€" icon={<Icon name="euro" size={16} />} />
        <StatCard label="Score moyen" value={String(avg)} unit="/100" icon={<Icon name="gauge" size={16} />} />
      </div>

      {/* Map + feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.55fr) minmax(340px,1fr)', gap: 14, flex: 1, minHeight: 520 }}>
        <Panel title="Cartographie des opportunités" subtitle="Île-de-France — pins réels colorés par score"
          icon={<Icon name="map" size={16} />} noPadding
          actions={<Badge tone="neutral">OSM + DVF</Badge>}
          style={{ minHeight: 0 }} bodyStyle={{ padding: 10 }}>
          <MapPanel listings={listings} selectedId={sel.id} onSelect={select} />
        </Panel>

        <Panel title="Flux de pépites" subtitle="Trié par score · temps réel" icon={<Icon name="activity" size={16} />}
          noPadding style={{ minHeight: 0 }}
          actions={<Tabs size="sm" value={sort} onChange={setSort} tabs={[{ id: 'score', label: 'Score' }, { id: 'frais', label: 'Frais' }, { id: 'fav', label: 'Favoris', count: listings.filter(isFav).length }]} />}>
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

/* AppShell — sidebar + topbar chrome for the Pépite dashboard. */
const DS = window.PPiteDesignSystem_0c887c || {};
const { Icon } = window;

const NAV = [
  { id: 'dashboard',  label: 'Dashboard',        icon: 'dashboard' },
  { id: 'detail',     label: 'Fiche détail',     icon: 'building' },
  { id: 'config',     label: 'Moteur de scoring', icon: 'sliders' },
  { id: 'monitoring', label: 'Monitoring',       icon: 'activity' },
];

function NavItem({ item, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 11, width: '100%', height: 38,
        padding: '0 11px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
        textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
        fontWeight: active ? 600 : 500,
        color: active ? 'var(--text-strong)' : hover ? 'var(--text-default)' : 'var(--text-muted)',
        background: active ? 'var(--brand-soft)' : hover ? 'var(--surface-2)' : 'transparent',
        boxShadow: active ? 'inset 2px 0 0 var(--brand-500)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
      }}>
      <Icon name={item.icon} size={17} color={active ? 'var(--brand-400)' : 'currentColor'} />
      {item.label}
    </button>
  );
}

function Sidebar({ view, setView, setQuery, goDashboard }) {
  const { StatusDot } = DS;
  return (
    <aside style={{
      width: 'var(--sidebar-w)', flexShrink: 0, height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--surface-1)', borderRight: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 16px 14px' }}>
        <img src="../../assets/logo-mark.svg" alt="" width="30" height="30" style={{ borderRadius: 8 }} />
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>Pépite</div>
          <div style={{ fontSize: 9, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>VEILLE · IDF v3.2</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '4px 10px', flex: 1 }}>
        <div className="eyebrow" style={{ padding: '8px 11px 6px' }}>Navigation</div>
        {NAV.map((n) => <NavItem key={n.id} item={n} active={view === n.id} onClick={() => setView(n.id)} />)}

        <div className="eyebrow" style={{ padding: '18px 11px 6px' }}>Recherches</div>
        {[{ label: 'Courbevoie · axe Défense', q: 'courbevoie' }, { label: 'Asnières-sur-Seine', q: 'asnières' }, { label: 'Appartements', q: 'appartement' }].map((s, i) => (
          <button key={i}
            onClick={() => { if (setQuery) setQuery(s.q); if (goDashboard) goDashboard(); }}
            title={`Filtrer : ${s.label}`}
            style={{
            display: 'flex', alignItems: 'center', gap: 9, width: '100%', height: 32, padding: '0 11px',
            border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'left',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-default)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
            <span style={{ width: 6, height: 6, borderRadius: 2, background: ['var(--viz-1)', 'var(--viz-2)', 'var(--viz-4)'][i], flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <StatusDot status="running" label="Scraper actif" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-faint)' }}>14:32</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--surface-4)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--brand-400)' }}>DS</div>
          <div style={{ lineHeight: 1.2, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-default)', fontWeight: 600 }}>data-eng</div>
            <div style={{ fontSize: 9, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>admin · prod</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ view, onRefresh, query, setQuery, period, setPeriod, onOpen, goDashboard }) {
  const { Input, Select, IconButton, Badge } = DS;
  const titles = { dashboard: 'Dashboard · Île-de-France', detail: 'Fiche détail', config: 'Moteur de scoring', monitoring: 'Monitoring technique' };
  const [notifOpen, setNotifOpen] = React.useState(false);
  const listings = (window.PEPITE_DATA && window.PEPITE_DATA.LISTINGS) || [];
  const pepites = listings.filter((l) => l.score >= 80).sort((a, b) => b.score - a.score);

  // raccourci ⌘K / Ctrl+K : focus la barre de recherche
  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        const input = document.querySelector('input[placeholder^="Rechercher"]');
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header style={{
      height: 'var(--topbar-h)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14,
      padding: '0 18px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)',
      backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)', position: 'relative', zIndex: 30,
    }}>
      <h1 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-strong)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{titles[view]}</h1>
      <div style={{ flex: 1, maxWidth: 360 }}>
        <Input size="sm" placeholder="Rechercher annonce, quartier, ID…"
          value={query || ''}
          onChange={(e) => { setQuery(e.target.value); if (view !== 'dashboard') goDashboard(); }}
          onKeyDown={(e) => { if (e.key === 'Enter') goDashboard(); }}
          prefix={<Icon name="search" size={15} />}
          suffix={query
            ? <button onClick={() => setQuery('')} aria-label="Effacer la recherche" title="Effacer" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-faint)', display: 'flex', padding: 0 }}><Icon name="x" size={13} /></button>
            : <span style={{ fontSize: 10, padding: '1px 5px', border: '1px solid var(--border-default)', borderRadius: 4, color: 'var(--text-faint)' }}>⌘K</span>} />
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ width: 150 }}>
        <Select size="sm" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="all">Toutes périodes</option>
          <option value="24h">Dernières 24 h</option>
          <option value="7j">7 derniers jours</option>
          <option value="30j">30 derniers jours</option>
        </Select>
      </div>
      <IconButton size="sm" variant="solid" label="Rafraîchir" onClick={onRefresh}><Icon name="refresh" size={16} /></IconButton>
      <div style={{ position: 'relative' }}>
        <IconButton size="sm" variant="solid" label="Alertes" active={notifOpen} onClick={() => setNotifOpen((o) => !o)}><Icon name="bell" size={16} /></IconButton>
        {pepites.length > 0 &&
          <span style={{ position: 'absolute', top: -3, right: -3, minWidth: 15, height: 15, padding: '0 3px', borderRadius: 'var(--radius-pill)', background: 'var(--gold-500)', color: 'var(--text-on-gold)', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', border: '2px solid var(--bg-base)', pointerEvents: 'none' }}>{pepites.length}</span>}
        {notifOpen && (
          <React.Fragment>
            <div onClick={() => setNotifOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 320, zIndex: 50, background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-2)', overflow: 'hidden' }}>
              <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>Alertes pépites</span>
                <Badge tone="gold" dot>{pepites.length}</Badge>
              </div>
              <div style={{ maxHeight: 320, overflow: 'auto' }}>
                {pepites.length === 0
                  ? <div style={{ padding: '18px 12px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 'var(--text-xs)' }}>Aucune pépite (score ≥ 80) pour l'instant.</div>
                  : pepites.map((l) => (
                    <button key={l.id} onClick={() => { setNotifOpen(false); onOpen(l); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '9px 12px', border: 'none', borderBottom: '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--gold-400)', width: 26, flexShrink: 0 }}>{l.score}</span>
                      <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-xs)', color: 'var(--text-default)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title} · {l.quartier}</span>
                    </button>
                  ))}
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </header>
  );
}

function AppShell({ view, setView, onRefresh, query, setQuery, period, setPeriod, onOpen, goDashboard, children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', background: 'transparent', position: 'relative', zIndex: 1 }}>
      <Sidebar view={view} setView={setView} setQuery={setQuery} goDashboard={goDashboard} />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, height: '100%' }}>
        <Topbar view={view} onRefresh={onRefresh} query={query} setQuery={setQuery} period={period} setPeriod={setPeriod} onOpen={onOpen} goDashboard={goDashboard} />
        <main style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>{children}</main>
      </div>
    </div>
  );
}

window.AppShell = AppShell;

/* MonitoringView (Vue 4) — santé du scraper : sources, proxies, débit, logs. */
(() => {
const DS = window.PPiteDesignSystem_0c887c || {};
const { Icon, PEPITE_DATA } = window;
const { SOURCES, LOGS } = PEPITE_DATA;

function MiniBars({ data, color = 'var(--brand-500)', height = 34 }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, height: `${Math.max(6, (v / max) * 100)}%`, background: color, opacity: 0.35 + (v / max) * 0.65, borderRadius: '2px 2px 0 0' }} />
      ))}
    </div>
  );
}

const THROUGHPUT = [38, 42, 31, 55, 61, 48, 72, 80, 66, 90, 84, 102, 95, 78, 88, 110, 124, 98, 86, 70, 64, 58, 49, 53];

function SourceRow({ s }) {
  const { StatusDot, Badge } = DS;
  const rate = s.scanned > 0 ? Math.round((1 - s.blocked / (s.scanned + s.blocked)) * 100) : 0;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '150px 80px 70px 90px 80px 1fr', alignItems: 'center', gap: 12, padding: '11px 14px', borderBottom: '1px solid var(--border-subtle)', fontSize: 'var(--text-xs)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <StatusDot status={s.status} showLabel={false} />
        <span style={{ fontWeight: 600, color: 'var(--text-strong)', fontSize: 'var(--text-sm)' }}>{s.name}</span>
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-default)' }}>{s.scanned.toLocaleString('fr-FR')}</span>
      <span style={{ fontFamily: 'var(--font-mono)', color: s.found > 0 ? 'var(--gold-400)' : 'var(--text-faint)', fontWeight: 600 }}>{s.found}</span>
      <span style={{ fontFamily: 'var(--font-mono)', color: s.blocked > 20 ? 'var(--danger-500)' : 'var(--text-muted)' }}>{s.blocked} bloq.</span>
      <span style={{ fontFamily: 'var(--font-mono)', color: s.latency > 1000 ? 'var(--warning-500)' : 'var(--text-muted)' }}>{s.latency || '—'}ms</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 5, borderRadius: 'var(--radius-pill)', background: 'var(--surface-4)', overflow: 'hidden', maxWidth: 110 }}>
          <div style={{ width: `${rate}%`, height: '100%', background: rate > 80 ? 'var(--success-500)' : rate > 50 ? 'var(--warning-500)' : 'var(--danger-500)', borderRadius: 'var(--radius-pill)' }} />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', width: 32 }}>{rate}%</span>
        <Badge tone="neutral"><span style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{s.proxy}</span></Badge>
      </div>
    </div>
  );
}

function MonitoringView() {
  const { Panel, StatCard, LogRow, StatusDot, Badge, IconButton, Button, Switch, Tabs } = DS;
  const [paused, setPaused] = React.useState(false);

  return (
    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
        <StatCard label="Uptime · 30j" value="99,4" unit="%" delta="+0,2%" icon={<Icon name="shield" size={16} />} />
        <StatCard label="Requêtes / min" value="124" delta="+18" icon={<Icon name="activity" size={16} />} spark={<MiniBars data={THROUGHPUT.slice(-10)} height={26} />} />
        <StatCard label="Taux de succès" value="91,2" unit="%" delta="-1,4%" deltaTone="warning" icon={<Icon name="check" size={16} />} />
        <StatCard label="Requêtes bloquées" value="158" delta="+62" deltaTone="danger" icon={<Icon name="alert" size={16} />} accent="var(--danger-500)" />
        <StatCard label="Proxies sains" value="42" unit="/ 48" delta="-3" deltaTone="muted" icon={<Icon name="server" size={16} />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: 14, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* sources table */}
          <Panel title="Sources de scraping" icon={<Icon name="layers" size={16} />} noPadding
            actions={<Button variant="secondary" size="sm" leftIcon={<Icon name="refresh" size={14} />}>Relancer</Button>}>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 80px 70px 90px 80px 1fr', gap: 12, padding: '9px 14px', borderBottom: '1px solid var(--border-default)' }}>
              {['Source', 'Scannées', 'Pépites', 'Bloquées', 'Latence', 'Taux · proxy'].map((h) => (
                <span key={h} className="eyebrow" style={{ fontSize: 10 }}>{h}</span>
              ))}
            </div>
            {SOURCES.map((s) => <SourceRow key={s.name} s={s} />)}
          </Panel>

          {/* throughput */}
          <Panel title="Débit de scraping" subtitle="Requêtes / minute · 24 dernières heures" icon={<Icon name="trending-up" size={16} />}
            actions={<Tabs size="sm" tabs={[{ id: '24h', label: '24h' }, { id: '7j', label: '7j' }]} />}>
            <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
              {THROUGHPUT.map((v, i) => {
                const max = Math.max(...THROUGHPUT);
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                    <div style={{ height: `${(v / max) * 100}%`, background: i === THROUGHPUT.length - 7 ? 'var(--gold-500)' : 'var(--brand-500)', opacity: 0.45 + (v / max) * 0.55, borderRadius: '3px 3px 0 0' }} title={`${v} req/min`} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
              <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>now</span>
            </div>
          </Panel>
        </div>

        {/* proxy + alerts side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Panel title="Pool de proxies" icon={<Icon name="wifi" size={16} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ k: 'FR · Residential', v: 18, t: 20, c: 'var(--success-500)' }, { k: 'FR · Mobile', v: 14, t: 16, c: 'var(--success-500)' }, { k: 'FR · Datacenter', v: 10, t: 12, c: 'var(--warning-500)' }].map((p, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-default)' }}>{p.k}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{p.v}/{p.t}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 'var(--radius-pill)', background: 'var(--surface-4)', overflow: 'hidden' }}>
                    <div style={{ width: `${(p.v / p.t) * 100}%`, height: '100%', background: p.c, borderRadius: 'var(--radius-pill)' }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Santé système" icon={<Icon name="server" size={16} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Queue Redis', 'online', '1 240 jobs'], ['Worker pool', 'online', '8 / 8 actifs'], ['Géocodeur IGN', 'online', '84% cache'], ['Solver captcha', 'warning', 'file 2.1s'], ['SMTP alertes', 'online', '3 envoyés']].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <StatusDot status={r[1]} label={r[0]} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-faint)' }}>{r[2]}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* log console */}
      <Panel title="Console de logs" icon={<Icon name="list" size={16} />} subtitle="Flux en direct · agrégé toutes sources" noPadding
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusDot status={paused ? 'idle' : 'running'} label={paused ? 'En pause' : 'Live'} />
            <IconButton size="sm" variant="solid" label={paused ? 'Reprendre' : 'Pause'} onClick={() => setPaused((p) => !p)}><Icon name={paused ? 'play' : 'pause'} size={14} /></IconButton>
            <IconButton size="sm" variant="solid" label="Exporter"><Icon name="download" size={14} /></IconButton>
          </div>
        }>
        <div style={{ background: 'var(--bg-sunken)', maxHeight: 240, overflow: 'auto', padding: '8px 4px' }}>
          {LOGS.map((g, i) => <LogRow key={i} {...g} />)}
        </div>
      </Panel>
    </div>
  );
}

window.MonitoringView = MonitoringView;
})();

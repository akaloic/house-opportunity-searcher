/* DetailView (Vue 2) — fiche détail "deep dive": justification du score,
   photos / street view, transports, comparaison marché. */
(() => {
const DS = window.PPiteDesignSystem_0c887c || {};
const { Icon, PEPITE_DATA, fmtEur, fmtAgo } = window;
const { CRITERIA, WEIGHTS } = PEPITE_DATA;

function Fact({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 'var(--text-2xs)', color: 'var(--text-faint)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}><Icon name={icon} size={12} />{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-strong)' }}>{value}</span>
    </div>
  );
}

function PhotoBlock({ idx, total, big, src }) {
  return (
    <div style={{
      position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden',
      background: `linear-gradient(135deg, var(--surface-3), var(--surface-2))`,
      border: '1px solid var(--border-subtle)', aspectRatio: big ? '16/10' : '1/1',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {src
        ? <img src={src} loading="lazy" alt="" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        : <Icon name="image" size={big ? 28 : 18} color="var(--text-disabled)" />}
      {big && total > 0 && <span style={{ position: 'absolute', bottom: 8, right: 9, fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', background: 'rgba(6,8,12,0.7)', padding: '2px 6px', borderRadius: 4 }}>{idx}/{total}</span>}
    </div>
  );
}

function Contribution({ c, weight, value, totalW }) {
  const wn = Math.round((weight / totalW) * 100);
  const pts = Math.round((value / 100) * (weight / totalW) * 100);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '128px 1fr 52px', alignItems: 'center', gap: 12, padding: '7px 0' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-default)' }}>
        <Icon name={c.icon} size={13} color={c.accent} />{c.short}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 6, borderRadius: 'var(--radius-pill)', background: 'var(--surface-4)', overflow: 'hidden' }}>
          <div style={{ width: `${value}%`, height: '100%', background: c.accent, borderRadius: 'var(--radius-pill)', boxShadow: `0 0 8px ${c.accent}55` }} />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-faint)', minWidth: 56 }}>×{wn}% poids</span>
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>+{pts}</span>
    </div>
  );
}

function DetailView({ listing, onBack }) {
  const { Panel, ScoreGauge, ScoreRadar, Badge, Delta, Button, IconButton, Card } = DS;
  const l = listing || PEPITE_DATA.LISTINGS[0];
  const [fav, setFav] = React.useState(!!(window.PepiteFav && window.PepiteFav.has(l.id)));
  const totalW = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
  const deltaPct = Math.round(((l.ppm2 - l.marketPpm2) / l.marketPpm2) * 1000) / 10;
  const axes = CRITERIA.map((c) => ({ short: c.short, label: c.label, value: l.crit[c.key] }));
  const marketDelta = l.marketPpm2 - l.ppm2;

  return (
    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* breadcrumb header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <IconButton variant="solid" label="Retour" onClick={onBack}><Icon name="chevron-left" size={17} /></IconButton>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>{l.title}</h2>
            {l.score >= 80 && <Badge tone="gold" dot>Pépite</Badge>}
            <Badge tone="info">{l.source}</Badge>
            <Badge tone="neutral"><span style={{ fontFamily: 'var(--font-mono)' }}>{l.id}</span></Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            <Icon name="map-pin" size={14} />{l.addr} · {l.quartier}
            <span style={{ color: 'var(--text-faint)' }}>· détectée il y a {fmtAgo(l.freshMin)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" size="md" leftIcon={<Icon name="eye" size={15} />}
            onClick={() => { if (l.url) window.open(l.url, '_blank', 'noopener'); }}>Voir l'annonce</Button>
          <Button variant={fav ? 'secondary' : 'gold'} size="md" leftIcon={<Icon name="star" size={15} />}
            onClick={() => setFav(window.PepiteFav.toggle(l.id))}>{fav ? 'Suivi ✓' : 'Suivre'}</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 420px', gap: 14, alignItems: 'start' }}>
        {/* LEFT: visual split */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Panel noPadding style={{ overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 2, background: 'var(--border-subtle)' }}>
              <div style={{ background: 'var(--surface-1)', padding: 2 }}><PhotoBlock idx={1} total={l.photos} big src={(l.photoUrls || [])[0]} /></div>
              <div style={{ position: 'relative', background: 'var(--bg-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border-subtle) 1px,transparent 1px),linear-gradient(90deg,var(--border-subtle) 1px,transparent 1px)', backgroundSize: '24px 24px', opacity: 0.4 }} />
                <div style={{ textAlign: 'center', color: 'var(--text-faint)', zIndex: 1 }}>
                  <Icon name="route" size={26} color="var(--brand-400)" style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, letterSpacing: '0.04em' }}>STREET VIEW</div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}>{l.addr}</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6, padding: 10 }}>
              {Array.from({ length: 6 }).map((_, i) => <PhotoBlock key={i} idx={i + 2} total={l.photos} src={(l.photoUrls || [])[i + 1]} />)}
            </div>
          </Panel>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            <Fact icon="ruler" label="Surface" value={`${l.surface} m²`} />
            <Fact icon="building" label="Pièces" value={`${l.rooms}`} />
            <Fact icon="layers" label="Étage" value={`${l.floor}/${l.floors}`} />
            <Fact icon="leaf" label="DPE" value={l.dpe} />
          </div>

          <Panel title="Transports & accessibilité" icon={<Icon name="train" size={16} />}
            subtitle="Temps de marche réels · isochrone 15 min">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: 16, alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {l.metro.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 34, height: 22, borderRadius: 'var(--radius-sm)', background: 'var(--surface-4)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--brand-400)', flexShrink: 0 }}>{m.line}</span>
                    <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>{m.name}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}><Icon name="clock" size={12} />{m.min} min</span>
                  </div>
                ))}
              </div>
              {/* isochrone mini */}
              <div style={{ position: 'relative', height: 120, borderRadius: 'var(--radius-md)', background: 'var(--bg-sunken)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                {[58, 40, 22].map((s, i) => (
                  <div key={i} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: s, height: s, borderRadius: '50%', border: `1.5px solid ${['rgba(75,163,245,0.4)', 'rgba(45,212,167,0.5)', 'rgba(242,179,61,0.7)'][i]}`, background: ['transparent', 'rgba(45,212,167,0.05)', 'rgba(242,179,61,0.12)'][i] }} />
                ))}
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 7, height: 7, borderRadius: '50%', background: 'var(--gold-400)', boxShadow: '0 0 8px var(--gold-glow)' }} />
                <span style={{ position: 'absolute', bottom: 5, left: 6, fontSize: 9, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>5 · 10 · 15 min</span>
              </div>
            </div>
          </Panel>
        </div>

        {/* RIGHT: score deep dive */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card glow={l.score >= 80} padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <ScoreGauge value={l.score} size={92} label={l.score >= 80 ? 'Pépite' : l.score >= 60 ? 'Bon plan' : 'Moyen'} />
              <div style={{ flex: 1 }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>Prix de vente</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{fmtEur(l.price)} €</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}>{fmtEur(l.ppm2)} €/m²</span>
                  <Delta value={deltaPct} invert />
                </div>
              </div>
            </div>
          </Card>

          {/* market comparison */}
          <Panel title="Comparaison au marché" icon={<Icon name="trending-down" size={16} />} subtitle={`Médiane quartier ${l.quartier} (DVF)`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ k: 'Cette annonce', v: l.ppm2, c: 'var(--brand-500)' }, { k: `Médiane ${l.quartier}`, v: l.marketPpm2, c: 'var(--text-faint)' }].map((row, i) => {
                const maxv = Math.max(l.ppm2, l.marketPpm2);
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{row.k}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-default)' }}>{fmtEur(row.v)} €/m²</span>
                    </div>
                    <div style={{ height: 9, borderRadius: 'var(--radius-pill)', background: 'var(--surface-4)', overflow: 'hidden' }}>
                      <div style={{ width: `${(row.v / maxv) * 100}%`, height: '100%', background: row.c, borderRadius: 'var(--radius-pill)' }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 2, padding: '8px 10px', background: marketDelta > 0 ? 'var(--success-soft)' : 'var(--danger-soft)', borderRadius: 'var(--radius-md)' }}>
                <Icon name={marketDelta > 0 ? 'trending-down' : 'trending-up'} size={15} color={marketDelta > 0 ? 'var(--success-500)' : 'var(--danger-500)'} />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-default)' }}>
                  {marketDelta > 0 ? <><b style={{ color: 'var(--success-500)' }}>{fmtEur(Math.abs(marketDelta * l.surface))} €</b> sous le marché estimé</> : <><b style={{ color: 'var(--danger-500)' }}>{fmtEur(Math.abs(marketDelta * l.surface))} €</b> au-dessus du marché</>}
                </span>
              </div>
            </div>
          </Panel>

          {/* justification mathématique */}
          <Panel title="Justification du score" icon={<Icon name="gauge" size={16} />}
            subtitle="score = Σ ( critère × poids normalisé )">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
              <ScoreRadar size={210} axes={axes} color={l.score >= 80 ? 'var(--gold-500)' : 'var(--brand-500)'} />
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 6 }}>
              {CRITERIA.map((c) => <Contribution key={c.key} c={c} weight={WEIGHTS[c.key]} value={l.crit[c.key]} totalW={totalW} />)}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-default)', marginTop: 6, paddingTop: 10 }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-default)' }}>Score pondéré total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: window.pepiteScoreColor(l.score), fontVariantNumeric: 'tabular-nums' }}>{l.score}<span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-faint)' }}> / 100</span></span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

window.DetailView = DetailView;
})();

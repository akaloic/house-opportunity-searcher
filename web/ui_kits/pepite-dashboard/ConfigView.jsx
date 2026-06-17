/* ConfigView (Vue 3) — moteur de scoring : poids en temps réel,
   filtres stricts, configuration des alertes. */
(() => {
const DS = window.PPiteDesignSystem_0c887c || {};
const { Icon, PEPITE_DATA, fmtEur } = window;
const { CRITERIA, WEIGHTS, LISTINGS } = PEPITE_DATA;

// Presets alignés sur les 7 axes RÉELS du moteur (cf chasseur/scoring + webexport.CRITERIA).
const PRESETS = {
  'Équilibré': WEIGHTS,
  'Investisseur': { decote: 40, futur_transport: 26, signaux_vendeur: 12, anciennete: 8, dpe_travaux: 6, charges: 5, acces_actuel: 3 },
  'Cash-flow': { decote: 30, futur_transport: 14, signaux_vendeur: 10, anciennete: 8, dpe_travaux: 10, charges: 16, acces_actuel: 12 },
};

// Persistance locale de la config (même esprit que window.PepiteFav) + barème DPE.
const CFG_KEY = 'pepite_config';
const DPE_RANK = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 };
function loadCfg() { try { return JSON.parse(localStorage.getItem(CFG_KEY) || 'null') || {}; } catch (e) { return {}; } }
function saveCfg(c) { try { localStorage.setItem(CFG_KEY, JSON.stringify(c)); } catch (e) {} }

function ZoneChip({ label, on, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 11px',
      borderRadius: 'var(--radius-pill)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)', fontWeight: 500,
      background: on ? 'var(--brand-soft)' : 'var(--surface-3)',
      color: on ? 'var(--brand-400)' : 'var(--text-muted)',
      border: `1px solid ${on ? 'rgba(45,212,167,0.35)' : 'var(--border-default)'}`,
      transition: 'all var(--dur-fast) var(--ease-out)',
    }}>
      {on && <Icon name="check" size={12} />}{label}
    </button>
  );
}

function ConfigView() {
  const { Panel, RangeSlider, Switch, Select, Button, Badge, ScoreGauge } = DS;
  const saved = React.useMemo(loadCfg, []);
  const DEFAULT_ZONES = { '92400': true, '92800': true, '92000': true, '92700': false, '75015': false };
  const [weights, setWeights] = React.useState({ ...WEIGHTS, ...(saved.weights || {}) });
  const [zones, setZones] = React.useState(saved.zones || { ...DEFAULT_ZONES });
  const [priceMax, setPriceMax] = React.useState(saved.priceMax ?? 310);
  const [surfMin, setSurfMin] = React.useState(saved.surfMin ?? 25);
  const [alertEmail, setAlertEmail] = React.useState(saved.alertEmail ?? true);
  const [instant, setInstant] = React.useState(saved.instant ?? false);
  const [threshold, setThreshold] = React.useState(saved.threshold ?? 70);
  const [dpe, setDpe] = React.useState(saved.dpe || 'D');
  const [ptype, setPtype] = React.useState(saved.ptype || 'appt');
  const [digest, setDigest] = React.useState(saved.digest || 'instant');
  const [dirty, setDirty] = React.useState(false);
  const [savedTick, setSavedTick] = React.useState(false);

  const totalW = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
  const setW = (k, v) => { setWeights((w) => ({ ...w, [k]: v })); setDirty(true); };
  const applyPreset = (name) => { setWeights({ ...PRESETS[name] }); setDirty(true); };
  const touch = (fn) => (v) => { fn(v); setDirty(true); };

  const save = () => {
    saveCfg({ weights, zones, priceMax, surfMin, alertEmail, instant, threshold, dpe, ptype, digest });
    setDirty(false);
    setSavedTick(true);
    setTimeout(() => setSavedTick(false), 2200);
  };
  const reset = () => {
    setWeights({ ...WEIGHTS }); setZones({ ...DEFAULT_ZONES });
    setPriceMax(310); setSurfMin(25); setAlertEmail(true); setInstant(false);
    setThreshold(70); setDpe('D'); setPtype('appt'); setDigest('instant');
    setDirty(true);
  };

  // filtres stricts — exclusion ferme AVANT le scoring (cf. CLAUDE.md §2), reflétée dans l'aperçu
  const passesFilters = (l) => {
    if (l.price > priceMax * 1000) return false;
    if (l.surface < surfMin) return false;
    if (dpe !== 'Tous' && DPE_RANK[l.dpe] != null && DPE_RANK[l.dpe] > (DPE_RANK[dpe] ?? 6)) return false;
    if (ptype === 'appt' && !/appart/i.test(l.title || '')) return false;
    if (ptype === 'maison' && !/maison/i.test(l.title || '')) return false;
    return true;
  };

  // re-scoring en direct (poids) sur l'échantillon filtré
  const scored = LISTINGS.filter(passesFilters).map((l) => {
    const s = CRITERIA.reduce((acc, c) => acc + l.crit[c.key] * weights[c.key], 0) / totalW;
    return { ...l, preview: Math.round(s) };
  }).sort((a, b) => b.preview - a.preview);
  const preview = scored.slice(0, 5);
  const matches = scored.filter((l) => l.preview >= threshold).length;

  return (
    <div style={{ padding: 18, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px', gap: 14, alignItems: 'start' }}>
      {/* LEFT: weights + filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Panel title="Pondération du scoring" icon={<Icon name="sliders" size={16} />}
          subtitle="Ajustez les poids — l'aperçu se recalcule en direct"
          actions={
            <div style={{ display: 'flex', gap: 6 }}>
              {Object.keys(PRESETS).map((p) => (
                <button key={p} onClick={() => applyPreset(p)} style={{ height: 26, padding: '0 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', background: 'var(--surface-3)', color: 'var(--text-muted)', fontSize: 'var(--text-2xs)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-strong)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}>{p}</button>
              ))}
            </div>
          }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {CRITERIA.map((c) => (
              <div key={c.key} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: 10, alignItems: 'start' }}>
                <Icon name={c.icon} size={16} color={c.accent} style={{ marginTop: 2 }} />
                <RangeSlider label={c.label} value={weights[c.key]} min={0} max={50} accent={c.accent} valueSuffix="" onChange={(v) => setW(c.key, v)} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Somme des poids · normalisée à 100%</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' }}>{totalW} pts</span>
          </div>
        </Panel>

        <Panel title="Filtres stricts" icon={<Icon name="filter" size={16} />} subtitle="Exclusion ferme — appliqués avant le scoring">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <RangeSlider label="Prix maximum" value={priceMax} min={150} max={1200} step={10} accent="var(--gold-500)" valueSuffix="k€" onChange={touch(setPriceMax)} />
            <RangeSlider label="Surface minimum" value={surfMin} min={10} max={120} accent="var(--viz-2)" valueSuffix=" m²" onChange={touch(setSurfMin)} />
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 9 }}>Zones géographiques</div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {Object.keys(zones).map((z) => <ZoneChip key={z} label={z} on={zones[z]} onToggle={() => { setZones((s) => ({ ...s, [z]: !s[z] })); setDirty(true); }} />)}
              <button
                onClick={() => {
                  const z = (window.prompt('Code postal de la zone à ajouter (ex : 92110)') || '').trim();
                  if (z) { setZones((s) => ({ ...s, [z]: true })); setDirty(true); }
                }}
                style={{ height: 28, padding: '0 11px', borderRadius: 'var(--radius-pill)', border: '1px dashed var(--border-strong)', background: 'transparent', color: 'var(--text-faint)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="plus" size={12} />Zone</button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 16 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 7 }}>DPE maximum</div>
              <Select size="sm" value={dpe} onChange={(e) => { setDpe(e.target.value); setDirty(true); }}><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option><option value="Tous">Tous</option></Select>
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 7 }}>Type de bien</div>
              <Select size="sm" value={ptype} onChange={(e) => { setPtype(e.target.value); setDirty(true); }}><option value="appt">Appartement</option><option value="maison">Maison</option><option value="tous">Tous</option></Select>
            </div>
          </div>
        </Panel>
      </div>

      {/* RIGHT: live preview + alerts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 0 }}>
        <Panel title="Aperçu temps réel" icon={<Icon name="zap" size={16} />} subtitle="Re-classement instantané sur l'échantillon"
          actions={<Badge tone={matches > 0 ? 'gold' : 'neutral'} dot={matches > 0}>{matches} alertes</Badge>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {preview.length === 0 && <div style={{ padding: '18px 4px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 'var(--text-xs)' }}>Aucun bien ne passe les filtres stricts.</div>}
            {preview.map((l, i) => {
              const diff = l.preview - l.score;
              return (
                <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 0', borderBottom: i < preview.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-faint)', width: 16 }}>{i + 1}</span>
                  <ScoreGauge value={l.preview} size={40} thickness={4} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-default)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>{l.quartier} · {fmtEur(l.price)} €</div>
                  </div>
                  {diff !== 0 && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', fontWeight: 700, color: diff > 0 ? 'var(--success-500)' : 'var(--danger-500)' }}>{diff > 0 ? '+' : ''}{diff}</span>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Alertes" icon={<Icon name="bell" size={16} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <RangeSlider label="Seuil d'alerte (score min.)" value={threshold} min={40} max={95} accent="var(--gold-500)" onChange={touch(setThreshold)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, paddingTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}><Icon name="mail" size={15} color="var(--text-muted)" />Alerte e-mail</span>
                <Switch checked={alertEmail} onChange={touch(setAlertEmail)} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-default)' }}><Icon name="zap" size={15} color="var(--text-muted)" />Notification instantanée</span>
                <Switch checked={instant} onChange={touch(setInstant)} />
              </div>
            </div>
            <div style={{ paddingTop: 4 }}>
              <div className="eyebrow" style={{ marginBottom: 7 }}>Fréquence du digest</div>
              <Select size="sm" value={digest} onChange={(e) => { setDigest(e.target.value); setDirty(true); }}><option value="instant">Instantané</option><option value="2h">Toutes les 2 h</option><option value="day">Quotidien · 8h</option></Select>
            </div>
          </div>
        </Panel>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" size="md" onClick={reset}>Réinitialiser</Button>
          <Button variant="primary" size="md" fullWidth disabled={!dirty} onClick={save} leftIcon={<Icon name="check" size={15} />}>{savedTick ? 'Enregistré ✓' : 'Enregistrer la config'}</Button>
        </div>
      </div>
    </div>
  );
}

window.ConfigView = ConfigView;
})();

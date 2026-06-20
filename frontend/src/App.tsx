import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Building2, SlidersHorizontal, Activity, Search, X,
  RefreshCw, Gem, Star,
} from 'lucide-react'
import type { ViewId, Listing } from './types'
import { useData, useFavorites } from './data/load'
import { useT, LangToggle } from './i18n'
import CommandPalette from './components/CommandPalette'
import Overview from './pages/Overview'
import Opportunities from './pages/Opportunities'
import Detail from './pages/Detail'
import ScoringEngine from './pages/ScoringEngine'
import Monitoring from './pages/Monitoring'

const NAV: { id: ViewId; label: string; Icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: "Vue d'ensemble", Icon: LayoutDashboard },
  { id: 'opportunities', label: 'Opportunités', Icon: Building2 },
  { id: 'scoring', label: 'Moteur de scoring', Icon: SlidersHorizontal },
  { id: 'monitoring', label: 'Monitoring', Icon: Activity },
]

const TITLES: Record<ViewId, string> = {
  overview: "Vue d'ensemble",
  opportunities: 'Opportunités · Île-de-France',
  detail: 'Fiche détail',
  scoring: 'Moteur de scoring',
  monitoring: 'Monitoring technique',
}

const SAVED = [
  { label: 'Courbevoie · axe Défense', q: 'courbevoie', c: 'var(--viz-1)' },
  { label: 'Nanterre · EOLE', q: 'nanterre', c: 'var(--viz-2)' },
  { label: 'Pépites ≥ 80', q: '', c: 'var(--gold-400)' },
]

export default function App() {
  const t = useT()
  const { data, live } = useData()
  const { favs, toggle, count } = useFavorites()
  const [view, setView] = useState<ViewId>('overview')
  const [selected, setSelected] = useState<Listing | null>(null)
  const [query, setQuery] = useState('')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [favRequest, setFavRequest] = useState(0)

  const openDetail = (l: Listing) => { setSelected(l); setView('detail') }
  const goSearch = (q: string) => { setQuery(q); setView('opportunities') }
  const goFavorites = () => { setView('opportunities'); setFavRequest((n) => n + 1) }

  // Raccourci global ⌘K / Ctrl+K → ouvre la palette de commandes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="shell">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Gem size={19} strokeWidth={2} /></div>
          <div>
            <div className="brand-name">Pépite</div>
            <div className="brand-tag">{t('VEILLE · IDF')}</div>
          </div>
        </div>

        <nav className="nav">
          <div className="nav-group eyebrow" style={{ padding: '10px 13px 4px' }}>{t('Navigation')}</div>
          {NAV.map(({ id, label, Icon }) => (
            <button key={id} className={`nav-item${view === id ? ' active' : ''}`} onClick={() => setView(id)} aria-current={view === id}>
              <Icon size={18} strokeWidth={1.9} className="ico" />
              <span className="label">{t(label)}</span>
              {id === 'opportunities' && count > 0 && <span className="nav-badge">{count}</span>}
            </button>
          ))}

          <div className="nav-group eyebrow" style={{ padding: '18px 13px 4px' }}>{t('Recherches')}</div>
          {SAVED.map((s, i) => (
            <button key={i} className="nav-item" onClick={() => goSearch(s.q)} title={`${t('Filtrer :')} ${s.label}`}>
              <span className="ico" style={{ width: 18, display: 'grid', placeItems: 'center' }}><span style={{ width: 7, height: 7, borderRadius: 2, background: s.c }} /></span>
              <span className="label" style={{ fontSize: 'var(--text-xs)' }}>{s.label}</span>
            </button>
          ))}
          {count > 0 && (
            <button className="nav-item" onClick={goFavorites} title={t('Mes favoris')}>
              <span className="ico" style={{ width: 18, display: 'grid', placeItems: 'center' }}><Star size={15} color="var(--gold-400)" fill="var(--gold-400)" /></span>
              <span className="label" style={{ fontSize: 'var(--text-xs)' }}>{t('Mes favoris')}</span>
              <span className="nav-badge">{count}</span>
            </button>
          )}
        </nav>

        <div className="sidebar-foot">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: live ? 'var(--success-500)' : 'var(--gold-400)', boxShadow: `0 0 8px ${live ? 'var(--success-500)' : 'var(--gold-400)'}` }} />
              {live ? t('Données pipeline') : t('Mode démo')}
            </span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>chasseur · scoring v3.2</div>
        </div>
      </aside>

      {/* ---------------- Main ---------------- */}
      <div className="main">
        <header className="topbar">
          <h1>{t(TITLES[view])}</h1>
          <div style={{ flex: 1, maxWidth: 380, marginLeft: 8 }}>
            <div className="field">
              <Search size={15} color="var(--text-faint)" />
              <input
                placeholder={t('Rechercher annonce, quartier, ID…')}
                value={query}
                onChange={(e) => { setQuery(e.target.value); if (view !== 'opportunities') setView('opportunities') }}
              />
              {query
                ? <button onClick={() => setQuery('')} aria-label={t('Effacer')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-faint)', display: 'flex', padding: 0 }}><X size={14} /></button>
                : <button className="kbd" onClick={() => setPaletteOpen(true)} title={t('Recherche rapide')} style={{ cursor: 'pointer' }}>⌘K</button>}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <LangToggle />
          <button className="iconbtn iconbtn-sm" aria-label={t('Rafraîchir')} title={t('Rafraîchir')} onClick={() => window.location.reload()}><RefreshCw size={15} /></button>
        </header>

        {view === 'overview' && <Overview data={data} onOpen={openDetail} onNavigate={setView} favs={favs} toggleFav={toggle} />}
        {view === 'opportunities' && <Opportunities data={data} query={query} onOpen={openDetail} favs={favs} toggleFav={toggle} favRequest={favRequest} />}
        {view === 'detail' && selected && <Detail key={selected.id} data={data} listing={selected} onBack={() => setView('opportunities')} onOpen={openDetail} fav={favs.has(selected.id)} toggleFav={toggle} />}
        {view === 'scoring' && <ScoringEngine data={data} />}
        {view === 'monitoring' && <Monitoring data={data} />}
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} data={data} onNavigate={setView} onOpen={openDetail} />
    </div>
  )
}

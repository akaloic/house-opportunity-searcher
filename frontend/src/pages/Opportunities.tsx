import { useEffect, useMemo, useState, lazy, Suspense } from 'react'
import { Map as MapIcon, Activity, Building2, Search } from 'lucide-react'
import type { PepiteData, Listing } from '../types'
import { Panel, Badge } from '../components/ui'
import { useRevealOnScroll } from '../lib/useInView'
import { useT } from '../i18n'
import { OppCard, FeedRow } from '../components/listing'

const MapPanel = lazy(() => import('../components/MapPanel'))

type Sort = 'score' | 'frais' | 'fav'

export default function Opportunities({
  data, query, onOpen, favs, toggleFav, favRequest = 0,
}: {
  data: PepiteData; query: string; onOpen: (l: Listing) => void; favs: Set<string>; toggleFav: (id: string) => void; favRequest?: number
}) {
  const t = useT()
  const [sort, setSort] = useState<Sort>('score')
  const [sel, setSel] = useState<string | undefined>(undefined)
  const revealRef = useRevealOnScroll<HTMLDivElement>()

  // Déclencheur "Mes favoris" depuis la sidebar → bascule le tri sur favoris.
  useEffect(() => { if (favRequest > 0) setSort('fav') }, [favRequest])

  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    const base = data.LISTINGS.filter((l) =>
      !q || [l.title, l.quartier, l.addr, l.id].some((s) => String(s || '').toLowerCase().includes(q)),
    )
    const arr = [...base]
    if (sort === 'fav') return arr.filter((l) => favs.has(l.id)).sort((a, b) => b.score - a.score)
    if (sort === 'frais') return arr.sort((a, b) => a.freshMin - b.freshMin)
    return arr.sort((a, b) => b.score - a.score)
  }, [data.LISTINGS, q, sort, favs])

  const pepites = filtered.filter((l) => l.score >= 80).length
  const open = (l: Listing) => { setSel(l.id); onOpen(l) }

  const SortTab = ({ id, label, count }: { id: Sort; label: string; count?: number }) => (
    <button
      onClick={() => setSort(id)}
      className="btn btn-sm"
      style={{
        background: sort === id ? 'var(--brand-soft)' : 'var(--surface-2)',
        color: sort === id ? 'var(--brand-400)' : 'var(--text-muted)',
        border: `1px solid ${sort === id ? 'rgba(45,212,167,0.3)' : 'var(--border-default)'}`,
      }}
    >
      {label}{count != null && <span style={{ marginLeft: 4, opacity: 0.7 }}>{count}</span>}
    </button>
  )

  return (
    <div className="page" ref={revealRef}>
      <div className="section-head anim d1" style={{ marginBottom: 18 }}>
        <div>
          <div className="section-title">{t('Opportunités · Île-de-France')}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Badge tone="gold" dot>{pepites} {t('pépites')}</Badge>
            <Badge tone="info">{filtered.length} {t('annonces')}</Badge>
            {q && <Badge tone="neutral">« {query} »</Badge>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <SortTab id="score" label={t('Score')} />
          <SortTab id="frais" label={t('Récent')} />
          <SortTab id="fav" label={t('Favoris')} count={filtered.length && sort === 'fav' ? undefined : data.LISTINGS.filter((l) => favs.has(l.id)).length} />
        </div>
      </div>

      <div className="split anim d2">
        <Panel title={t('Cartographie')} subtitle={t('Pins réels colorés par score')} icon={<MapIcon size={16} />} noPadding bodyStyle={{ padding: 10 }} style={{ minHeight: 0 }}>
          <Suspense fallback={<div style={{ height: 560, display: 'grid', placeItems: 'center', color: 'var(--text-faint)' }}>{t('Chargement de la carte…')}</div>}>
            <MapPanel listings={filtered} selectedId={sel} onSelect={open} height={560} />
          </Suspense>
        </Panel>

        <Panel title={t('Flux de pépites')} subtitle={t('Clic → fiche détail')} icon={<Activity size={16} />} noPadding style={{ minHeight: 0 }}>
          <div style={{ maxHeight: 560, overflow: 'auto' }}>
            {filtered.length === 0
              ? <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 'var(--text-sm)' }}>
                  {sort === 'fav' ? t("Aucun favori pour l'instant. Cliquez sur ★ pour suivre un bien.") : `${t('Aucune annonce ne correspond')}${q ? ` « ${query} »` : ''}.`}
                </div>
              : filtered.map((l) => <FeedRow key={l.id} l={l} active={l.id === sel} onOpen={open} fav={favs.has(l.id)} />)}
          </div>
        </Panel>
      </div>

      <div className="section-gap anim d3">
        <div className="section-head">
          <div className="section-title" style={{ fontSize: 'var(--text-lg)' }}><Building2 size={17} style={{ verticalAlign: '-3px', marginRight: 7 }} />{t('Toutes les annonces')}</div>
        </div>
        {filtered.length === 0
          ? <Panel><div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}><Search size={22} />{t('Aucun résultat.')}</div></Panel>
          : <div className="opp-grid">{filtered.map((l) => <OppCard key={l.id} l={l} onOpen={open} fav={favs.has(l.id)} onToggleFav={toggleFav} />)}</div>}
      </div>
    </div>
  )
}

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Search, CornerDownLeft, LayoutDashboard, Building2, SlidersHorizontal, Activity } from 'lucide-react'
import type { PepiteData, Listing, ViewId } from '../types'
import { fmtEur, decotePct } from '../lib/format'
import { useT } from '../i18n'
import { ScoreGauge } from './charts'
import { Badge } from './ui'

interface Item {
  key: string
  group: string
  label: string
  sub?: string
  icon: ReactNode
  run: () => void
}

export default function CommandPalette({
  open, onClose, data, onNavigate, onOpen,
}: {
  open: boolean; onClose: () => void; data: PepiteData
  onNavigate: (v: ViewId) => void; onOpen: (l: Listing) => void
}) {
  const t = useT()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQ(''); setActive(0)
      const id = setTimeout(() => inputRef.current?.focus(), 20)
      return () => clearTimeout(id)
    }
  }, [open])

  const ql = q.trim().toLowerCase()

  const items = useMemo<Item[]>(() => {
    const nav: { id: ViewId; label: string; sub: string; icon: ReactNode }[] = [
      { id: 'overview', label: "Vue d'ensemble", sub: 'Tableau de bord', icon: <LayoutDashboard size={16} /> },
      { id: 'opportunities', label: 'Opportunités', sub: 'Carte & flux', icon: <Building2 size={16} /> },
      { id: 'scoring', label: 'Moteur de scoring', sub: 'Pondération & alertes', icon: <SlidersHorizontal size={16} /> },
      { id: 'monitoring', label: 'Monitoring', sub: 'Santé du pipeline', icon: <Activity size={16} /> },
    ]
    const viewItems: Item[] = nav
      .filter((n) => !ql || n.label.toLowerCase().includes(ql))
      .map((n) => ({ key: `v-${n.id}`, group: 'Aller à', label: n.label, sub: n.sub, icon: n.icon, run: () => { onNavigate(n.id); onClose() } }))

    const listingItems: Item[] = data.LISTINGS
      .filter((l) => !ql || [l.title, l.quartier, l.addr, l.id].some((s) => String(s || '').toLowerCase().includes(ql)))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((l) => ({
        key: `l-${l.id}`, group: 'Biens',
        label: l.title, sub: `${l.quartier} · ${fmtEur(l.price)} €`,
        icon: <ScoreGauge value={l.score} size={30} thickness={4} animate={false} />,
        run: () => { onOpen(l); onClose() },
      }))

    return [...viewItems, ...listingItems]
  }, [ql, data.LISTINGS, onNavigate, onOpen, onClose])

  useEffect(() => { setActive((a) => Math.min(a, Math.max(0, items.length - 1))) }, [items.length])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(items.length - 1, a + 1)) }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
      else if (e.key === 'Enter') { e.preventDefault(); items[active]?.run() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, items, active, onClose])

  if (!open) return null

  let lastGroup = ''
  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={t('Recherche rapide')}>
        <div className="cmdk-input">
          <Search size={17} color="var(--text-faint)" />
          <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setActive(0) }} placeholder={t('Aller à une vue, chercher un bien…')} />
          <span className="kbd">esc</span>
        </div>
        <div className="cmdk-list">
          {items.length === 0 && <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 'var(--text-sm)' }}>{t('Aucun résultat.')}</div>}
          {items.map((it, i) => {
            const header = it.group !== lastGroup ? it.group : null
            lastGroup = it.group
            const dec = it.key.startsWith('l-') ? decotePct(data.LISTINGS.find((l) => `l-${l.id}` === it.key)!) : 0
            return (
              <div key={it.key}>
                {header && <div className="cmdk-group">{t(header)}</div>}
                <button
                  className={`cmdk-item${i === active ? ' active' : ''}`}
                  onMouseEnter={() => setActive(i)} onClick={() => it.run()}
                >
                  <span className="cmdk-ico">{it.icon}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="cmdk-label">{t(it.label)}</span>
                    {it.sub && <span className="cmdk-sub">{t(it.sub)}</span>}
                  </span>
                  {dec > 0 && <Badge tone="brand">−{dec.toFixed(0)} %</Badge>}
                  {i === active && <CornerDownLeft size={14} color="var(--text-faint)" />}
                </button>
              </div>
            )
          })}
        </div>
        <div className="cmdk-foot">
          <span><span className="kbd">↑</span><span className="kbd">↓</span> {t('naviguer')}</span>
          <span><span className="kbd">↵</span> {t('ouvrir')}</span>
          <span><span className="kbd">esc</span> {t('fermer')}</span>
        </div>
      </div>
    </div>
  )
}

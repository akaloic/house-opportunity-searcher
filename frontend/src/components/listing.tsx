import { MapPin, Train, Star, Clock } from 'lucide-react'
import type { Listing } from '../types'
import { fmtEur, fmtAgo, decotePct, economyEur } from '../lib/format'
import { ScoreGauge } from './charts'
import { Badge, Delta } from './ui'

function MediaPlaceholder() {
  return (
    <>
      <div className="feat-media-grid" />
      <MapPin size={24} color="var(--text-disabled)" />
    </>
  )
}

/* ---------------- Carte opportunité (grille visuelle) ---------------- */
export function OppCard({ l, onOpen, fav, onToggleFav }: {
  l: Listing; onOpen: (l: Listing) => void; fav: boolean; onToggleFav: (id: string) => void
}) {
  const dec = decotePct(l)
  const eco = economyEur(l)
  return (
    <div className="card card-hover opp" onClick={() => onOpen(l)}>
      <div className="opp-media">
        {l.photoUrls[0]
          ? <img src={l.photoUrls[0]} alt="" referrerPolicy="no-referrer" loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
          : <MediaPlaceholder />}
        <div style={{ position: 'absolute', top: 11, left: 11, zIndex: 2 }}>
          {l.score >= 80 ? <Badge tone="gold" dot>Pépite</Badge> : dec > 0 ? <Badge tone="brand">−{dec.toFixed(0)}%</Badge> : <Badge tone="neutral">{l.source}</Badge>}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav(l.id) }}
          aria-label="Suivre" title={fav ? 'Suivi' : 'Suivre'}
          style={{ position: 'absolute', top: 9, right: 9, zIndex: 2, width: 30, height: 30, borderRadius: 9, border: '1px solid var(--border-default)', background: 'rgba(6,7,14,0.6)', backdropFilter: 'blur(8px)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
        >
          <Star size={15} color={fav ? 'var(--gold-400)' : 'var(--text-muted)'} fill={fav ? 'var(--gold-400)' : 'none'} />
        </button>
      </div>
      <div className="opp-body">
        <div className="opp-title">{l.title}</div>
        <div className="opp-meta">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{l.quartier}</span>
          {l.metro[0] && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Train size={12} />{l.metro[0].min} min</span>}
          <span style={{ color: 'var(--text-faint)' }}>· {l.surface} m²</span>
        </div>
        <div className="opp-foot">
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{fmtEur(l.price)} €</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 3 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>{fmtEur(l.ppm2)} €/m²</span>
              {dec > 0 && <Delta value={dec} invert />}
            </div>
          </div>
          <ScoreGauge value={l.score} size={48} thickness={5} />
        </div>
        {eco > 0 && (
          <div style={{ fontSize: 11, color: 'var(--success-500)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Clock size={11} />≈ {fmtEur(eco)} € sous le marché estimé
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------- Ligne de flux (liste compacte) ---------------- */
export function FeedRow({ l, active, onOpen, fav }: { l: Listing; active?: boolean; onOpen: (l: Listing) => void; fav?: boolean }) {
  const dec = decotePct(l)
  return (
    <button className={`feed-row${active ? ' active' : ''}`} onClick={() => onOpen(l)}>
      <ScoreGauge value={l.score} size={44} thickness={5} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</span>
          {l.score >= 80 && <Badge tone="gold" dot>Pépite</Badge>}
          {fav && <Star size={12} color="var(--gold-400)" fill="var(--gold-400)" />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><MapPin size={12} />{l.quartier}</span>
          {l.metro[0] && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Train size={12} />{l.metro[0].min} min</span>}
          <span style={{ color: 'var(--text-faint)' }}>· {fmtAgo(l.freshMin)}</span>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{fmtEur(l.price)} €</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginTop: 2 }}>
          <span style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>{fmtEur(l.ppm2)} €/m²</span>
          {dec > 0 && <Delta value={dec} invert />}
        </div>
      </div>
    </button>
  )
}

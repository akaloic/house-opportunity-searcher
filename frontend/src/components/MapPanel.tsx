import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Listing } from '../types'
import { scoreColor } from '../lib/format'

function markerIcon(score: number, selected: boolean): L.DivIcon {
  const color = scoreColor(score)
  const s = selected ? 40 : 32
  const shadow = selected ? `0 0 0 4px ${color}33, 0 0 18px ${color}` : `0 0 10px ${color}66`
  return L.divIcon({
    className: '',
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
    html: `<div style="width:${s}px;height:${s}px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(6,7,14,0.9);border:2px solid ${color};color:${color};font:700 ${selected ? 13 : 12}px 'JetBrains Mono',monospace;box-shadow:${shadow};">${Math.round(score)}</div>`,
  })
}

// Recadre la carte sur l'ensemble des biens à chaque changement de liste.
function FitBounds({ listings }: { listings: Listing[] }) {
  const map = useMap()
  useEffect(() => {
    let cancelled = false
    const pts = listings.filter((l) => l.lat != null && l.lon != null).map((l) => [l.lat as number, l.lon as number] as [number, number])
    if (pts.length === 0) return
    try {
      map.fitBounds(pts, { padding: [44, 44], maxZoom: 14, animate: false })
    } catch {
      /* bounds invalides : on ignore */
    }
    // invalidateSize après layout — protégé contre un démontage entre-temps.
    const t = setTimeout(() => {
      if (cancelled) return
      try { map.invalidateSize() } catch { /* carte démontée */ }
    }, 200)
    return () => { cancelled = true; clearTimeout(t) }
  }, [listings, map])
  return null
}

export default function MapPanel({
  listings, selectedId, onSelect, height = 480,
}: { listings: Listing[]; selectedId?: string; onSelect: (l: Listing) => void; height?: number | string }) {
  const pts = listings.filter((l) => l.lat != null && l.lon != null)
  return (
    <div style={{ position: 'relative', height, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-sunken)' }}>
      <MapContainer
        center={[48.892, 2.238]} zoom={12} zoomControl={false} attributionControl
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd" maxZoom={19} attribution="© OpenStreetMap · © CARTO"
        />
        {pts.map((l) => (
          <Marker
            key={l.id}
            position={[l.lat as number, l.lon as number]}
            icon={markerIcon(l.score, l.id === selectedId)}
            zIndexOffset={l.id === selectedId ? 1000 : Math.round(l.score) * 2}
            eventHandlers={{ click: () => onSelect(l) }}
          />
        ))}
        <FitBounds listings={pts} />
      </MapContainer>
    </div>
  )
}

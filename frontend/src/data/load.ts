import { useEffect, useState } from 'react'
import type { PepiteData } from '../types'
import { DEMO_DATA } from './demo'

// Charge les données réelles générées par le pipeline (`chasseur export-web`)
// déposées dans public/data.live.json. À défaut (dev local, fetch KO, ou
// fichier absent), retombe sur le jeu de démonstration embarqué.
export function useData(): { data: PepiteData; live: boolean; loading: boolean } {
  const [data, setData] = useState<PepiteData>(DEMO_DATA)
  const [live, setLive] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const url = `${import.meta.env.BASE_URL}data.live.json`
    fetch(url, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json: PepiteData) => {
        if (cancelled) return
        if (json && Array.isArray(json.LISTINGS) && json.LISTINGS.length > 0) {
          setData(json)
          setLive(true)
        }
      })
      .catch(() => {
        /* silencieux : on garde la démo embarquée */
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { data, live, loading }
}

// ---- Favoris persistants (localStorage) ----
const FAV_KEY = 'pepite_favs'

function loadFavs(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

export function useFavorites() {
  const [favs, setFavs] = useState<Set<string>>(loadFavs)

  const toggle = (id: string) => {
    setFavs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(next)))
      } catch {
        /* quota / mode privé : on ignore */
      }
      return next
    })
  }

  return { favs, has: (id: string) => favs.has(id), toggle, count: favs.size }
}

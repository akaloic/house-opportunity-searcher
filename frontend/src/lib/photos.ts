// Photos de repli déterministes : les fixtures démo du pipeline n'ont pas de
// vraies images (photoUrls vide ou GIF 1×1). On garantit un visuel cohérent
// partout en piochant dans un pool libre (Unsplash), indexé par l'id du bien.

const P = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`

const POOL = [
  P('photo-1502672260266-1c1ef2d93688'),
  P('photo-1493809842364-78817add7ffb'),
  P('photo-1567496898669-ee935f5f647a'),
  P('photo-1554995207-c18c203602cb'),
  P('photo-1556912173-3bb406ef7e77'),
  P('photo-1484154218962-a197022b5858'),
  P('photo-1505691938895-1758d7feb511'),
  P('photo-1522708323590-d24dbb6b0267'),
  P('photo-1560185007-cde436f6a4d0'),
  P('photo-1560448204-e02f11c3d0e2'),
  P('photo-1565182999561-18d7dc61c393'),
]

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

// Vraies photos si présentes (hors data-URI placeholder), sinon repli stable.
export function photosFor(listing: { id: string; photoUrls?: string[] }, count = 4): string[] {
  const real = (listing.photoUrls || []).filter((u) => u && !u.startsWith('data:'))
  if (real.length > 0) return real
  const h = hash(listing.id)
  return Array.from({ length: count }, (_, i) => POOL[(h + i) % POOL.length])
}

export const coverFor = (listing: { id: string; photoUrls?: string[] }): string =>
  photosFor(listing, 1)[0]

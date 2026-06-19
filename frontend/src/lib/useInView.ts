import { useEffect, useRef, useState } from 'react'

// Vrai dès que l'élément référencé entre dans le viewport (une fois, par défaut).
// Sert à déclencher compteurs, jauges et tracés de courbe au scroll.
export function useInView<T extends Element>(opts?: {
  rootMargin?: string
  threshold?: number
  once?: boolean
}) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const once = opts?.once ?? true
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true)
            if (once) obs.disconnect()
          } else if (!once) {
            setInView(false)
          }
        }
      },
      { rootMargin: opts?.rootMargin ?? '0px 0px -10% 0px', threshold: opts?.threshold ?? 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { ref, inView }
}

// Observe tous les `.anim` descendants d'un conteneur et leur ajoute `.in`
// lorsqu'ils entrent dans le viewport → l'animation CSS fade-up se déclenche au scroll.
export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const els = Array.from(root.querySelectorAll<HTMLElement>('.anim'))
    if (els.length === 0) return
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((e) => e.classList.add('in'))
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            obs.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    els.forEach((e) => obs.observe(e))
    return () => obs.disconnect()
  }, [])
  return ref
}

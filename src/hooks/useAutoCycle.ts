import { useCallback, useEffect, useState, type RefObject } from 'react'
import { useInView } from './useInView'

/**
 * Selected index that advances on its own while `ref` is on screen, until the
 * visitor picks an item themselves. No auto-advance with reduced motion.
 */
export function useAutoCycle(count: number, ref: RefObject<Element | null>, ms = 3200) {
  const [index, setIndex] = useState(0)
  const [touched, setTouched] = useState(false)
  const inView = useInView(ref, { threshold: 0.35 })

  // `touched` is state so the running interval is cleared the moment the visitor picks.
  useEffect(() => {
    if (!inView || touched || count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setIndex((i) => (i + 1) % count), ms)
    return () => clearInterval(t)
  }, [inView, touched, count, ms])

  const select = useCallback((i: number) => {
    setTouched(true)
    setIndex(i)
  }, [])

  return { index, select, inView }
}

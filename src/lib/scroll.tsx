import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import { useLocation, useNavigationType } from 'react-router'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

type ScrollApi = {
  /** Smoothly scroll to an element id on the current page (or 'top'). */
  scrollTo: (target: string, opts?: { immediate?: boolean }) => void
  /** Smoothly scroll to an absolute page offset. */
  scrollToY: (y: number) => void
  stop: () => void
  start: () => void
}

const ScrollContext = createContext<ScrollApi | null>(null)
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function ScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const { pathname, hash, key } = useLocation()
  const navType = useNavigationType()
  // Scroll positions per history entry, for browser back/forward.
  const positions = useRef(new Map<string, number>())
  const keyRef = useRef(key)

  useEffect(() => {
    let raf = 0
    const save = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => positions.current.set(keyRef.current, window.scrollY))
    }
    window.addEventListener('scroll', save, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', save)
    }
  }, [])

  useEffect(() => {
    if (reducedMotion()) return
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const api = useMemo<ScrollApi>(
    () => ({
      scrollTo(target, opts) {
        const el = target === 'top' ? null : document.getElementById(target)
        if (target !== 'top' && !el) return
        const lenis = lenisRef.current
        if (lenis) {
          // Lenis honours each element's `scroll-margin-top` (header height).
          lenis.scrollTo(el ?? 0, { immediate: opts?.immediate, duration: 1.3 })
        } else if (el) {
          el.scrollIntoView({ behavior: reducedMotion() || opts?.immediate ? 'auto' : 'smooth' })
        } else {
          window.scrollTo({ top: 0, behavior: reducedMotion() || opts?.immediate ? 'auto' : 'smooth' })
        }
        if (el) {
          if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
          el.focus({ preventScroll: true })
        }
      },
      scrollToY(y) {
        const lenis = lenisRef.current
        if (lenis) lenis.scrollTo(y, { duration: 0.9 })
        else window.scrollTo({ top: y, behavior: reducedMotion() ? 'auto' : 'smooth' })
      },
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
    }),
    [],
  )

  const prevPath = useRef<string | null>(null)

  // New page: jump to the top (or to the hash target, or — on back/forward —
  // to the remembered position) and re-measure triggers.
  // Same page, new hash (e.g. an in-page "#apply" link): scroll smoothly to it.
  useLayoutEffect(() => {
    history.scrollRestoration = 'manual'
    keyRef.current = key
    const id = decodeURIComponent(hash.slice(1))
    const samePage = prevPath.current === pathname
    prevPath.current = pathname

    if (samePage) {
      if (id) api.scrollTo(id)
      return
    }

    const saved = navType === 'POP' ? positions.current.get(key) : undefined
    lenisRef.current?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
    let t: ReturnType<typeof setTimeout> | undefined
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      // Give lazily loaded page content a moment before jumping.
      if (saved !== undefined)
        t = setTimeout(() => {
          ScrollTrigger.refresh()
          if (lenisRef.current) lenisRef.current.scrollTo(saved, { immediate: true, force: true })
          else window.scrollTo(0, saved)
        }, 180)
      else if (id) {
        // Lazily loaded pages may not have rendered the target yet: wait for it,
        // then correct once more after late layout (fonts, line splitting).
        let tries = 0
        const attempt = () => {
          if (document.getElementById(id)) {
            ScrollTrigger.refresh()
            api.scrollTo(id, { immediate: true })
            t = setTimeout(() => api.scrollTo(id, { immediate: true }), 450)
          } else if (tries++ < 40) t = setTimeout(attempt, 75)
        }
        t = setTimeout(attempt, 120)
      }
    })
    return () => {
      cancelAnimationFrame(raf)
      if (t) clearTimeout(t)
    }
  }, [pathname, hash, key, navType, api])

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>
}

export function useScroll() {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useScroll must be used inside <ScrollProvider>')
  return ctx
}

import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { Logo } from '@/components/ui/Logo'
import { gsap } from '@/lib/gsap'

/**
 * Page transition: on each route change an ivory curtain (with the Z mark and a
 * bronze hairline) lifts away to reveal the new page. Not shown on first load,
 * on hash/query-only changes, or with reduced motion.
 */
export function RouteCurtain() {
  const { pathname } = useLocation()
  const ref = useRef<HTMLDivElement>(null)
  const first = useRef(true)

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current!
    const tl = gsap.timeline()
    tl.set(el, { autoAlpha: 1, yPercent: 0 })
      .fromTo(el.querySelector('[data-mark]'), { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: 0.9, duration: 0.35, ease: 'power2.in' }, 0.05)
      .to(el, { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, 0.12)
      .set(el, { autoAlpha: 0 })
    return () => {
      tl.kill()
      gsap.set(el, { autoAlpha: 0 })
    }
  }, [pathname])

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none invisible fixed inset-0 z-[80] grid place-items-center bg-canvas">
      <div data-mark className="w-16">
        <Logo variant="mark" alt="" />
      </div>
      <span className="absolute inset-x-0 bottom-0 h-px bg-accent" />
    </div>
  )
}

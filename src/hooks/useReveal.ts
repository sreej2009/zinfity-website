import type { RefObject } from 'react'
import { gsap, MOTION, ScrollTrigger, useGSAP } from '@/lib/gsap'

/**
 * Scroll-triggered reveal for every `[data-reveal]` element inside `scope`.
 * Elements are batched so siblings entering together stagger naturally.
 * Under reduced motion nothing is hidden or animated.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', scope.current)
        if (!items.length) return
        gsap.set(items, { autoAlpha: 0, y: 28 })
        ScrollTrigger.batch(items, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out', overwrite: true }),
        })
      })
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  )
}

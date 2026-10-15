import type { RefObject } from 'react'
import { gsap, MOTION, SplitText, useGSAP } from '@/lib/gsap'

/** Line-by-line masked reveal for a page's opening headline. */
export function useHeadlineReveal(ref: RefObject<HTMLElement | null>, opts: { delay?: number; deps?: unknown[] } = {}) {
  useGSAP(
    () => {
      if (!ref.current) return
      gsap.matchMedia().add(MOTION, () => {
        const split = SplitText.create(ref.current!, { type: 'lines', mask: 'lines', linesClass: 'split-line' })
        gsap.from(split.lines, { yPercent: 112, duration: 1.4, stagger: 0.09, delay: opts.delay ?? 0.35, ease: 'expo.out' })
        return () => split.revert()
      })
    },
    { dependencies: opts.deps ?? [], revertOnUpdate: true },
  )
}

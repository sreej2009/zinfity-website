import { useRef, useState } from 'react'
import { processSteps } from '@/content/process'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { gsap, MOTION, ScrollTrigger, useGSAP } from '@/lib/gsap'

/** Full process story: sticky rolling step number + scrubbed progress line. */
export function ApproachTimeline() {
  const root = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const steps = gsap.utils.toArray<HTMLElement>('[data-step]', listRef.current)
      if (isDesktop) {
        steps.forEach((step, i) =>
          ScrollTrigger.create({ trigger: step, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => self.isActive && setActive(i) }),
        )
      }
      gsap.matchMedia().add(MOTION, () => {
        gsap.fromTo(
          '[data-progress]',
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: listRef.current, start: 'top 55%', end: 'bottom 55%', scrub: true } },
        )
        steps.forEach((step) =>
          gsap.from(step.querySelectorAll('[data-step-in]'), {
            autoAlpha: 0,
            y: 34,
            duration: 1.3,
            stagger: 0.08,
            scrollTrigger: { trigger: step, start: 'top 80%', once: true },
          }),
        )
      })
    },
    { dependencies: [isDesktop], scope: root, revertOnUpdate: true },
  )

  const current = processSteps[active]

  return (
    <div ref={root} className="grid gap-x-16 lg:grid-cols-12">
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-[22vh]">
          <div className="flex items-start gap-8">
            <div className="relative h-[clamp(9rem,15vw,15rem)] overflow-hidden font-medium leading-none tracking-[-0.06em] text-[clamp(9rem,15vw,15rem)]" aria-hidden="true">
              {/* Gradient text lives on the moving wrapper: Chrome skips painting
                  background-clip:text on children of a transformed parent. */}
              <div
                className="metal-text transition-transform duration-[1.1s] ease-[var(--ease-in-out-quart)]"
                style={{ transform: `translateY(-${(active * 100) / processSteps.length}%)` }}
              >
                {processSteps.map((s) => (
                  <div key={s.index} className="h-[clamp(9rem,15vw,15rem)]">
                    {s.index}
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4">
              <p className="eyebrow text-subtle">Stage</p>
              <p className="mt-3 text-2xl font-medium tracking-[-0.02em]" aria-live="polite">
                {current.title}
              </p>
            </div>
          </div>
          <ol className="mt-12 flex gap-2" aria-hidden="true">
            {processSteps.map((s, i) => (
              <li
                key={s.index}
                className={`eyebrow rounded-full border px-3 py-2 transition-colors duration-500 ${
                  i === active ? 'border-accent-ink text-accent-ink' : i < active ? 'border-line-strong text-muted' : 'border-line text-subtle'
                }`}
              >
                {s.index}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ol ref={listRef} className="relative lg:col-span-7">
        <span aria-hidden="true" className="absolute bottom-0 left-[0.3rem] top-0 w-px bg-line lg:left-0" />
        <span aria-hidden="true" data-progress className="absolute bottom-0 left-[0.3rem] top-0 w-px origin-top bg-gradient-to-b from-accent to-accent-ink lg:left-0" />
        {processSteps.map((s, i) => (
          <li
            key={s.index}
            data-step
            className={`relative pb-20 pl-10 transition-opacity duration-700 last:pb-0 sm:pl-14 lg:flex lg:min-h-[62vh] lg:flex-col lg:justify-center lg:pb-0 lg:pl-20 ${
              isDesktop && i !== active ? 'lg:opacity-40' : ''
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute left-0 top-2 h-[0.7rem] w-[0.7rem] rounded-full border transition-colors duration-500 lg:top-1/2 lg:-ml-[0.3rem] lg:-translate-y-1/2 ${
                !isDesktop || i <= active ? 'border-accent-ink bg-accent' : 'border-line-strong bg-canvas'
              }`}
            />
            <p data-step-in className="eyebrow text-accent-ink">
              {s.index} —
            </p>
            <h3 data-step-in className="mt-5 text-[clamp(2.2rem,4.4vw,4.25rem)] font-medium leading-none tracking-[-0.04em]">
              {s.title}
            </h3>
            <p data-step-in className="text-lede mt-6 max-w-xl text-muted">
              {s.summary}
            </p>
            <ul data-step-in className="mt-7 flex flex-wrap gap-2" aria-label={`${s.title} activities`}>
              {s.activities.map((a) => (
                <li key={a} className="chip">
                  {a}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}

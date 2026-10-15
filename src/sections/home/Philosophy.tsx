import { useRef } from 'react'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'
import { ArrowLink } from '@/components/blocks/ArrowLink'

const line = 'How it looks and how it works are one decision. We make both — together.'

/** Home: a single brand-philosophy line. The full philosophy lives on /about. */
export function Philosophy() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.fromTo(
          '[data-w]',
          { opacity: 0.12, yPercent: 30 },
          { opacity: 1, yPercent: 0, stagger: 0.06, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'center 45%', scrub: true } },
        )
      })
    },
    { scope: root },
  )
  return (
    <section ref={root} aria-label="Our philosophy" className="container-x py-28 lg:py-44">
      <p className="mx-auto max-w-6xl text-center text-[clamp(2rem,5.4vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.045em]">
        {line.split(' ').map((w, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <span data-w className={`inline-block ${w === 'one' || w === 'together.' ? 'serif-accent metal-text pr-[0.05em]' : ''}`}>
              {w}&nbsp;
            </span>
          </span>
        ))}
      </p>
      <div className="mt-12 flex justify-center">
        <ArrowLink to="/about">How we think and work</ArrowLink>
      </div>
    </section>
  )
}

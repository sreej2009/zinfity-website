import { useRef } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { Magnetic } from '@/components/ui/Magnetic'
import { gsap, MOTION, SplitText, useGSAP } from '@/lib/gsap'

/** Home closing: oversized question + a magnetic circular call to action. */
export function HomeClosing() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const split = SplitText.create('[data-close-title]', { type: 'lines', mask: 'lines', linesClass: 'split-line' })
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } })
          .from(split.lines, { yPercent: 110, duration: 1.4, stagger: 0.1 })
          .from('[data-orb]', { scale: 0.4, autoAlpha: 0, duration: 1.4, ease: 'back.out(1.6)' }, 0.3)
        return () => split.revert()
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="closing-title" className="relative overflow-hidden border-t border-line py-24 lg:py-40">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <h2 id="closing-title" data-close-title className="text-[clamp(3rem,9vw,9.5rem)] font-medium leading-[0.9] tracking-[-0.055em] lg:col-span-9">
          Have something <span className="serif-accent metal-text">worth</span> building?
        </h2>
        <div className="flex items-center gap-8 lg:col-span-3 lg:flex-col lg:items-end">
          <Magnetic>
            <Link
              data-orb
              to="/contact"
              className="group relative grid h-36 w-36 place-items-center overflow-hidden rounded-full bg-fg text-canvas lg:h-44 lg:w-44"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 translate-y-full rounded-full bg-[linear-gradient(100deg,#e8cfae,#c79b69,#dcb88f)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
              />
              <span className="relative flex flex-col items-center gap-2 text-[0.95rem] font-medium transition-colors duration-500 group-hover:text-[#171717]">
                <ArrowUpRight size={22} aria-hidden="true" />
                Start a project
              </span>
            </Link>
          </Magnetic>
          <Link to="/services" className="link-draw text-[0.94rem] text-muted hover:text-fg">
            or browse services
          </Link>
        </div>
      </div>
    </section>
  )
}

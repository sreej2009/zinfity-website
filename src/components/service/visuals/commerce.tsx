import { useRef } from 'react'
import { CreditCard, Eye, Package, Repeat, Search, type LucideIcon } from 'lucide-react'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

const stageIcons: LucideIcon[] = [Search, Eye, CreditCard, Package, Repeat]

/* ------------------------------------------------------------------ */
/*  Customer journey: stations along a path that draws as you scroll    */
/* ------------------------------------------------------------------ */
export function JourneyPath({ steps }: { steps: { name: string; body: string }[] }) {
  const root = useRef<HTMLOListElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const st = { trigger: root.current, start: 'top 75%', end: 'center 45%', scrub: 0.6 }
        gsap.fromTo('[data-journey-line]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: st })
        gsap.fromTo('[data-journey-fill]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: st })
        gsap.from('[data-station]', { scale: 0.4, autoAlpha: 0, duration: 0.7, stagger: 0.12, ease: 'back.out(1.8)', scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
      })
    },
    { scope: root },
  )
  const n = steps.length
  // Gentle wave through the station centres (desktop)
  const xs = steps.map((_, i) => ((i + 0.5) / n) * 1000)
  const d = xs.reduce((acc, x, i) => (i ? `${acc} S ${x - 1000 / n / 2} ${i % 2 ? 10 : 50} ${x} 30` : `M ${x} 30`), '')

  return (
    <ol ref={root} className="relative mt-14 grid gap-10 md:grid-cols-5 md:gap-6">
      <svg aria-hidden="true" viewBox="0 0 1000 60" preserveAspectRatio="none" className="absolute inset-x-0 top-0 hidden h-14 w-full md:block">
        <path d={d} fill="none" stroke="rgb(237 233 227 / 0.14)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <path data-journey-line d={d} fill="none" stroke="#c79b69" strokeWidth="1.5" pathLength={1} strokeDasharray="1" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* Vertical line on small screens */}
      <span aria-hidden="true" className="absolute bottom-4 left-[1.45rem] top-4 w-px bg-line md:hidden" />
      <span aria-hidden="true" data-journey-fill className="absolute bottom-4 left-[1.45rem] top-4 w-px origin-top bg-accent md:hidden" />
      {steps.map((s, i) => {
        const Icon = stageIcons[i] ?? Package
        return (
          <li key={s.name} className="relative grid grid-cols-[3rem_1fr] gap-5 md:block md:pt-0">
            <span data-station className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-accent/60 bg-canvas text-accent md:mx-auto md:mt-1">
              <Icon size={18} aria-hidden="true" />
            </span>
            <div className="md:mt-6 md:text-center">
              <p className="font-mono text-[0.72rem] text-accent">0{i + 1}</p>
              <h3 className="mt-1.5 text-xl font-medium">{s.name}</h3>
              <p className="mt-2 text-[0.94rem] leading-relaxed text-muted">{s.body}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

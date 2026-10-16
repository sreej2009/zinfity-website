import { useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import { useAutoCycle } from '@/hooks/useAutoCycle'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

/* ------------------------------------------------------------------ */
/*  Responsible AI: safeguards drawn as rings around the decision       */
/* ------------------------------------------------------------------ */
export function SafeguardRings({ items }: { items: { icon: LucideIcon; title: string; body: string }[] }) {
  const root = useRef<HTMLDivElement>(null)
  const { index, select, inView } = useAutoCycle(items.length, root, 3200)
  const radii = [44, 33, 22]

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.fromTo(
          '[data-ring]',
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.6, stagger: 0.25, ease: 'power2.inOut', scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } },
        )
        gsap.to('[data-orbit]', { rotate: 360, duration: (i: number) => 24 + i * 10, repeat: -1, ease: 'none', transformOrigin: '50% 50%' })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={`grid items-center gap-12 lg:grid-cols-12 ${inView ? '' : 'is-paused'}`}>
      <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[22rem] overflow-hidden lg:col-span-5 lg:max-w-[26rem]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90 overflow-visible">
          {radii.map((r, i) => (
            <g key={r}>
              <circle cx="50" cy="50" r={r} fill="none" stroke="rgb(237 233 227 / 0.1)" strokeWidth="0.4" />
              <circle
                data-ring
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke={i === index ? '#e8cfae' : 'rgb(199 155 105 / 0.45)'}
                strokeWidth={i === index ? 1.4 : 0.6}
                pathLength={1}
                strokeDasharray="1"
                style={{ transition: 'stroke .6s, stroke-width .6s' }}
              />
            </g>
          ))}
        </svg>
        {/* A marker orbiting each ring: the safeguard is always running */}
        {radii.map((r, i) => (
          <div key={r} data-orbit className="absolute inset-0">
            <span
              className={`absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-500 ${i === index ? 'bg-[#e8cfae] shadow-[0_0_12px_#c79b69]' : 'bg-accent/50'}`}
              style={{ top: `${50 - r}%` }}
            />
          </div>
        ))}
        {/* Ring labels */}
        {items.map((it, i) => (
          <span
            key={it.title}
            className={`absolute left-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border bg-canvas transition-colors duration-500 ${i === index ? 'border-accent text-accent' : 'border-line text-subtle'}`}
            style={{ top: `${50 + radii[i]}%` }}
          >
            <it.icon size={14} strokeWidth={1.75} />
          </span>
        ))}
        <div className="absolute left-1/2 top-1/2 grid h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(closest-side,rgb(199_155_105/0.28),transparent)] text-center">
          <span className="text-[0.7rem] leading-tight text-fg sm:text-[0.8rem]">
            Your data
            <br />& decisions
          </span>
        </div>
      </div>

      <ul className="space-y-3 lg:col-span-6 lg:col-start-7">
        {items.map((r, i) => (
          <li key={r.title}>
            <button
              type="button"
              onClick={() => select(i)}
              onMouseEnter={() => select(i)}
              aria-pressed={i === index}
              className={`flex w-full gap-5 rounded-2xl border p-6 text-left transition-[border-color,background] duration-500 ${i === index ? 'border-accent/60 bg-surface' : 'border-line hover:border-line-strong'}`}
            >
              <r.icon size={22} strokeWidth={1.5} className={`mt-0.5 shrink-0 transition-colors ${i === index ? 'text-accent' : 'text-subtle'}`} aria-hidden="true" />
              <span>
                <span className="block text-xl font-medium">{r.title}</span>
                <span className="mt-2 block leading-relaxed text-muted">{r.body}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

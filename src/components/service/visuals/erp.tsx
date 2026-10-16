import { useRef } from 'react'
import { useAutoCycle } from '@/hooks/useAutoCycle'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

/** What happens to one illustrative order as it reaches each module. */
const orderEvents = ['Quote accepted', 'Stock reserved', 'Reorder raised', 'Invoice issued', 'Install visit booked', 'Approved by sales lead']

/* ------------------------------------------------------------------ */
/*  Module network: one order travelling between connected modules     */
/* ------------------------------------------------------------------ */
export function ModuleNetwork({ modules, integrations }: { modules: { name: string; body: string }[]; integrations: string[] }) {
  const root = useRef<HTMLDivElement>(null)
  const { index, select, inView } = useAutoCycle(modules.length, root, 2600)
  const pos = modules.map((_, i) => {
    const a = ((-90 + (i * 360) / modules.length) * Math.PI) / 180
    return { x: 50 + Math.cos(a) * 38, y: 50 + Math.sin(a) * 38 }
  })
  const active = modules[index]

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const st = { trigger: root.current, start: 'top 75%', once: true }
        gsap.from('[data-node]', { scale: 0.6, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'back.out(1.6)', scrollTrigger: st })
        gsap.fromTo('[data-spoke]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: 0.06, delay: 0.2, ease: 'power2.inOut', scrollTrigger: st })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={`grid items-center gap-12 lg:grid-cols-12 ${inView ? '' : 'is-paused'}`}>
      {/* Network diagram */}
      <div className="relative mx-auto aspect-square w-full max-w-[30rem] lg:col-span-7">
        <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
          <circle cx="50" cy="50" r="38" fill="none" stroke="rgb(140 94 52 / 0.3)" strokeWidth="0.3" strokeDasharray="1 1.2" />
          {pos.map((p, i) => (
            <g key={i}>
              <line
                data-spoke
                x1="50"
                y1="50"
                x2={p.x}
                y2={p.y}
                pathLength={1}
                strokeDasharray="1"
                stroke={i === index ? '#8c5e34' : 'rgb(140 94 52 / 0.25)'}
                strokeWidth={i === index ? 0.6 : 0.35}
                style={{ transition: 'stroke .5s' }}
              />
              {i === index && <line x1="50" y1="50" x2={p.x} y2={p.y} pathLength={1} stroke="#c79b69" strokeWidth="1.1" strokeLinecap="round" className="flow-dash" />}
            </g>
          ))}
        </svg>

        {/* Core record */}
        <div className="absolute left-1/2 top-1/2 grid h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-fg bg-surface text-center shadow-[0_30px_50px_-30px_rgb(58_42_29/0.6)]">
          <span>
            <span className="block font-mono text-[0.6rem] uppercase tracking-[0.14em] text-accent-ink">One record</span>
            <span className="mt-1 block text-[0.78rem] font-medium leading-tight">Order #1042</span>
          </span>
        </div>

        {/* Travelling order token */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_6px_rgb(199_155_105/0.25)] transition-[left,top] duration-[900ms] ease-[var(--ease-out-expo)]"
          style={{ left: `${pos[index].x}%`, top: `${pos[index].y - 9}%` }}
        />

        {modules.map((m, i) => (
          <button
            key={m.name}
            type="button"
            data-node
            onClick={() => select(i)}
            onMouseEnter={() => select(i)}
            aria-pressed={i === index}
            className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[0.74rem] font-medium transition-[background,border-color,color,box-shadow] duration-500 sm:px-4 sm:text-[0.85rem] ${
              i === index ? 'border-fg bg-fg text-canvas shadow-[0_18px_30px_-16px_rgb(23_23_23/0.6)]' : 'border-line-strong bg-surface hover:border-fg'
            }`}
            style={{ left: `${pos[i].x}%`, top: `${pos[i].y}%` }}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Detail for the active module */}
      <div className="lg:col-span-5" aria-live="polite">
        <p className="font-mono text-[0.72rem] text-accent-ink">
          Module 0{index + 1} / 0{modules.length}
        </p>
        <h3 key={active.name} className="mt-3 animate-[fade_.6s_ease_forwards] text-[clamp(1.8rem,2.6vw,2.4rem)] font-medium tracking-[-0.03em] opacity-0 motion-reduce:opacity-100">
          {active.name}
        </h3>
        <p className="mt-3 text-lg leading-relaxed text-muted">{active.body}</p>
        {orderEvents[index] && (
          <p className="mt-6 inline-flex items-center gap-3 rounded-full border border-line bg-canvas-alt px-4 py-2 text-[0.85rem]">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
            Order #1042 · {orderEvents[index]}
          </p>
        )}
        <div className="mt-10 border-t border-line pt-6">
          <p className="eyebrow text-accent-ink">Integrates with</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {integrations.map((x) => (
              <li key={x} className="chip">
                {x}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-[0.8rem] text-subtle">Illustrative order and module flow — your modules are configured around your own processes.</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Capabilities: implementation phases on a filling track              */
/* ------------------------------------------------------------------ */
export function PhaseTrack({ groups }: { groups: { group: string; items: string[] }[] }) {
  const root = useRef<HTMLOListElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
        tl.fromTo('[data-track-fill]', { scale: 0 }, { scale: 1, duration: 1.6, ease: 'power2.inOut' })
          .from('[data-station]', { scale: 0, duration: 0.5, stagger: 0.45, ease: 'back.out(2)' }, 0.1)
          .from('[data-phase-item]', { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.08 }, 0.4)
      })
    },
    { scope: root },
  )
  return (
    <ol ref={root} className="relative grid gap-10 md:grid-cols-3 md:gap-8">
      <span aria-hidden="true" className="absolute bottom-0 left-[0.6rem] top-0 w-px bg-line md:bottom-auto md:left-0 md:right-0 md:top-[0.6rem] md:h-px md:w-auto" />
      <span aria-hidden="true" data-track-fill className="absolute bottom-0 left-[0.6rem] top-0 w-px origin-top bg-accent-ink md:bottom-auto md:left-0 md:right-0 md:top-[0.6rem] md:h-px md:w-auto md:origin-left" />
      {groups.map((g, i) => (
        <li key={g.group} className="relative pl-10 md:pl-0 md:pt-12">
          <span data-station aria-hidden="true" className="absolute left-0 top-0 grid h-5 w-5 place-items-center rounded-full border-2 border-accent-ink bg-canvas">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-ink" />
          </span>
          <p className="font-mono text-[0.72rem] text-accent-ink">Phase 0{i + 1}</p>
          <h3 className="mt-2 text-2xl font-medium tracking-[-0.025em]">{g.group}</h3>
          <ul className="mt-5 space-y-2">
            {g.items.map((x) => (
              <li key={x} data-phase-item className="rounded-lg border border-line bg-surface px-4 py-3 text-[0.95rem]">
                {x}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}

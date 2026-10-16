import { useRef, useState } from 'react'
import { useAutoCycle } from '@/hooks/useAutoCycle'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

/* ------------------------------------------------------------------ */
/*  Platform layers: blueprint slabs that assemble with annotations     */
/* ------------------------------------------------------------------ */
/** Example components shown inside each layer (illustrative). */
const layerParts = [
  ['Web app', 'Mobile app', 'Admin console'],
  ['Workflows', 'Permissions', 'Business rules'],
  ['REST APIs', 'Webhooks', 'Connectors'],
  ['Database', 'Backups', 'Logs & monitoring'],
]

export function BlueprintLayers({ layers }: { layers: { name: string; body: string }[] }) {
  const root = useRef<HTMLOListElement>(null)
  const { index, select } = useAutoCycle(layers.length, root, 2800)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
        tl.from('[data-slab]', { y: -40, autoAlpha: 0, rotateX: -35, duration: 1, stagger: 0.16, ease: 'expo.out' })
          .from('[data-leader]', { scaleX: 0, duration: 0.7, stagger: 0.16, ease: 'power3.out' }, 0.4)
          .from('[data-note]', { autoAlpha: 0, x: 16, duration: 0.8, stagger: 0.16 }, 0.6)
      })
    },
    { scope: root },
  )
  return (
    <ol ref={root} className="relative" style={{ perspective: '1200px' }}>
      {/* Vertical bus connecting the layers */}
      <svg aria-hidden="true" className="absolute left-[1.15rem] top-6 h-[calc(100%-3rem)] w-2 md:left-[calc(20.8%-1px)]" preserveAspectRatio="none" viewBox="0 0 2 100">
        <line x1="1" y1="0" x2="1" y2="100" stroke="rgb(140 94 52 / 0.35)" strokeWidth="2" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
        <line x1="1" y1="0" x2="1" y2="100" stroke="#8c5e34" strokeWidth="2" pathLength={1} className="flow-dash flow-dash--slow" vectorEffect="non-scaling-stroke" />
      </svg>
      {layers.map((l, i) => (
        <li key={l.name} className="relative grid items-center gap-4 py-4 md:grid-cols-12 md:gap-0">
          <div data-slab className="ml-10 md:col-span-5 md:ml-0" style={{ transformOrigin: 'top center' }}>
            <button
              type="button"
              aria-pressed={i === index}
              onClick={() => select(i)}
              onMouseEnter={() => select(i)}
              className={`relative block w-full rounded-lg border bg-white px-5 py-4 text-left transition-[transform,border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] ${
                i === index ? '-translate-y-1 border-solid border-accent-ink shadow-[0_28px_40px_-24px_rgb(140_94_52/0.55)]' : 'border-dashed border-[#8c5e34]/50 shadow-[0_18px_30px_-24px_rgb(58_42_29/0.5)]'
              }`}
            >
              <span aria-hidden="true" className="absolute -left-[1.85rem] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-[#8c5e34] bg-canvas md:hidden" />
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-medium">{l.name}</span>
                <span className="font-mono text-[0.68rem] text-accent-ink">L{i + 1}</span>
              </span>
              {/* Example components inside the layer */}
              <span className="mt-3 flex flex-wrap gap-1.5">
                {(layerParts[i] ?? []).map((part) => (
                  <span
                    key={part}
                    className={`rounded-sm border px-2 py-0.5 font-mono text-[0.62rem] transition-colors duration-500 ${i === index ? 'border-accent-ink/60 bg-accent/15 text-fg' : 'border-[#8c5e34]/30 bg-[#8c5e34]/[0.06] text-subtle'}`}
                  >
                    {part}
                  </span>
                ))}
              </span>
            </button>
          </div>
          <span aria-hidden="true" data-leader className="hidden h-px origin-left items-center md:col-span-2 md:flex">
            <span className="h-px flex-1 border-t border-dashed border-[#8c5e34]/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#8c5e34]" />
          </span>
          <p data-note className={`ml-10 text-[0.95rem] leading-relaxed transition-colors duration-500 md:col-span-5 md:ml-0 md:pl-5 ${i === index ? 'text-fg' : 'text-muted'}`}>
            {l.body}
          </p>
        </li>
      ))}
    </ol>
  )
}

/* ------------------------------------------------------------------ */
/*  Capabilities: connected modules around a platform core              */
/* ------------------------------------------------------------------ */
export function ModuleMap({ groups }: { groups: { group: string; items: string[] }[] }) {
  const root = useRef<HTMLDivElement>(null)
  const [hot, setHot] = useState<number | null>(null)
  const n = groups.length
  // Centre of grid column i (columns separated by a 1.5rem gap)
  const col = (i: number) => `calc(${i} * (100% + 1.5rem) / ${n} + (100% - ${n - 1} * 1.5rem) / ${n * 2})`
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const st = { trigger: root.current, start: 'top 75%', once: true }
        gsap.from('[data-core]', { scale: 0.85, autoAlpha: 0, duration: 0.9, scrollTrigger: st })
        gsap.from('[data-wire-v]', { scaleY: 0, duration: 0.6, stagger: 0.1, delay: 0.3, ease: 'power2.out', scrollTrigger: st })
        gsap.from('[data-wire-h]', { scaleX: 0, duration: 0.8, delay: 0.4, ease: 'power2.inOut', scrollTrigger: st })
        gsap.from('[data-module]', { y: 40, autoAlpha: 0, duration: 1, stagger: 0.14, delay: 0.6, scrollTrigger: st })
      })
    },
    { scope: root },
  )
  return (
    <div ref={root}>
      <div data-core className="mx-auto w-fit rounded-full border border-fg bg-surface px-6 py-2.5 text-center">
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-accent-ink">Core</span>
        <span className="ml-3 font-medium">Your platform</span>
      </div>
      {/* Connectors from the core to each module (desktop) */}
      <div aria-hidden="true" className="relative hidden h-14 lg:block">
        <span data-wire-v className="absolute left-1/2 top-0 h-1/2 w-px origin-top bg-[#8c5e34]/50" />
        <span data-wire-h className="absolute top-1/2 h-px bg-[#8c5e34]/50" style={{ left: col(0), right: `calc(100% - ${col(groups.length - 1)})` }} />
        {groups.map((_, i) => (
          <span
            key={i}
            data-wire-v
            className={`absolute top-1/2 h-1/2 w-px origin-top transition-colors duration-500 ${hot === i ? 'bg-[#8c5e34]' : 'bg-[#8c5e34]/50'}`}
            style={{ left: col(i) }}
          />
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:mt-0 lg:grid-cols-3">
        {groups.map((c, i) => (
          <div
            key={c.group}
            data-module
            onMouseEnter={() => setHot(i)}
            onMouseLeave={() => setHot(null)}
            className={`relative rounded-2xl border bg-surface p-6 transition-[border-color,transform,box-shadow] duration-500 ${
              hot === i ? 'border-fg shadow-[0_30px_50px_-30px_rgb(58_42_29/0.5)] lg:-translate-y-1.5' : 'border-line'
            }`}
          >
            <span aria-hidden="true" className="absolute -top-1.5 left-1/2 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[#8c5e34] bg-canvas lg:block" />
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-accent-ink">Module 0{i + 1}</p>
            <h3 className="mt-2 text-xl font-medium tracking-[-0.02em]">{c.group}</h3>
            <ul className="mt-5 space-y-2.5">
              {c.items.map((x) => (
                <li key={x} className="flex items-center gap-3 text-[0.95rem]">
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-[2px] border border-[#8c5e34]" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Delivery: a rail that fills as you scroll through the steps         */
/* ------------------------------------------------------------------ */
export function ProcessRail({ steps }: { steps: { name: string; body: string }[] }) {
  const root = useRef<HTMLOListElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.fromTo('[data-rail-fill]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 } })
      })
    },
    { scope: root },
  )
  return (
    <ol ref={root} className="relative">
      <span aria-hidden="true" className="absolute bottom-6 left-[1.2rem] top-2 w-px bg-line" />
      <span aria-hidden="true" data-rail-fill className="absolute bottom-6 left-[1.2rem] top-2 w-px origin-top bg-accent-ink" />
      {steps.map((p, i) => (
        <li key={p.name} data-reveal className="relative flex gap-6 pb-10 last:pb-0">
          <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong bg-canvas font-mono text-[0.8rem] text-accent-ink">
            {i + 1}
          </span>
          <div className="pt-1.5">
            <h3 className="text-lg font-medium">{p.name}</h3>
            <p className="mt-1 text-muted">{p.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

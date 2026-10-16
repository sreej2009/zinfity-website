import { useRef, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

type Pair = { title: string; body: string }

/** How each situation is usually resolved (shown when a card is opened). */
const fixes = [
  'One shared system replaces the copies — with roles, history and a single source of truth.',
  'Software shaped around your process, with only the features your teams actually use.',
  'Integrations so information is entered once and flows to every system that needs it.',
  'Modernise in phases: keep what works, replace what holds you back, without a risky big-bang switch.',
]

/* Before → after scene for each situation (decorative). */
function Scene({ i, fixed }: { i: number; fixed: boolean }) {
  const t = 'transition-all duration-700 ease-[var(--ease-out-expo)]'
  if (i === 0)
    // Scattered sheets & mails → one table
    return (
      <div className="relative h-full">
        {[
          [14, 18, -10],
          [42, 10, 6],
          [24, 46, 4],
          [56, 40, -6],
        ].map(([x, y, r], k) => (
          <span
            key={k}
            className={`absolute h-[38%] w-[30%] rounded-md border bg-white p-1.5 shadow-[0_8px_16px_-10px_rgb(58_42_29/0.5)] ${t}`}
            style={
              fixed
                ? { left: '18%', top: `${16 + k * 2}%`, width: '64%', height: '64%', transform: 'none', opacity: k === 3 ? 1 : 0 }
                : { left: `${x}%`, top: `${y}%`, transform: `rotate(${r}deg)`, borderColor: k % 2 ? 'rgb(140 94 52 / 0.4)' : 'rgb(47 122 79 / 0.4)' }
            }
          >
            {fixed && k === 3 ? (
              <span className="grid h-full grid-rows-4 gap-1">
                {[0, 1, 2, 3].map((r2) => (
                  <span key={r2} className="grid grid-cols-3 gap-1">
                    <span className={`rounded-sm ${r2 ? 'bg-[#171717]/10' : 'bg-[#171717]/70'}`} />
                    <span className={`rounded-sm ${r2 ? 'bg-[#171717]/10' : 'bg-[#171717]/70'}`} />
                    <span className={`rounded-sm ${r2 ? 'bg-accent/30' : 'bg-[#171717]/70'}`} />
                  </span>
                ))}
              </span>
            ) : (
              <span className="block space-y-1">
                <span className="block h-1 w-3/4 rounded bg-[#171717]/30" />
                <span className="block h-1 rounded bg-[#171717]/10" />
                <span className="block h-1 w-1/2 rounded bg-[#171717]/10" />
              </span>
            )}
          </span>
        ))}
      </div>
    )
  if (i === 1)
    // Puzzle piece that almost fits → fits
    return (
      <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
        <path d="M20 20 H52 a8 8 0 1 0 16 0 H100 V60 H20 Z" fill="#fff" stroke="rgb(23 23 23 / 0.25)" strokeWidth="1.2" />
        <g className={t} style={{ transform: fixed ? 'translate(0,0) rotate(0)' : 'translate(10px,-14px) rotate(12deg)', transformOrigin: '60px 22px' }}>
          <path d="M52 20 a8 8 0 1 0 16 0" fill={fixed ? '#c79b69' : '#e8cfae'} stroke="#8c5e34" strokeWidth="1.2" />
          {!fixed && <path d="M52 20 H68" stroke="#c4705a" strokeWidth="1.2" strokeDasharray="2 2" />}
        </g>
      </svg>
    )
  if (i === 2)
    // Two systems, broken link → connected flow
    return (
      <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
        {[18, 78].map((x) => (
          <g key={x}>
            <rect x={x} y="24" width="24" height="32" rx="4" fill="#fff" stroke="rgb(23 23 23 / 0.3)" strokeWidth="1.2" />
            <path d={`M${x + 5} 32 h14 M${x + 5} 38 h10 M${x + 5} 44 h12`} stroke="rgb(23 23 23 / 0.2)" strokeWidth="1.5" />
          </g>
        ))}
        {fixed ? (
          <g>
            <path d="M42 40 H78" stroke="rgb(140 94 52 / 0.4)" strokeWidth="1.5" />
            <path d="M42 40 H78" stroke="#8c5e34" strokeWidth="3" strokeLinecap="round" pathLength={1} className="flow-dash" />
          </g>
        ) : (
          <g>
            <path d="M42 40 H54 M66 40 H78" stroke="#c4705a" strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M57 35 L63 45 M63 35 L57 45" stroke="#c4705a" strokeWidth="1.5" />
          </g>
        )}
      </svg>
    )
  // Legacy window → modern panel
  return (
    <div className="relative grid h-full place-items-center">
      <div className={`w-[70%] overflow-hidden rounded-md border ${t} ${fixed ? 'border-line bg-white shadow-[0_14px_24px_-16px_rgb(58_42_29/0.55)]' : 'border-[#7d838c] bg-[#d9dce1]'}`}>
        <div className={`flex items-center gap-1 px-1.5 py-1 ${fixed ? 'bg-canvas-alt' : 'bg-[#4a5a8a]'}`}>
          {fixed ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-[#171717]/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </>
          ) : (
            <span className="font-mono text-[0.45rem] text-white">SYSTEM_v2.exe</span>
          )}
        </div>
        <div className="space-y-1 p-2">
          {fixed ? (
            <>
              <span className="block h-1.5 w-1/2 rounded bg-[#171717]/70" />
              <span className="block h-5 rounded bg-[linear-gradient(135deg,#f0d9bd,#c79b69)]" />
              <span className="block h-1 rounded bg-[#171717]/10" />
            </>
          ) : (
            [0, 1, 2].map((k) => <span key={k} className="block h-2 border border-[#7d838c] bg-white" />)
          )}
        </div>
      </div>
    </div>
  )
}

export function SituationCards({ items }: { items: Pair[] }) {
  const [open, setOpen] = useState<Record<number, boolean>>({})
  return (
    <ol className="grid gap-5 md:grid-cols-2">
      {items.map((p, i) => {
        const fixed = !!open[i]
        return (
          <li key={p.title} data-reveal>
            <button
              type="button"
              aria-expanded={fixed}
              onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}
              onMouseEnter={() => setOpen((o) => ({ ...o, [i]: true }))}
              onMouseLeave={() => setOpen((o) => ({ ...o, [i]: false }))}
              className={`group grid h-full w-full gap-6 rounded-3xl border p-6 text-left transition-[border-color,background,box-shadow] duration-500 sm:grid-cols-[9rem_1fr] sm:p-7 ${
                fixed ? 'border-fg bg-surface shadow-[0_30px_50px_-36px_rgb(58_42_29/0.55)]' : 'border-line bg-canvas/60'
              }`}
            >
              <span aria-hidden="true" className="relative block h-28 overflow-hidden rounded-2xl bg-canvas-alt sm:h-full sm:min-h-[8rem]">
                <Scene i={i} fixed={fixed} />
                <span className={`absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[0.58rem] font-medium transition-colors duration-500 ${fixed ? 'bg-[#e6efe6] text-[#2f5a35]' : 'bg-[#f3e1dc] text-[#8a3b2a]'}`}>
                  {fixed ? 'After' : 'Today'}
                </span>
              </span>
              <span className="flex flex-col">
                <span className="font-mono text-[0.72rem] text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
                <span className="mt-2 font-serif text-[clamp(1.45rem,2vw,1.85rem)] italic leading-snug">“{p.title}.”</span>
                <span className="mt-2 leading-relaxed text-muted">{p.body}</span>
                <span className={`grid transition-[grid-template-rows,opacity] duration-500 ${fixed ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <span className="overflow-hidden">
                    <span className="mt-4 flex gap-2.5 border-t border-line pt-4 text-[0.95rem]">
                      <Check size={16} className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
                      {fixes[i]}
                    </span>
                  </span>
                </span>
                <span className={`mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.82rem] text-accent-ink transition-opacity duration-300 ${fixed ? 'opacity-0' : 'opacity-100'}`}>
                  How we fix it <ArrowRight size={13} aria-hidden="true" />
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

/* ------------------------------------------------------------------ */
/*  Delivery: a phased roadmap drawn as a timeline                      */
/* ------------------------------------------------------------------ */
/** Bar segments per step, in 12 timeline columns: [start, span, label?]. */
const bars: [number, number, string?][][] = [
  [[0, 2]],
  [[1, 3]],
  [
    [3, 3, 'Phase 1'],
    [6, 2, 'Phase 2'],
    [8, 2, 'Phase 3'],
  ],
  [[9, 3]],
]
const deliverables = ['Process map & priorities', 'Architecture & roadmap', 'Working releases', 'Monitoring & improvements']

export function DeliveryRoadmap({ steps }: { steps: { name: string; body: string }[] }) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
        tl.from('[data-bar]', { scaleX: 0, transformOrigin: 'left center', duration: 0.9, stagger: 0.18, ease: 'expo.out' })
      })
    },
    { scope: root },
  )
  return (
    <div ref={root} className="rounded-3xl border border-line bg-surface p-5 sm:p-8">
      {/* Timeline header */}
      <div className="hidden grid-cols-[16rem_1fr] gap-6 md:grid" aria-hidden="true">
        <span />
        <div className="grid grid-cols-12 border-b border-line pb-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-subtle">
          {['Discover', '', '', 'Build', '', '', '', '', '', 'Run', '', ''].map((l, k) => (
            <span key={k}>{l}</span>
          ))}
        </div>
      </div>
      <ol className="relative">
        {steps.map((s, i) => (
          <li key={s.name} className="grid gap-3 border-b border-line py-5 last:border-0 md:grid-cols-[16rem_1fr] md:items-center md:gap-6">
            <div className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-fg font-mono text-[0.68rem] text-canvas">{i + 1}</span>
              <div>
                <h3 className="font-medium leading-snug">{s.name}</h3>
                <p className="mt-1 text-[0.88rem] leading-relaxed text-muted">{s.body}</p>
              </div>
            </div>
            <div className="relative" aria-hidden="true">
              <div className="relative grid h-9 grid-cols-12 items-center">
                {/* grid lines */}
                <span className="pointer-events-none absolute inset-0 grid grid-cols-12">
                  {Array.from({ length: 12 }, (_, k) => (
                    <span key={k} className="border-l border-dashed border-line first:border-0" />
                  ))}
                </span>
                {(bars[i] ?? [[0, 12]]).map(([start, span, label], k) => (
                  <span
                    key={k}
                    data-bar
                    className={`relative z-10 flex h-7 items-center overflow-hidden rounded-lg px-2.5 text-[0.65rem] font-medium ${
                      i === 2 ? 'bg-[linear-gradient(90deg,#e8cfae,#c79b69)] text-[#171717]' : i === 3 ? 'bg-fg text-canvas' : 'border border-accent-ink/50 bg-[#f3e6d6] text-accent-ink'
                    } ${k ? 'ml-1' : ''}`}
                    style={{ gridColumn: `${start + 1} / span ${span}` }}
                  >
                    <span className="hidden truncate md:inline">{label ?? deliverables[i]}</span>
                    {i === 3 && <span className="ml-auto hidden pl-1 md:inline">→</span>}
                  </span>
                ))}
              </div>
              {label(i)}
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[0.78rem] text-subtle">Illustrative roadmap — phases and timings are agreed per project.</p>
    </div>
  )
}

/** Deliverable caption under phased bars on small screens. */
function label(i: number) {
  return <p className="mt-1.5 text-[0.72rem] text-muted md:hidden">{deliverables[i]}</p>
}

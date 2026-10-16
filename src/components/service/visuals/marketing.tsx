import { useEffect, useRef, useState } from 'react'
import { useAutoCycle } from '@/hooks/useAutoCycle'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

/* ------------------------------------------------------------------ */
/*  Deliverables: each output shown as a small illustrative artefact    */
/* ------------------------------------------------------------------ */
const ink = (o: number) => `rgb(23 23 23 / ${o})`

function Thumb({ i }: { i: number }) {
  const line = (w: string, o = 0.14) => <span className="block h-1 rounded-full" style={{ width: w, background: ink(o) }} />
  switch (i) {
    case 0: // planning calendar
      return (
        <div className="grid h-full grid-cols-7 gap-1 p-3">
          {Array.from({ length: 21 }, (_, k) => (
            <span key={k} className="rounded-[3px]" style={{ background: [2, 3, 9, 10, 11, 16].includes(k) ? (k === 10 ? '#c79b69' : 'rgb(199 155 105 / 0.35)') : ink(0.05) }} />
          ))}
        </div>
      )
    case 1: // content pieces
      return (
        <div className="flex h-full gap-2 p-3">
          <span className="w-2/5 rounded-md bg-[linear-gradient(135deg,#1c2433,#2a2018)]" />
          <span className="flex flex-1 flex-col justify-center gap-1.5">
            {line('90%', 0.6)}
            {line('100%')}
            {line('75%')}
            {line('60%')}
          </span>
        </div>
      )
    case 2: // landing page
      return (
        <div className="flex h-full flex-col justify-center gap-1.5 bg-[#f7f5f0] p-3">
          {line('70%', 0.7)}
          {line('50%')}
          <span className="mt-1 w-fit rounded-full bg-[#171717] px-2.5 py-1 text-[0.5rem] text-white">Book a call</span>
        </div>
      )
    case 3: // search & paid
      return (
        <div className="flex h-full flex-col justify-center gap-2 p-3">
          {[0, 1].map((k) => (
            <span key={k} className="space-y-1">
              <span className="flex items-center gap-1.5">
                {k === 0 && <span className="rounded-sm border border-[#171717]/30 px-1 text-[0.45rem] font-medium">Ad</span>}
                <span className="h-1.5 w-1/2 rounded-full bg-[#1a3d8f]/60" />
              </span>
              {line('90%')}
            </span>
          ))}
        </div>
      )
    case 4: // tracking events
      return (
        <svg viewBox="0 0 120 50" className="h-full w-full" aria-hidden="true">
          <path d="M14 25 H106" stroke={ink(0.2)} strokeDasharray="2 3" />
          <path d="M14 25 H106" stroke="#8c5e34" strokeWidth="1.5" pathLength={1} className="flow-dash" />
          {[14, 44, 76, 106].map((x, k) => (
            <circle key={x} cx={x} cy="25" r={k === 3 ? 6 : 4.5} fill={k === 3 ? '#c79b69' : '#fff'} stroke="#8c5e34" strokeWidth="1.2" />
          ))}
        </svg>
      )
    default: // reporting trend, no numbers
      return (
        <svg viewBox="0 0 120 50" className="h-full w-full" aria-hidden="true" preserveAspectRatio="none">
          <path d="M6 40 L26 34 L46 36 L66 26 L86 22 L114 10 L114 46 L6 46 Z" fill="rgb(199 155 105 / 0.18)" />
          <path d="M6 40 L26 34 L46 36 L66 26 L86 22 L114 10" fill="none" stroke="#8c5e34" strokeWidth="1.5" pathLength={1} className="draw" vectorEffect="non-scaling-stroke" />
        </svg>
      )
  }
}

export function DeliverableShowcase({ items }: { items: { name: string; body: string }[] }) {
  const root = useRef<HTMLOListElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.from('[data-deliverable]', {
          autoAlpha: 0,
          y: 50,
          rotateX: -18,
          duration: 1.1,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: root.current, start: 'top 78%', once: true },
        })
      })
    },
    { scope: root },
  )
  return (
    <ol ref={root} className="grid gap-5 sm:grid-cols-2" style={{ perspective: '1400px' }}>
      {items.map((x, i) => (
        <li
          key={x.name}
          data-deliverable
          className="group rounded-2xl border border-line bg-surface p-3 transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-line-strong hover:shadow-[0_30px_50px_-30px_rgb(58_42_29/0.5)]"
        >
          <div aria-hidden="true" className="h-24 overflow-hidden rounded-xl border border-line bg-white transition-transform duration-500 group-hover:[transform:rotateX(6deg)_scale(1.02)]">
            <Thumb i={i} />
          </div>
          <div className="grid grid-cols-[2.25rem_1fr] px-1 pb-1 pt-4">
            <span className="font-mono text-[0.75rem] text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="font-medium">{x.name}</h3>
              <p className="mt-1 text-[0.94rem] leading-relaxed text-muted">{x.body}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}

/* ------------------------------------------------------------------ */
/*  Improvement cycle: a signal orbiting the four steps                 */
/* ------------------------------------------------------------------ */
export function ImprovementCycle({ steps }: { steps: { name: string; body: string }[] }) {
  const root = useRef<HTMLDivElement>(null)
  const { index, select, inView } = useAutoCycle(steps.length, root, 2800)
  const [turn, setTurn] = useState({ angle: 0, laps: 0, prev: 0 })
  const r = 38
  const n = steps.length

  useEffect(() => {
    setTurn((t) => {
      if (t.prev === index) return t
      const delta = (((index - t.prev) * 360) / n + 360) % 360
      return { angle: t.angle + delta, laps: t.laps + (index < t.prev ? 1 : 0), prev: index }
    })
  }, [index, n])
  const { angle, laps } = turn

  // Bars drift upward each lap: an evidence trend without numbers.
  const bars = [30, 42, 38, 52, 48, 62].map((h, k) => Math.min(92, h + ((laps % 3) * 8 + (k * index) % 6)))

  return (
    <div ref={root} className={`relative mx-auto aspect-square w-full max-w-[min(28rem,calc(100vw-5rem))] ${inView ? '' : 'is-paused'}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#c9c2b6" strokeWidth="0.3" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#8c5e34"
          strokeWidth="0.7"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          style={{ strokeDashoffset: 1 - (index + 1) / n, transition: 'stroke-dashoffset .9s cubic-bezier(.16,1,.3,1)' }}
        />
      </svg>
      {/* Orbiting signal */}
      <div aria-hidden="true" className="absolute inset-0 transition-transform duration-[900ms] ease-[var(--ease-out-expo)]" style={{ transform: `rotate(${angle}deg)` }}>
        <span className="absolute left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_7px_rgb(199_155_105/0.25)]" style={{ top: `${50 - r}%` }} />
      </div>

      {steps.map((p, i) => {
        const a = ((-90 + (i * 360) / n) * Math.PI) / 180
        return (
          <button
            key={p.name}
            type="button"
            onClick={() => select(i)}
            onMouseEnter={() => select(i)}
            aria-pressed={i === index}
            className={`absolute w-24 -translate-x-1/2 -translate-y-1/2 rounded-xl border p-2 text-center text-[0.85rem] transition-[background,border-color,color,box-shadow] duration-500 sm:w-36 sm:p-3 sm:text-base ${
              i === index ? 'border-fg bg-fg text-canvas shadow-[0_20px_36px_-18px_rgb(23_23_23/0.6)]' : 'border-line-strong bg-surface'
            }`}
            style={{ left: `${50 + Math.cos(a) * r}%`, top: `${50 + Math.sin(a) * r}%` }}
          >
            <span className={`block font-mono text-[0.68rem] ${i === index ? 'text-accent' : 'text-accent-ink'}`}>0{i + 1}</span>
            <span className="block font-medium">{p.name}</span>
          </button>
        )
      })}

      {/* Centre: the evidence the next cycle starts from */}
      <div className="absolute left-1/2 top-1/2 w-[38%] -translate-x-1/2 -translate-y-1/2 text-center">
        <div aria-hidden="true" className="mx-auto flex h-10 w-full max-w-[7rem] items-end gap-1 sm:h-14">
          {bars.map((h, k) => (
            <span
              key={k}
              className="flex-1 rounded-t-sm transition-[height] duration-700 ease-[var(--ease-out-expo)]"
              style={{ height: `${h}%`, background: k === bars.length - 1 ? 'linear-gradient(#e8cfae,#a8754c)' : 'rgb(140 94 52 / 0.22)' }}
            />
          ))}
        </div>
        <p className="mt-2 text-[0.72rem] leading-snug text-muted sm:text-[0.85rem]">Each cycle starts from the last one’s evidence.</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Benefits as milestones on a rising growth curve (no figures)         */
/* ------------------------------------------------------------------ */
const milestones = [
  { x: 16.67, y: 72 },
  { x: 50, y: 46 },
  { x: 83.33, y: 18 },
]
const curve = 'M0 92 C 8 88, 12 76, 16.67 72 S 40 50, 50 46 S 74 24, 83.33 18 S 96 8, 100 6'

export function GrowthBenefits({ items, title }: { items: { title: string; body: string }[]; title: string }) {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const st = { trigger: root.current, start: 'top 70%', end: 'center 50%', scrub: 0.6 }
        gsap.fromTo('[data-curve-wrap]', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: st })
        gsap.from('[data-milestone]', { scale: 0, duration: 0.6, stagger: 0.25, ease: 'back.out(2)', scrollTrigger: { trigger: root.current, start: 'top 60%', once: true } })
        gsap.from('[data-gcard]', { autoAlpha: 0, y: 30, duration: 0.9, stagger: 0.15, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 60%', once: true } })
      })
    },
    { scope: root },
  )
  return (
    <section ref={root} aria-labelledby="growth-benefits" className="border-y border-line bg-canvas-alt py-20 lg:py-28">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-muted">Business benefits</p>
            <h2 id="growth-benefits" className="mt-4 text-[clamp(1.9rem,3.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em]">
              {title}
            </h2>
          </div>
          <p className="text-muted lg:col-span-4 lg:col-start-9">Growth that builds step by step — each improvement makes the next one easier to measure.</p>
        </div>

        {/* The curve (desktop) */}
        <div aria-hidden="true" className="relative mt-14 hidden h-56 md:block">
          <svg data-curve-wrap viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {[25, 50, 75].map((y) => (
              <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgb(23 23 23 / 0.06)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            ))}
            <path d={`${curve} L100 100 L0 100 Z`} fill="url(#growth-fill)" />
            <defs>
              <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#c79b69" stopOpacity="0.28" />
                <stop offset="1" stopColor="#c79b69" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={curve} fill="none" stroke="#8c5e34" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {milestones.map((m, i) => (
            <span key={i} data-milestone className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-accent-ink bg-canvas font-mono text-[0.72rem] text-accent-ink shadow-[0_0_0_8px_rgb(199_155_105/0.15)]" style={{ left: `${m.x}%`, top: `${m.y}%` }}>
              0{i + 1}
            </span>
          ))}
          <span className="absolute bottom-0 right-0 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-subtle">Illustrative · no figures</span>
        </div>

        <ol className="mt-10 grid gap-4 md:mt-8 md:grid-cols-3 md:gap-6">
          {items.map((b, i) => (
            <li key={b.title} data-gcard className="relative rounded-3xl border border-line bg-surface p-6 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-accent-ink/50 md:text-center">
              <span aria-hidden="true" className="absolute -top-3 left-1/2 hidden h-3 w-px -translate-x-1/2 bg-accent-ink/40 md:block" />
              <span className="font-mono text-[0.7rem] text-accent-ink md:hidden">0{i + 1}</span>
              <h3 className="text-xl font-medium tracking-[-0.02em]">{b.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{b.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

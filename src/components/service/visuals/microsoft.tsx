import { useRef, useState } from 'react'
import { Bot, ChartColumn, Cloud, FileText, Landmark, LayoutTemplate, MessageSquare, Users, Workflow, type LucideIcon } from 'lucide-react'
import { msLinks, msProduct, msProducts, msScenarios, type MsProductId } from '@/content/microsoft'
import { useAutoCycle } from '@/hooks/useAutoCycle'
import { useScroll } from '@/lib/scroll'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

export const msIcons: Record<MsProductId, LucideIcon> = {
  d365: Users,
  bc: Landmark,
  apps: LayoutTemplate,
  bi: ChartColumn,
  automate: Workflow,
  azure: Cloud,
}
/** Short names for diagrams. */
export const msShort: Record<MsProductId, string> = {
  d365: 'Dynamics 365',
  bc: 'Business Central',
  apps: 'Power Apps',
  bi: 'Power BI',
  automate: 'Power Automate',
  azure: 'Azure',
}

/* ------------------------------------------------------------------ */
/*  Hero: layered application panels in perspective                     */
/* ------------------------------------------------------------------ */
export function MsHeroStack() {
  const root = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.from('[data-hpanel]', { autoAlpha: 0, y: 50, z: -120, duration: 1.4, stagger: 0.14, delay: 0.5, ease: 'expo.out' })
        gsap.to('[data-hpanel]', {
          y: (i: number) => [-30, -60, -20, -80][i] ?? -40,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 30%', end: 'bottom top', scrub: 0.8 },
        })
      })
    },
    { scope: root },
  )
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = e.currentTarget.getBoundingClientRect()
    setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 })
  }
  const panel = 'absolute rounded-2xl border border-white/80 bg-white/90 p-3 shadow-[0_40px_60px_-36px_rgb(58_42_29/0.55)] backdrop-blur-sm sm:p-4'
  return (
    <div
      ref={root}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative mx-auto aspect-[5/4] w-full max-w-[40rem]"
      style={{ perspective: '1600px' }}
      role="img"
      aria-label="Illustrative Microsoft business applications connected together: a sales pipeline, a finance dashboard, an approval flow and cloud services"
    >
      <div aria-hidden="true" className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgb(199_155_105/0.28),transparent)]" />
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{ transform: `rotateX(${8 - tilt.y * 6}deg) rotateY(${-12 + tilt.x * 10}deg)`, transformStyle: 'preserve-3d' }}
      >
        {/* Connectors */}
        <svg aria-hidden="true" viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" style={{ transform: 'translateZ(-20px)' }}>
          {['M30 22 C45 22 48 40 58 42', 'M70 30 C74 40 74 48 70 56', 'M32 56 C42 60 50 62 58 62'].map((d, i) => (
            <g key={i}>
              <path d={d} fill="none" stroke="rgb(140 94 52 / 0.35)" strokeWidth="0.35" strokeDasharray="1 1" />
              <path d={d} fill="none" stroke="#8c5e34" strokeWidth="0.8" strokeLinecap="round" pathLength={1} className="flow-dash" style={{ animationDelay: `-${i * 0.8}s` }} />
            </g>
          ))}
        </svg>

        {/* Sales pipeline */}
        <div data-hpanel className={`${panel} left-0 top-[4%] w-[46%]`} style={{ transform: 'translateZ(40px)' }}>
          <p className="flex items-center gap-1.5 text-[0.62rem] font-medium"><Users size={11} className="text-accent-ink" /> Sales pipeline</p>
          <div className="mt-2 grid grid-cols-3 gap-1">
            {[3, 2, 1].map((n, c) => (
              <div key={c} className="space-y-1 rounded-md bg-canvas-alt p-1">
                {Array.from({ length: n }, (_, k) => (
                  <span key={k} className={`block h-3 rounded-[3px] ${c === 1 && k === 0 ? 'bg-accent' : 'bg-white'}`} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Finance dashboard */}
        <div data-hpanel className={`${panel} right-0 top-[10%] w-[50%]`} style={{ transform: 'translateZ(90px)' }}>
          <p className="flex items-center gap-1.5 text-[0.62rem] font-medium"><ChartColumn size={11} className="text-accent-ink" /> Finance & reporting</p>
          <div className="mt-2 flex h-16 items-end gap-1">
            {[38, 52, 46, 64, 58, 76, 70, 86].map((h, i) => (
              <span key={i} className="flex-1 rounded-t-[2px]" style={{ height: `${h}%`, background: i === 7 ? 'linear-gradient(#e8cfae,#a8754c)' : 'rgb(140 94 52 / 0.2)' }} />
            ))}
          </div>
          <p className="mt-1.5 text-[0.52rem] uppercase tracking-[0.12em] text-subtle">Illustrative</p>
        </div>

        {/* Approval flow */}
        <div data-hpanel className={`${panel} bottom-[8%] left-[4%] w-[44%]`} style={{ transform: 'translateZ(120px)' }}>
          <p className="flex items-center gap-1.5 text-[0.62rem] font-medium"><Workflow size={11} className="text-accent-ink" /> Approval flow</p>
          <div className="mt-2 space-y-1">
            {['Request submitted', 'Manager approval', 'Order created'].map((t, i) => (
              <p key={t} className="flex items-center gap-1.5 text-[0.56rem] text-muted">
                <span className={`h-2 w-2 rounded-full ${i < 2 ? 'bg-accent-ink' : 'border border-line-strong'}`} /> {t}
              </p>
            ))}
          </div>
        </div>

        {/* Cloud */}
        <div data-hpanel className={`${panel.replace('bg-white/90', 'bg-[#14161b]')} bottom-0 right-[6%] w-[40%] text-white`} style={{ transform: 'translateZ(60px)' }}>
          <p className="flex items-center gap-1.5 text-[0.62rem] font-medium"><Cloud size={11} className="text-accent" /> Cloud services</p>
          <div className="mt-2 grid grid-cols-3 gap-1">
            {['App', 'API', 'Data'].map((t) => (
              <span key={t} className="rounded-md border border-white/15 py-1 text-center text-[0.52rem] text-white/70">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Ecosystem: six products around your business, with live links      */
/* ------------------------------------------------------------------ */
const order: MsProductId[] = ['d365', 'bc', 'bi', 'azure', 'automate', 'apps']

export function MsEcosystem() {
  const root = useRef<HTMLDivElement>(null)
  const { scrollTo } = useScroll()
  const { index, select, inView } = useAutoCycle(order.length, root, 3000)
  const active = order[index]
  const pos = Object.fromEntries(
    order.map((id, i) => {
      const a = ((-90 + i * 60) * Math.PI) / 180
      return [id, { x: 50 + Math.cos(a) * 37, y: 50 + Math.sin(a) * 37 }]
    }),
  ) as Record<MsProductId, { x: number; y: number }>
  const linked = new Set(msLinks.filter(([a, b]) => a === active || b === active).flatMap(([a, b]) => [a, b]))
  const p = msProduct(active)
  const Icon = msIcons[active]

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const st = { trigger: root.current, start: 'top 75%', once: true }
        gsap.from('[data-eco-node]', { scale: 0.5, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'back.out(1.7)', scrollTrigger: st })
        gsap.fromTo('[data-eco-link]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.05, delay: 0.3, ease: 'power2.inOut', scrollTrigger: st })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={`grid items-center gap-12 lg:grid-cols-12 ${inView ? '' : 'is-paused'}`}>
      <div className="relative mx-auto aspect-square w-full max-w-[34rem] lg:col-span-7">
        <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
          <circle cx="50" cy="50" r="37" fill="none" stroke="rgb(237 233 227 / 0.08)" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="22" fill="none" stroke="rgb(199 155 105 / 0.15)" strokeWidth="0.3" strokeDasharray="0.8 1.2" />
          {msLinks.map(([a, b], k) => {
            const A = pos[a]
            const B = pos[b]
            const on = a === active || b === active
            // Curve gently toward the centre
            const d = `M${A.x} ${A.y} Q${(A.x + B.x) / 2 + (50 - (A.x + B.x) / 2) * 0.45} ${(A.y + B.y) / 2 + (50 - (A.y + B.y) / 2) * 0.45} ${B.x} ${B.y}`
            return (
              <g key={k}>
                <path
                  data-eco-link
                  d={d}
                  fill="none"
                  pathLength={1}
                  strokeDasharray="1"
                  stroke={on ? '#c79b69' : 'rgb(237 233 227 / 0.14)'}
                  strokeWidth={on ? 0.55 : 0.3}
                  style={{ transition: 'stroke .5s, stroke-width .5s' }}
                />
                {on && <path d={d} fill="none" stroke="#f0d9bd" strokeWidth="1.1" strokeLinecap="round" pathLength={1} className="flow-dash" style={{ animationDelay: `-${k * 0.4}s` }} />}
              </g>
            )
          })}
        </svg>

        {/* Core */}
        <div className="absolute left-1/2 top-1/2 grid h-[24%] w-[24%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-accent/40 bg-[radial-gradient(circle_at_40%_35%,rgb(199_155_105/0.35),rgb(20_22_27)_70%)] text-center">
          <span className="px-2 text-[0.62rem] leading-tight text-fg sm:text-[0.78rem]">
            Your business
            <span className="mt-0.5 block font-mono text-[0.5rem] uppercase tracking-[0.14em] text-accent sm:text-[0.56rem]">Shared data</span>
          </span>
        </div>

        {order.map((id, i) => {
          const NodeIcon = msIcons[id]
          const on = id === active
          return (
            <button
              key={id}
              type="button"
              onClick={() => select(i)}
              onMouseEnter={() => select(i)}
              aria-pressed={on}
              className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-2xl border px-2 py-2 text-center transition-[background,border-color,opacity,box-shadow] duration-500 sm:px-3 ${
                on ? 'border-accent bg-[#1d1f25] shadow-[0_0_0_6px_rgb(199_155_105/0.15)]' : linked.has(id) ? 'border-line-strong bg-canvas' : 'border-line bg-canvas opacity-70'
              }`}
              style={{ left: `${pos[id].x}%`, top: `${pos[id].y}%` }}
            >
              <span data-eco-node className="flex flex-col items-center gap-1">
                <NodeIcon size={16} strokeWidth={1.6} className={on ? 'text-accent' : 'text-muted'} aria-hidden="true" />
                <span className="whitespace-nowrap text-[0.62rem] font-medium leading-tight sm:text-[0.74rem]">{msShort[id]}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="lg:col-span-5" aria-live="polite">
        <p className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-accent">
          <Icon size={14} aria-hidden="true" /> {p.role}
        </p>
        <h3 key={active} className="fade-in mt-3 text-[clamp(1.8rem,2.6vw,2.4rem)] font-medium leading-tight tracking-[-0.03em]">
          {p.name}
        </h3>
        <p className="mt-3 leading-relaxed text-muted">{p.fit}</p>
        <p className="mt-6 text-[0.8rem] text-subtle">Typically connects with</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {[...linked]
            .filter((id) => id !== active)
            .map((id) => (
              <li key={id}>
                <button type="button" onClick={() => select(order.indexOf(id))} className="rounded-full border border-line-strong px-3 py-1 text-[0.8rem] transition-colors hover:border-accent hover:text-accent">
                  {msShort[id]}
                </button>
              </li>
            ))}
        </ul>
        <button type="button" onClick={() => scrollTo(`ms-${active}`)} className="link-draw mt-8 inline-block text-[0.92rem] text-fg">
          Explore {msShort[active]} below
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Use cases: pick a scenario, see which products combine              */
/* ------------------------------------------------------------------ */
const grid: Record<MsProductId, [number, number]> = { d365: [0, 0], bc: [1, 0], apps: [2, 0], bi: [0, 1], automate: [1, 1], azure: [2, 1] }

export function MsScenarios() {
  const root = useRef<HTMLDivElement>(null)
  const { index, select } = useAutoCycle(msScenarios.length, root, 3400)
  const sc = msScenarios[index]
  const centre = (id: MsProductId) => ({ x: (grid[id][0] + 0.5) * (300 / 3), y: (grid[id][1] + 0.5) * (200 / 2) })
  const path = sc.products.map((id, i) => `${i ? 'L' : 'M'}${centre(id).x} ${centre(id).y}`).join(' ')

  return (
    <div ref={root} className="grid gap-10 lg:grid-cols-12 lg:items-center">
      <ol className="space-y-2 lg:col-span-5">
        {msScenarios.map((s, i) => (
          <li key={s.title}>
            <button
              type="button"
              onClick={() => select(i)}
              onMouseEnter={() => select(i)}
              aria-pressed={i === index}
              className={`w-full rounded-xl border px-5 py-4 text-left transition-colors duration-500 ${i === index ? 'border-fg bg-surface' : 'border-line hover:border-line-strong'}`}
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-[0.7rem] text-accent-ink">0{i + 1}</span>
                <span className="font-medium">{s.title}</span>
              </span>
              <span className={`grid transition-[grid-template-rows] duration-500 ${i === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <span className="overflow-hidden pl-8 text-[0.92rem] text-muted">
                  <span className="block pt-1">{s.body}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="lg:col-span-6 lg:col-start-7">
        <div className="relative aspect-[3/2] w-full rounded-3xl border border-line bg-canvas-alt/60 p-2">
          <svg aria-hidden="true" viewBox="0 0 300 200" className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)]">
            <path key={index} d={path} fill="none" stroke="#8c5e34" strokeWidth="1.5" strokeDasharray="1" pathLength={1} className="draw" strokeLinejoin="round" />
          </svg>
          <div className="relative grid h-full grid-cols-3 grid-rows-2">
            {msProducts.map((p) => {
              const step = sc.products.indexOf(p.id)
              const on = step >= 0
              const I = msIcons[p.id]
              return (
                <div key={p.id} className="grid place-items-center">
                  <div
                    className={`relative flex w-[86%] flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-center transition-[background,border-color,opacity,transform] duration-500 ${
                      on ? 'border-fg bg-white shadow-[0_20px_36px_-26px_rgb(58_42_29/0.6)] sm:-translate-y-1' : 'border-line bg-canvas opacity-50'
                    }`}
                  >
                    {on && <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-accent-ink font-mono text-[0.6rem] text-canvas">{step + 1}</span>}
                    <I size={18} strokeWidth={1.5} className={on ? 'text-accent-ink' : 'text-subtle'} aria-hidden="true" />
                    <span className="text-[0.66rem] font-medium leading-tight sm:text-[0.78rem]">{msShort[p.id]}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <p className="mt-4 text-[0.8rem] text-subtle" aria-live="polite">
          Typical combination for “{sc.title.toLowerCase()}”: {sc.products.map((id) => msShort[id]).join(' → ')}. The right mix is confirmed in discovery.
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Implementation: stations along a track that fills on scroll          */
/* ------------------------------------------------------------------ */
export function MsImplementation({ steps }: { steps: { name: string; body: string }[] }) {
  const root = useRef<HTMLOListElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const st = { trigger: root.current, start: 'top 75%', end: 'bottom 65%', scrub: 0.6 }
        gsap.fromTo('[data-impl-fill-x]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: st })
        gsap.fromTo('[data-impl-fill-y]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: st })
        gsap.from('[data-impl-step]', { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.09, scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } })
      })
    },
    { scope: root },
  )
  return (
    <ol ref={root} className="relative grid gap-8 lg:grid-cols-7 lg:gap-4">
      {/* Horizontal track (desktop) */}
      <span aria-hidden="true" className="absolute left-[7%] right-[7%] top-[1.15rem] hidden h-px bg-line-strong lg:block" />
      <span aria-hidden="true" data-impl-fill-x className="absolute left-[7%] right-[7%] top-[1.15rem] hidden h-px origin-left bg-accent-ink lg:block" />
      {/* Vertical track (mobile) */}
      <span aria-hidden="true" className="absolute bottom-2 left-[1.15rem] top-2 w-px bg-line-strong lg:hidden" />
      <span aria-hidden="true" data-impl-fill-y className="absolute bottom-2 left-[1.15rem] top-2 w-px origin-top bg-accent-ink lg:hidden" />
      {steps.map((s, i) => (
        <li key={s.name} data-impl-step className="relative grid grid-cols-[2.3rem_1fr] gap-4 lg:block lg:text-center">
          <span className="relative z-10 grid h-[2.3rem] w-[2.3rem] place-items-center rounded-full border border-accent-ink bg-canvas font-mono text-[0.72rem] text-accent-ink lg:mx-auto">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="lg:mt-5">
            <h3 className="font-medium leading-snug">{s.name}</h3>
            <p className="mt-1.5 text-[0.88rem] leading-relaxed text-muted">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/* ------------------------------------------------------------------ */
/*  Microsoft 365, SharePoint and Copilot Studio — compact previews      */
/* ------------------------------------------------------------------ */
export function MsExtraVisual({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="space-y-2 p-3 text-[0.62rem]">
        <p className="flex items-center gap-1.5 text-muted"><MessageSquare size={11} /> Team channel</p>
        <div className="rounded-lg border border-line bg-white p-2">
          <p className="font-medium">Approval requested</p>
          <p className="text-muted">Purchase request · Packaging</p>
          <div className="mt-1.5 flex gap-1">
            <span className="rounded-full bg-fg px-2 py-0.5 text-canvas">Approve</span>
            <span className="rounded-full border border-line-strong px-2 py-0.5">Reject</span>
          </div>
        </div>
      </div>
    )
  if (i === 1)
    return (
      <ul className="p-3 text-[0.62rem]">
        {['Policies', 'Project documents', 'Supplier contracts', 'Inspection photos'].map((f, k) => (
          <li key={f} className="flex items-center gap-2 border-b border-line py-1.5 last:border-0">
            <FileText size={11} className={k === 2 ? 'text-accent-ink' : 'text-subtle'} /> {f}
          </li>
        ))}
      </ul>
    )
  return (
    <div className="space-y-1.5 p-3 text-[0.62rem]">
      <p className="ml-auto w-fit rounded-lg rounded-br-sm bg-fg px-2 py-1 text-canvas">What is our returns policy?</p>
      <div className="w-[88%] rounded-lg rounded-bl-sm border border-line bg-white px-2 py-1.5">
        <p className="flex items-center gap-1 text-muted"><Bot size={11} /> Agent</p>
        <p className="mt-0.5">Answer drawn from the approved policy document.</p>
        <span className="mt-1 inline-block rounded-full bg-accent/15 px-1.5 text-accent-ink">Source: Policies</span>
      </div>
    </div>
  )
}

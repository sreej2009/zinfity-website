import { useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Boxes, Cable, Code2, Database, LayoutTemplate, PenTool, TrendingUp, Workflow, type LucideIcon } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { disciplineDetails, disciplines, layerFriction, layers, type Solution } from '@/content/solutions'
import { serviceById, servicePath } from '@/content/services'
import { useAutoCycle } from '@/hooks/useAutoCycle'
import { contactHref } from '@/lib/enquiry'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

const layerIcons: LucideIcon[] = [LayoutTemplate, Boxes, Cable, Database, Workflow]
const ink = (o: number) => `rgb(23 23 23 / ${o})`

function ServiceLinks({ ids, className = '' }: { ids: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {ids.map((id) => {
        const s = serviceById(id)!
        return (
          <li key={id}>
            <Link to={servicePath(s)} className="group inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-[0.85rem] transition-colors hover:border-fg hover:bg-fg hover:text-canvas">
              {s.short}
              <ArrowRight size={12} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

/** Roving-focus arrow keys for a horizontal or vertical tablist. */
function useArrowKeys(count: number, index: number, select: (i: number) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKeyDown = (e: KeyboardEvent) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const i = (index + dir + count) % count
    select(i)
    refs.current[i]?.focus()
  }
  return { refs, onKeyDown }
}

/* ------------------------------------------------------------------ */
/*  A · Route panel under the map                                        */
/* ------------------------------------------------------------------ */
export function RoutePanel({ current }: { current: Solution }) {
  return (
    <div id="sol-panel" role="tabpanel" aria-labelledby={`sol-tab-${current.id}`} aria-live="polite" className="mt-14 border-b border-line pb-14">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-accent-ink">Selected scenario</p>
          <h2 className="text-title mt-4">{current.title}</h2>
          <p className="mt-4 leading-relaxed text-muted">{current.description}</p>
          <ServiceLinks ids={current.services} className="mt-6" />
        </div>
        <div className="lg:col-span-7">
          {/* The route as a chain of steps, one per layer */}
          <p className="eyebrow text-subtle">Route through the layers</p>
          <ol key={current.id} className="mt-4 grid gap-2 sm:grid-cols-5">
            {current.path.map((node, i) => {
              const Icon = layerIcons[i]
              return (
                <li key={node} className="fade-in relative" style={{ ['--d' as string]: i * 2 }}>
                  <div className="flex h-full items-center gap-3 rounded-xl border border-line bg-surface p-3 sm:flex-col sm:items-start">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-panel text-accent">
                      <Icon size={14} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-mono text-[0.6rem] uppercase tracking-[0.12em] text-subtle">L{i + 1}</span>
                      <span className="block text-[0.86rem] font-medium leading-tight">{node}</span>
                    </span>
                  </div>
                  {i < current.path.length - 1 && (
                    <ArrowRight size={12} aria-hidden="true" className="absolute -right-[0.55rem] top-1/2 z-10 hidden -translate-y-1/2 text-accent-ink sm:block" />
                  )}
                </li>
              )
            })}
          </ol>
          <div className="mt-6 rounded-xl bg-canvas-alt p-5">
            <p className="eyebrow text-subtle">Typical signs</p>
            <ul className="mt-3 grid gap-2 text-[0.94rem] sm:grid-cols-3">
              {current.appliesTo.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  B · What we design at each layer: an assembling stack               */
/* ------------------------------------------------------------------ */
function LayerPreview({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="flex h-full items-center gap-3 px-4">
        <div className="h-[70%] flex-1 rounded-md border border-[#171717]/15 bg-white p-1.5">
          <span className="block h-1 w-1/3 rounded bg-[#171717]/60" />
          <span className="mt-1.5 block h-[45%] rounded bg-[linear-gradient(135deg,#f0d9bd,#c79b69)]" />
        </div>
        <div className="h-[80%] w-8 rounded-md border-2 border-[#171717]/70 bg-white p-0.5">
          <span className="block h-1/2 rounded-sm bg-[linear-gradient(135deg,#f0d9bd,#c79b69)]" />
        </div>
        <div className="h-[70%] w-14 rounded-md border border-[#171717]/15 bg-white p-1">
          {[0, 1, 2].map((k) => <span key={k} className="mb-1 block h-1 rounded bg-[#171717]/15" />)}
        </div>
      </div>
    )
  if (i === 1)
    return (
      <div className="grid h-full grid-cols-3 items-center gap-2 px-4">
        {['Platform', 'ERP & CRM', 'Commerce'].map((t) => (
          <span key={t} className="grid h-[70%] place-items-center rounded-md border border-[#8c5e34]/40 bg-white text-[0.55rem] font-medium">
            {t}
          </span>
        ))}
      </div>
    )
  if (i === 2)
    return (
      <svg viewBox="0 0 200 60" className="h-full w-full" aria-hidden="true">
        {[30, 100, 170].map((x) => <circle key={x} cx={x} cy="30" r="9" fill="#fff" stroke="#8c5e34" strokeWidth="1.5" />)}
        {['M39 30 H91', 'M109 30 H161'].map((d, k) => (
          <g key={k}>
            <path d={d} stroke="rgb(140 94 52 / 0.35)" strokeWidth="1.5" />
            <path d={d} stroke="#8c5e34" strokeWidth="3" strokeLinecap="round" pathLength={1} className="flow-dash" style={{ animationDelay: `-${k}s` }} />
          </g>
        ))}
      </svg>
    )
  if (i === 3)
    return (
      <div className="flex h-full items-center gap-4 px-4">
        <div className="flex-1 space-y-1">
          {[0, 1, 2, 3].map((k) => (
            <span key={k} className="flex gap-1">
              <span className="h-1.5 w-1/4 rounded bg-[#171717]/25" />
              <span className="h-1.5 flex-1 rounded bg-[#171717]/10" />
            </span>
          ))}
        </div>
        <div className="flex h-[70%] items-end gap-1">
          {[40, 60, 50, 80, 70].map((h, k) => <span key={k} className="w-2 rounded-t-sm" style={{ height: `${h}%`, background: k === 3 ? '#c79b69' : ink(0.18) }} />)}
        </div>
      </div>
    )
  return (
    <div className="grid h-full grid-cols-4 items-center gap-2 px-4">
      {['Sales', 'Fulfil', 'Finance', 'Support'].map((t) => (
        <span key={t} className="grid h-[60%] place-items-center rounded-full bg-[#171717] text-[0.52rem] text-white">
          {t}
        </span>
      ))}
    </div>
  )
}

export function LayerExplorer() {
  const root = useRef<HTMLDivElement>(null)
  const { index, select } = useAutoCycle(layers.length, root, 3600)
  const { refs, onKeyDown } = useArrowKeys(layers.length, index, select)
  const l = layers[index]

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        // Layers start collapsed together and separate as the section scrolls in.
        gsap.fromTo('[data-plane-stack]', { '--gap': 6 }, { '--gap': 46, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'center 55%', scrub: 0.6 } })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="grid items-center gap-12 lg:grid-cols-12">
      {/* The stack */}
      <div aria-hidden="true" className="relative mx-auto h-[22rem] w-full max-w-[34rem] max-lg:overflow-x-clip max-sm:h-[18rem] lg:col-span-6" style={{ perspective: '1300px' }}>
        <div data-plane-stack className="absolute inset-0" style={{ transform: 'rotateX(52deg) rotateZ(-10deg)', transformStyle: 'preserve-3d', ['--gap' as string]: 46 }}>
          {layers.map((layer, i) => {
            const on = i === index
            return (
              <div
                key={layer.id}
                onClick={() => select(i)}
                className={`absolute inset-x-[8%] top-[34%] h-[30%] cursor-pointer overflow-hidden rounded-2xl border transition-[transform,background,border-color,opacity,box-shadow] duration-700 ease-[var(--ease-out-expo)] ${
                  on ? 'border-accent-ink bg-[#fbf3e8] shadow-[0_40px_50px_-30px_rgb(140_94_52/0.7)]' : 'border-line-strong bg-white/90 opacity-80 shadow-[0_20px_30px_-24px_rgb(58_42_29/0.5)]'
                }`}
                style={{ transform: `translateZ(calc(${2 - i} * var(--gap) * 1px + ${on ? 24 : 0}px))` }}
              >
                <LayerPreview i={i} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Selector + detail */}
      <div className="lg:col-span-6">
        <div role="tablist" aria-label="Architecture layers" aria-orientation="vertical" onKeyDown={onKeyDown} className="grid gap-1.5">
          {layers.map((layer, i) => {
            const Icon = layerIcons[i]
            const on = i === index
            return (
              <button
                key={layer.id}
                ref={(el) => {
                  refs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`layer-tab-${layer.id}`}
                aria-selected={on}
                aria-controls="layer-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => select(i)}
                onMouseEnter={() => select(i)}
                className={`flex items-center gap-4 rounded-xl border px-4 py-3 text-left transition-colors duration-500 ${on ? 'border-fg bg-surface' : 'border-transparent hover:border-line'}`}
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors ${on ? 'bg-fg text-canvas' : 'bg-canvas-alt text-muted'}`}>
                  <Icon size={15} aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="font-mono text-[0.62rem] text-accent-ink">L{i + 1}</span>
                  <span className="ml-2 font-medium">{layer.name}</span>
                </span>
                <span className="hidden text-[0.8rem] text-subtle sm:inline">{layer.note}</span>
              </button>
            )
          })}
        </div>
        <div id="layer-panel" role="tabpanel" aria-labelledby={`layer-tab-${l.id}`} className="mt-6 rounded-2xl border border-line bg-canvas-alt/70 p-6">
          <div key={l.id} className="fade-in">
            <p className="text-lg leading-relaxed">{l.role}</p>
            <p className="eyebrow mt-6 text-subtle">Typical examples</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {l.nodes.map((n) => (
                <li key={n} className="rounded-md border border-line bg-surface px-2.5 py-1 text-[0.85rem]">
                  {n}
                </li>
              ))}
            </ul>
            <p className="eyebrow mt-6 text-subtle">Zinfity services at this layer</p>
            <ServiceLinks ids={l.services} className="mt-3" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  C · Four disciplines around one plan                                 */
/* ------------------------------------------------------------------ */
function DisciplineGlyph({ id, on }: { id: string; on: boolean }) {
  const c = on ? '#e8cfae' : 'rgb(237 233 227 / 0.4)'
  if (id === 'design')
    return (
      <svg viewBox="0 0 80 40" className="h-10 w-20" aria-hidden="true">
        <rect x="2" y="4" width="44" height="32" rx="4" fill="none" stroke={c} />
        <path d="M2 14 H46" stroke={c} />
        <circle cx="62" cy="20" r="12" fill="none" stroke={c} strokeDasharray="3 3" />
        <circle cx="62" cy="20" r="4" fill={c} />
      </svg>
    )
  if (id === 'engineering')
    return (
      <svg viewBox="0 0 80 40" className="h-10 w-20" aria-hidden="true">
        <path d="M18 10 L6 20 L18 30 M62 10 L74 20 L62 30 M46 6 L34 34" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  if (id === 'process')
    return (
      <svg viewBox="0 0 80 40" className="h-10 w-20" aria-hidden="true">
        {[8, 40, 72].map((x) => <circle key={x} cx={x} cy="20" r="6" fill="none" stroke={c} strokeWidth="1.5" />)}
        <path d="M14 20 H34 M46 20 H66" stroke={c} strokeWidth="1.5" />
      </svg>
    )
  return (
    <svg viewBox="0 0 80 40" className="h-10 w-20" aria-hidden="true">
      <path d="M4 34 L22 26 L38 30 L56 14 L76 6" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <path d="M66 6 H76 V16" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const disciplineIcons: Record<string, LucideIcon> = { design: PenTool, engineering: Code2, process: Workflow, growth: TrendingUp }

export function DisciplinesSystem() {
  const root = useRef<HTMLDivElement>(null)
  const { index, select, inView } = useAutoCycle(disciplines.length, root, 3000)
  const active = disciplines[index]
  // Card anchor points (in % of the composition) the wires run from.
  const anchors = [
    [36, 25],
    [64, 25],
    [36, 75],
    [64, 75],
  ]
  return (
    <div ref={root} className={`relative ${inView ? '' : 'is-paused'}`}>
      {/* Wires to the shared plan (desktop) */}
      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block">
        {anchors.map(([x, y], i) => {
          const d = `M${x} ${y} C${(x + 50) / 2} ${y} ${(x + 50) / 2} 50 50 50`
          const on = i === index
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={on ? '#c79b69' : 'rgb(237 233 227 / 0.15)'} strokeWidth={on ? 1.6 : 1} vectorEffect="non-scaling-stroke" style={{ transition: 'stroke .5s' }} />
              <path d={d} fill="none" stroke="#f0d9bd" strokeWidth="3" strokeLinecap="round" pathLength={1} className="flow-dash" vectorEffect="non-scaling-stroke" style={{ animationDelay: `-${i * 0.65}s`, opacity: on ? 1 : 0.35 }} />
            </g>
          )
        })}
      </svg>

      <div className="relative grid gap-5 lg:grid-cols-[1fr_17rem_1fr] lg:grid-rows-2 lg:gap-x-10 lg:gap-y-8">
        {/* Centre: one plan */}
        <div className="flex flex-col items-center justify-center rounded-3xl border border-accent/30 bg-[#14161b] bg-[radial-gradient(circle_at_50%_40%,rgb(199_155_105/0.22),transparent_70%)] p-6 text-center lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="relative grid h-24 w-24 place-items-center">
            <span aria-hidden="true" className="absolute inset-0 rounded-full border border-accent/40 motion-safe:animate-[spin_18s_linear_infinite]" style={{ borderStyle: 'dashed' }} />
            <Logo variant="mark" alt="" className="h-auto w-12" />
          </div>
          <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-accent">One plan</p>
          <p key={active.id} className="fade-in mt-3 text-[0.95rem] leading-relaxed text-muted" aria-live="polite">
            <span className="block font-medium text-fg">{active.label}</span>
            {disciplineDetails[active.id].body}
          </p>
        </div>

        {disciplines.map((d, i) => {
          const on = i === index
          const Icon = disciplineIcons[d.id]
          const pos = ['lg:col-start-1 lg:row-start-1', 'lg:col-start-3 lg:row-start-1', 'lg:col-start-1 lg:row-start-2', 'lg:col-start-3 lg:row-start-2'][i]
          return (
            <button
              key={d.id}
              type="button"
              aria-pressed={on}
              onClick={() => select(i)}
              onMouseEnter={() => select(i)}
              onFocus={() => select(i)}
              className={`group relative overflow-hidden rounded-3xl border p-6 text-left transition-[border-color,background,transform] duration-500 lg:p-8 ${pos} ${
                on ? 'border-accent/60 bg-[#1d1f25] lg:-translate-y-1' : 'border-line bg-[#17191e] hover:border-line-strong'
              }`}
            >
              <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-0'}`} />
              <span className="flex items-start justify-between gap-4">
                <span className={`grid h-11 w-11 place-items-center rounded-2xl border transition-colors ${on ? 'border-accent/60 text-accent' : 'border-line-strong text-muted'}`}>
                  <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <DisciplineGlyph id={d.id} on={on} />
              </span>
              <span className="mt-8 block font-mono text-[0.68rem] text-subtle">0{i + 1}</span>
              <span className="mt-1 block text-[clamp(1.5rem,2.2vw,2rem)] font-medium tracking-[-0.03em]">{d.label}</span>
              <span className="mt-1 block font-serif text-lg italic text-accent">{d.note}</span>
              <span className="mt-4 flex flex-wrap gap-1.5">
                {disciplineDetails[d.id].tags.map((t) => (
                  <span key={t} className="rounded-full border border-line-strong px-2.5 py-0.5 text-[0.75rem] text-muted">
                    {t}
                  </span>
                ))}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  D · Friction diagnostic                                              */
/* ------------------------------------------------------------------ */
export function FrictionDiagnostic() {
  const [index, setIndex] = useState(0)
  const { refs, onKeyDown } = useArrowKeys(layers.length, index, setIndex)
  const l = layers[index]
  const f = layerFriction[l.id]
  const service = serviceById(l.services[0])!

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div role="tablist" aria-label="Choose the layer causing friction" aria-orientation="vertical" onKeyDown={onKeyDown} className="grid gap-2">
          {layers.map((layer, i) => {
            const on = i === index
            const Icon = layerIcons[i]
            return (
              <button
                key={layer.id}
                ref={(el) => {
                  refs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`friction-tab-${layer.id}`}
                aria-selected={on}
                aria-controls="friction-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setIndex(i)}
                className={`flex items-center justify-between gap-3 rounded-full border px-5 py-3 text-left transition-colors duration-300 ${on ? 'border-fg bg-fg text-canvas' : 'border-line-strong hover:border-fg'}`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={15} aria-hidden="true" className={on ? 'text-accent' : 'text-muted'} />
                  {layer.name}
                </span>
                <ArrowRight size={14} aria-hidden="true" className={`transition-transform ${on ? 'translate-x-0.5' : 'opacity-40'}`} />
              </button>
            )
          })}
        </div>

        {/* Diagram: the selected layer glows, the friction ripples into its neighbours */}
        <div aria-hidden="true" className="mt-8 space-y-1.5 rounded-2xl border border-line bg-surface p-4" style={{ perspective: '900px' }}>
          {layers.map((layer, i) => {
            const dist = Math.abs(i - index)
            return (
              <div
                key={layer.id}
                className="relative flex h-9 items-center justify-between rounded-lg border px-3 text-[0.72rem] transition-all duration-500"
                style={{
                  borderColor: dist === 0 ? '#c4705a' : 'var(--color-line)',
                  background: dist === 0 ? 'rgb(196 112 90 / 0.12)' : dist === 1 ? 'rgb(196 112 90 / 0.04)' : 'transparent',
                  transform: dist === 0 ? 'translateZ(24px)' : 'none',
                }}
              >
                <span className={dist === 0 ? 'font-medium text-fg' : 'text-subtle'}>
                  L{i + 1} · {layer.name}
                </span>
                {dist === 0 ? (
                  <span className="flex items-center gap-1.5 text-[#a4513d]">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[#c4705a] opacity-60 motion-safe:animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c4705a]" />
                    </span>
                    Friction
                  </span>
                ) : dist === 1 ? (
                  <span className="text-subtle">affected</span>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>

      <div id="friction-panel" role="tabpanel" aria-labelledby={`friction-tab-${l.id}`} className="lg:col-span-6 lg:col-start-7">
        <div key={l.id} className="fade-in rounded-3xl border border-line bg-canvas-alt/60 p-6 sm:p-8">
          <p className="eyebrow text-accent-ink">
            L{index + 1} · {l.name}
          </p>
          <h3 className="mt-3 text-[clamp(1.5rem,2.2vw,2rem)] font-medium tracking-[-0.03em]">Signs the friction is here</h3>
          <ul className="mt-5 space-y-3">
            {f.signs.map((s) => (
              <li key={s} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c4705a]" />
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-line pt-6">
            <p className="eyebrow text-subtle">Where we’d usually start</p>
            <p className="mt-3 text-lg leading-relaxed">{f.start}</p>
          </div>
          <p className="eyebrow mt-8 text-subtle">Related services</p>
          <ServiceLinks ids={l.services} className="mt-3" />
          <ButtonLink to={contactHref({ service: service.title })} className="mt-8">
            Talk to us about {l.name.toLowerCase()}
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}

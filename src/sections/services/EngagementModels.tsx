import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { withBase } from '@/lib/base'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { contactHref } from '@/lib/enquiry'
import { gsap, MOTION, SplitText, useGSAP } from '@/lib/gsap'

/* ------------------------------------------------------------------ */
/*  Isometric helpers (SVG)                                            */
/* ------------------------------------------------------------------ */
type Pt = [number, number]
const isoP = (ox: number, oy: number, s: number) => (x: number, y: number, z: number): Pt => [ox + (x - y) * 0.866 * s, oy + (x + y) * 0.5 * s - z * s]
const poly = (pts: Pt[]) => pts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ')

/** An isometric box: top + two visible faces, filled with the given gradients. */
function IsoBox({ P, x, y, w, d, h, z = 0, top, left, right, stroke = 'rgb(255 255 255 / 0.55)' }: {
  P: ReturnType<typeof isoP>
  x: number; y: number; w: number; d: number; h: number; z?: number
  top: string; left: string; right: string; stroke?: string
}) {
  const t: Pt[] = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)]
  const l: Pt[] = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)]
  const r: Pt[] = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)]
  return (
    <g>
      <polygon points={poly(l)} fill={left} />
      <polygon points={poly(r)} fill={right} />
      <polygon points={poly(t)} fill={top} stroke={stroke} strokeWidth={0.8} />
    </g>
  )
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-champ`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fbf3e8" />
        <stop offset="1" stopColor="#e3cfb4" />
      </linearGradient>
      <linearGradient id={`${id}-bronzeL`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d9b690" />
        <stop offset="1" stopColor="#a8754c" />
      </linearGradient>
      <linearGradient id={`${id}-bronzeR`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b98a5c" />
        <stop offset="1" stopColor="#7a5638" />
      </linearGradient>
      <linearGradient id={`${id}-pearlL`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#efe7dc" />
        <stop offset="1" stopColor="#cdbfae" />
      </linearGradient>
      <linearGradient id={`${id}-pearlR`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ddd2c4" />
        <stop offset="1" stopColor="#b3a593" />
      </linearGradient>
      <linearGradient id={`${id}-graphT`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#6b6c72" />
        <stop offset="1" stopColor="#3a3b40" />
      </linearGradient>
      <linearGradient id={`${id}-graphL`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3a3b40" />
        <stop offset="1" stopColor="#1b1c20" />
      </linearGradient>
      <linearGradient id={`${id}-graphR`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a2b30" />
        <stop offset="1" stopColor="#111216" />
      </linearGradient>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.75" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.15" />
      </linearGradient>
      <radialGradient id={`${id}-orb`} cx="0.35" cy="0.3" r="0.75">
        <stop offset="0" stopColor="#fff6ea" />
        <stop offset="0.45" stopColor="#c79b69" />
        <stop offset="1" stopColor="#5a3a24" />
      </radialGradient>
      <radialGradient id={`${id}-steel`} cx="0.35" cy="0.3" r="0.75">
        <stop offset="0" stopColor="#f4f2ee" />
        <stop offset="0.45" stopColor="#8f8a82" />
        <stop offset="1" stopColor="#2a2b30" />
      </radialGradient>
      <radialGradient id={`${id}-core`} cx="0.38" cy="0.32" r="0.8">
        <stop offset="0" stopColor="#d8d4cd" />
        <stop offset="0.5" stopColor="#5c5d63" />
        <stop offset="1" stopColor="#141519" />
      </radialGradient>
      <radialGradient id={`${id}-floor`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#3a2a1d" stopOpacity="0.22" />
        <stop offset="1" stopColor="#3a2a1d" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

/* ------------------------------------------------------------------ */
/*  01 — Milestones                                                    */
/* ------------------------------------------------------------------ */
function MilestonesArt() {
  const id = useId().replace(/:/g, '')
  // Steps advance along x and -y, which moves straight right on screen while heights rise.
  const P = isoP(78, 228, 30)
  const steps = [0, 1, 2, 3, 4]
  const sx = (i: number) => i * 1.05
  const sy = (i: number) => -i * 1.05
  const tops = steps.map((i) => {
    const h = 0.5 + i * 0.85
    const c = P(sx(i) + 0.5, sy(i) + 0.5, h)
    return { h, c }
  })
  const line = tops.map((t, i) => `${i ? 'L' : 'M'}${t.c[0].toFixed(1)} ${(t.c[1] - 14).toFixed(1)}`).join(' ')
  const last = tops[tops.length - 1].c
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full overflow-visible" aria-hidden="true">
      <Defs id={id} />
      <ellipse cx="210" cy="255" rx="170" ry="26" fill={`url(#${id}-floor)`} />
      {/* Glass panel behind */}
      <polygon data-layer="back" points={poly([P(0.2, -0.6, 0.2), P(4.6, -5, 0.2), P(4.6, -5, 5.2), P(0.2, -0.6, 2.4)])} fill={`url(#${id}-glass)`} stroke="rgb(255 255 255 / 0.8)" strokeWidth="0.8" />
      {steps.map((i) => (
        <g key={i} data-step>
          <IsoBox
            P={P}
            x={sx(i)}
            y={sy(i)}
            w={1}
            d={1}
            h={tops[i].h}
            top={`url(#${id}-champ)`}
            left={i % 2 ? `url(#${id}-bronzeL)` : `url(#${id}-pearlL)`}
            right={i % 2 ? `url(#${id}-bronzeR)` : `url(#${id}-pearlR)`}
          />
        </g>
      ))}
      <path data-line d={line} fill="none" stroke="#b98a5c" strokeWidth="1.6" strokeLinecap="round" pathLength={1} strokeDasharray="1" />
      {tops.slice(0, -1).map((t, i) => (
        <circle key={i} data-dot cx={t.c[0]} cy={t.c[1] - 14} r="5" fill={`url(#${id}-orb)`} />
      ))}
      <g data-flag>
        <line x1={last[0]} y1={last[1] - 10} x2={last[0]} y2={last[1] - 52} stroke="#5a3a24" strokeWidth="1.6" />
        <path d={`M${last[0]} ${last[1] - 52} l22 6 l-7 6 l7 6 l-22 -2 z`} fill={`url(#${id}-bronzeL)`} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  02 — Layered modules                                               */
/* ------------------------------------------------------------------ */
function ModulesArt() {
  const id = useId().replace(/:/g, '')
  const P = isoP(200, 150, 44)
  const layers = [
    { z: 0, h: 0.18, glass: true },
    { z: 0.55, h: 0.32, tone: 'graph' },
    { z: 1.05, h: 0.32, tone: 'bronze' },
    { z: 1.55, h: 0.32, tone: 'graph' },
    { z: 2.35, h: 0.2, tone: 'bronze', lid: true },
  ]
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full overflow-visible" aria-hidden="true">
      <Defs id={id} />
      <ellipse cx="200" cy="262" rx="150" ry="24" fill={`url(#${id}-floor)`} />
      {/* Glass panels behind */}
      <polygon data-layer="back" points={poly([P(-1.6, -0.4, 0), P(-1.6, 1.8, 0), P(-1.6, 1.8, 1.8), P(-1.6, -0.4, 1.8)])} fill={`url(#${id}-glass)`} stroke="rgb(255 255 255 / 0.8)" strokeWidth="0.8" />
      <polygon data-layer="back" points={poly([P(-0.2, -1.6, 0), P(2.2, -1.6, 0), P(2.2, -1.6, 2.6), P(-0.2, -1.6, 2.6)])} fill={`url(#${id}-glass)`} stroke="rgb(255 255 255 / 0.8)" strokeWidth="0.8" />
      {/* Light shaft */}
      <polygon points={poly([P(0.3, 0.3, 0.2), P(1.7, 0.3, 0.2), P(1.7, 1.7, 0.2), P(0.3, 1.7, 0.2)])} fill="#fff6ea" opacity="0.6" />
      {layers.map((l, i) => {
        const ext = l.lid ? 0.25 : 0
        return (
          <g key={i} data-module data-index={i}>
            {l.glass ? (
              <IsoBox P={P} x={-0.1} y={-0.1} w={2.2} d={2.2} h={l.h} z={l.z} top="rgb(255 255 255 / 0.55)" left="rgb(217 182 144 / 0.35)" right="rgb(185 138 92 / 0.3)" stroke="rgb(185 138 92 / 0.6)" />
            ) : (
              <IsoBox
                P={P}
                x={-ext}
                y={-ext}
                w={2 + ext * 2}
                d={2 + ext * 2}
                h={l.h}
                z={l.z}
                top={l.tone === 'graph' ? `url(#${id}-graphT)` : `url(#${id}-champ)`}
                left={l.tone === 'graph' ? `url(#${id}-graphL)` : `url(#${id}-bronzeL)`}
                right={l.tone === 'graph' ? `url(#${id}-graphR)` : `url(#${id}-bronzeR)`}
              />
            )}
          </g>
        )
      })}
      {/* Fine guide lines between layers */}
      {[0.4, 1.6].map((x) =>
        [0.4, 1.6].map((y) => {
          const a = P(x, y, 0.2)
          const b = P(x, y, 2.35)
          return <line key={`${x}-${y}`} data-guide x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#c79b69" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.7" />
        }),
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  03 — Orbital system                                                */
/* ------------------------------------------------------------------ */
const ORBITS = [
  { rx: 150, ry: 46, rot: -14, speed: 0.22, nodes: [{ a: 0.4, r: 11, m: 'orb' }, { a: 3.6, r: 9, m: 'steel' }] },
  { rx: 118, ry: 70, rot: 22, speed: -0.16, nodes: [{ a: 1.7, r: 13, m: 'steel' }, { a: 4.6, r: 8, m: 'orb' }] },
  { rx: 170, ry: 32, rot: 6, speed: 0.12, nodes: [{ a: 2.6, r: 10, m: 'orb' }] },
]

function OrbitArt({ active }: { active: boolean }) {
  const id = useId().replace(/:/g, '')
  const nodes = useRef<(SVGCircleElement | null)[]>([])
  const cx = 200
  const cy = 150

  useEffect(() => {
    const flat = ORBITS.flatMap((o, oi) => o.nodes.map((n) => ({ o, oi, n, a: n.a })))
    const place = (dt: number) => {
      flat.forEach((f, k) => {
        f.a += f.o.speed * dt
        const r = (f.o.rot * Math.PI) / 180
        const ex = Math.cos(f.a) * f.o.rx
        const ey = Math.sin(f.a) * f.o.ry
        const el = nodes.current[k]
        if (!el) return
        el.setAttribute('cx', (cx + ex * Math.cos(r) - ey * Math.sin(r)).toFixed(1))
        el.setAttribute('cy', (cy + ex * Math.sin(r) + ey * Math.cos(r)).toFixed(1))
      })
    }
    place(0)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!active || reduced) return
    let last = performance.now()
    const tick = () => {
      const now = performance.now()
      place(Math.min(0.05, (now - last) / 1000))
      last = now
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [active])

  let k = 0
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full overflow-visible" aria-hidden="true">
      <Defs id={id} />
      <ellipse cx="200" cy="262" rx="140" ry="22" fill={`url(#${id}-floor)`} />
      <circle data-layer="back" cx={cx + 40} cy={cy - 30} r="96" fill={`url(#${id}-glass)`} stroke="rgb(255 255 255 / 0.85)" strokeWidth="0.8" />
      {ORBITS.map((o, i) => (
        <ellipse key={i} data-ring cx={cx} cy={cy} rx={o.rx} ry={o.ry} transform={`rotate(${o.rot} ${cx} ${cy})`} fill="none" stroke="#c79b69" strokeWidth="1.1" opacity="0.85" />
      ))}
      <g data-core>
        <circle cx={cx} cy={cy} r="54" fill={`url(#${id}-core)`} />
        <ellipse cx={cx - 16} cy={cy - 22} rx="18" ry="10" fill="#ffffff" opacity="0.28" />
        <image href={withBase('/brand/z-mark.webp')} x={cx - 26} y={cy - 22} width="52" height={(52 * 248) / 284} opacity="0.95" />
      </g>
      {ORBITS.map((o) =>
        o.nodes.map((n) => {
          const idx = k++
          return (
            <circle
              key={idx}
              data-node
              ref={(el) => {
                nodes.current[idx] = el
              }}
              r={n.r}
              cx={cx}
              cy={cy}
              fill={`url(#${id}-${n.m})`}
              style={{ filter: 'drop-shadow(0 4px 6px rgb(58 42 29 / 0.3))' }}
            />
          )
        }),
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
type Model = {
  index: string
  name: string
  description: string
  includes: string[]
  art: (active: boolean) => ReactNode
}

const models: Model[] = [
  {
    index: '01',
    name: 'Defined project',
    description: 'A website, application, or system with a clear scope and delivery plan.',
    includes: ['Clear scope', 'Defined deliverables', 'Milestone-based delivery'],
    art: () => <MilestonesArt />,
  },
  {
    index: '02',
    name: 'Phased product build',
    description: 'Build the essentials first, then expand with confidence.',
    includes: ['Prioritised features', 'Staged releases', 'Iterative development'],
    art: () => <ModulesArt />,
  },
  {
    index: '03',
    name: 'Ongoing partnership',
    description: 'Continuous improvements for products, platforms, and business systems.',
    includes: ['Ongoing development', 'Improvements', 'Support'],
    art: (active) => <OrbitArt active={active} />,
  },
]

/** /services: engagement models — three editorial panels with animated isometric illustrations. */
export function EngagementModels() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        // Heading
        const split = SplitText.create(q('#engage-title')[0], { type: 'lines', mask: 'lines', linesClass: 'split-line' })
        gsap
          .timeline({ scrollTrigger: { trigger: q('[data-engage-head]')[0], start: 'top 82%', once: true } })
          .from(q('[data-engage-head] .eyebrow'), { autoAlpha: 0, y: 12, duration: 0.9 })
          .from(split.lines, { yPercent: 112, duration: 1.3, stagger: 0.08, ease: 'expo.out' }, 0.05)
          .from(q('[data-engage-head] [data-sub]'), { autoAlpha: 0, y: 14, duration: 1 }, 0.35)

        // Panels reveal
        q('[data-model]').forEach((panel, i) => {
          const p = gsap.utils.selector(panel)
          const tl = gsap.timeline({ scrollTrigger: { trigger: panel, start: 'top 85%', once: true }, delay: i * 0.08 })
          tl.from(panel, { autoAlpha: 0, y: 40, duration: 1.2, ease: 'expo.out' })
            .from(p('[data-text] > *'), { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.06, ease: 'expo.out' }, 0.3)
            .from(p('[data-layer]'), { autoAlpha: 0, duration: 1.2 }, 0.2)
          // 01: steps rise, then the gold line draws and the dots appear
          if (p('[data-step]').length) {
            tl.from(p('[data-step]'), { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.09, ease: 'back.out(1.4)' }, 0.25)
              .fromTo(p('[data-line]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, 0.8)
              .from(p('[data-dot]'), { scale: 0, transformOrigin: 'center', transformBox: 'fill-box', duration: 0.5, stagger: 0.12, ease: 'back.out(2)' }, 1)
              .from(p('[data-flag]'), { autoAlpha: 0, y: 10, duration: 0.6 }, 1.5)
          }
          // 03: rings and core appear
          if (p('[data-core]').length) {
            tl.from(p('[data-ring]'), { autoAlpha: 0, scale: 0.85, transformOrigin: 'center', transformBox: 'fill-box', duration: 1.2, stagger: 0.1 }, 0.25).from(
              p('[data-core]'),
              { autoAlpha: 0, scale: 0.8, transformOrigin: 'center', transformBox: 'fill-box', duration: 1.2 },
              0.3,
            )
          }
          // Gentle parallax of every illustration
          gsap.fromTo(p('[data-art]'), { y: 24 }, { y: -24, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: 0.8 } })
        })

        // 02: modules assemble as the panel scrolls through the viewport
        q('[data-module]').forEach((m) => {
          const i = Number(m.getAttribute("data-index"))
          gsap.fromTo(
            m,
            { y: -(i * 26) - 10, autoAlpha: i === 0 ? 1 : 0.2 },
            { y: 0, autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: q('[data-modules-panel]')[0], start: 'top 90%', end: 'center 55%', scrub: 0.8 } },
          )
        })
        return () => split.revert()
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="engage-title" className="relative overflow-hidden border-t border-line py-24 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(50%_60%_at_20%_0%,rgb(199_155_105/0.12),transparent_70%)]" />
      <div className="container-x relative">
        <div data-engage-head className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow flex items-center gap-3 text-accent-ink">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              Flexible engagement models
            </p>
            <h2 id="engage-title" className="mt-6 text-[clamp(2.4rem,5.4vw,5.4rem)] font-medium leading-[0.95] tracking-[-0.05em]">
              Ways to work <span className="serif-accent metal-text pr-[0.05em]">together</span>
            </h2>
          </div>
          <p data-sub className="text-lede text-muted lg:col-span-4 lg:pb-2">
            Flexible ways to turn ideas into well-built digital products.
          </p>
        </div>

        <ol className="mt-14 grid lg:mt-20 lg:grid-cols-3">
          {models.map((m, i) => (
            <li key={m.index} className={`border-line ${i ? 'border-t lg:border-l lg:border-t-0' : ''}`}>
              <ModelPanel model={m} index={i} modules={i === 1} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function ModelPanel({ model, index, modules }: { model: Model; index: number; modules?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  // Illustrations that move continuously (the orbit) run only while on screen.
  const [active, setActive] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting))
    io.observe(ref.current!)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-model
      {...(modules ? { 'data-modules-panel': '' } : {})}
      className={`group relative flex h-full flex-col py-10 lg:py-4 ${index === 0 ? 'lg:pr-10' : index === 1 ? 'lg:px-10' : 'lg:pl-10'}`}
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-[0.78rem] text-accent-ink">{model.index}</span>
        <span className="h-px w-8 bg-accent/70 transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:w-14" aria-hidden="true" />
      </div>

      <div className="relative mt-4 h-[15rem] w-full sm:h-[17rem] xl:h-[19rem]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgb(240_217_189/0.55),transparent)] transition-opacity duration-700 group-hover:opacity-100 lg:opacity-70"
        />
        <div data-art className="relative h-full w-full transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]">
          {model.art(active)}
        </div>
      </div>

      <div data-text className="mt-4 flex flex-1 flex-col">
        <h3 className="text-[clamp(1.6rem,2.2vw,2.1rem)] font-medium leading-tight tracking-[-0.03em]">{model.name}</h3>
        <p className="mt-3 max-w-sm leading-relaxed text-muted">{model.description}</p>
        <div className="mt-6 border-t border-line pt-5">
          <p className="eyebrow text-[0.62rem] text-subtle">Includes</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[0.92rem]">
            {model.includes.map((x) => (
              <li key={x} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </div>
        <Link
          to={contactHref({ engagement: model.name })}
          className="mt-auto inline-flex w-fit items-center gap-4 pt-8 text-[0.95rem] font-medium"
          aria-label={`Explore this model: ${model.name}`}
        >
          <span className="link-draw">Explore this model</span>
          <span className="grid h-11 w-11 place-items-center rounded-full border border-line-strong transition-[background-color,border-color,color] duration-500 group-hover:border-fg group-hover:bg-fg group-hover:text-canvas">
            <ArrowRight size={17} aria-hidden="true" className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </div>
  )
}

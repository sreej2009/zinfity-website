import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { featuredTechnologies, techCategories, type Technology } from '@/content/technologies'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { canRender3D } from '@/lib/device'
import { useMediaQuery, useReducedMotion } from '@/hooks/useMediaQuery'
import { gsap, MOTION, ScrollTrigger, useGSAP } from '@/lib/gsap'
import type { RingsState } from '@/visuals/three/TechRingsScene'

const TechRingsScene = lazy(() => import('@/visuals/three/TechRingsScene'))

const all = techCategories.flatMap((c) => c.items)
const byName = new Map(all.map((t) => [t.name, t]))
const featured = featuredTechnologies.map((n) => byName.get(n)).filter(Boolean) as Technology[]

/** Three orbits: size (fraction of the usable radius), speed (rad/s), vertical offset (px), in-plane rotation (rad). */
const ORBITS = [
  { r: 1, speed: 0.07, dy: 0, rot: -0.12 },
  { r: 0.74, speed: -0.085, dy: 10, rot: 0.16 },
  { r: 0.5, speed: 0.1, dy: -12, rot: -0.05 },
]

function scenePanels(cat: string, max: number) {
  const list = cat === 'all' ? featured : (techCategories.find((c) => c.id === cat)?.items ?? [])
  return list.slice(0, max)
}

/** Static ring sculpture for reduced motion / no WebGL. */
function RingsFallback() {
  const ring = (size: string, border: string, color: string, t: string) => (
    <span
      className="absolute left-1/2 top-1/2 rounded-full"
      style={{
        width: size,
        height: size,
        border: `${border} solid ${color}`,
        transform: `translate(-50%, -50%) ${t}`,
        boxShadow: `inset 0 2px 6px rgb(255 255 255 / 0.5), 0 10px 24px rgb(58 42 29 / 0.18)`,
      }}
    />
  )
  return (
    <div aria-hidden="true" className="absolute inset-0" style={{ perspective: '900px' }}>
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {ring('80%', 'clamp(9px,1.6vw,18px)', '#d1ab82', 'rotateX(64deg) rotateZ(18deg)')}
        {ring('64%', 'clamp(7px,1.2vw,14px)', '#2a2b30', 'rotateY(58deg) rotateZ(-24deg)')}
        {ring('46%', 'clamp(6px,1vw,11px)', '#a8754c', 'rotateX(-48deg) rotateY(30deg)')}
      </div>
    </div>
  )
}

/** Home: technology ecosystem — 3D ring sculpture with orbiting glass panels, plus the full filterable collection. */
export function OurTechnologies() {
  const [cat, setCat] = useState('all')
  const [sceneCat, setSceneCat] = useState('all')
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [use3D, setUse3D] = useState(() => canRender3D())
  const reduced = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isTablet = useMediaQuery('(min-width: 640px)')
  const maxPanels = isDesktop ? 12 : isTablet ? 8 : 6

  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const stageOut = useRef<HTMLDivElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  const panelEls = useRef<(HTMLDivElement | null)[]>([])
  const hovered = useRef(-1)
  const size = useRef({ w: 0, h: 0 })
  const state = useMemo<RingsState>(() => ({ pointer: { x: 0, y: 0 }, scroll: 0 }), [])
  const onReady = useCallback(() => setReady(true), [])

  const panels = useMemo(() => scenePanels(sceneCat, maxPanels), [sceneCat, maxPanels])
  const items = cat === 'all' ? all : techCategories.find((c) => c.id === cat)!.items
  const filters = [{ id: 'all', label: 'All', count: all.length }, ...techCategories.map((c) => ({ id: c.id, label: c.label, count: c.items.length }))]

  // Load the scene when approaching; render/animate only while on screen.
  useEffect(() => {
    const el = stage.current!
    const nearIO = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '1400px 0px' })
    // Warm up the 3D scene while the browser is idle so scrolling never waits for it.
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
    const idle = ric ? ric(() => setNear(true), { timeout: 4000 }) : window.setTimeout(() => setNear(true), 2500)
    const visIO = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '80px 0px' })
    nearIO.observe(el)
    visIO.observe(el)
    const ro = new ResizeObserver(([e]) => {
      size.current = { w: e.contentRect.width, h: e.contentRect.height }
    })
    ro.observe(el)
    return () => {
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback
      if (cic) cic(idle)
      else window.clearTimeout(idle)
      nearIO.disconnect()
      visIO.disconnect()
      ro.disconnect()
    }
  }, [])

  // Orbit loop: positions DOM panels along tilted 3D ellipses with perspective.
  useEffect(() => {
    const els = panelEls.current
    const angles = panels.map((_, i) => {
      const o = i % ORBITS.length
      const perOrbit = Math.ceil(panels.length / ORBITS.length)
      return (Math.floor(i / ORBITS.length) / perOrbit) * Math.PI * 2 + o * 1.1
    })
    let last = performance.now()

    const place = (now: number, advance: boolean) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const { w, h } = size.current
      if (!w) return
      const panelW = isDesktop ? 132 : isTablet ? 112 : 96
      const panelH = isDesktop ? 104 : 88
      const R = Math.min(w / 2 - panelW / 2 - 8, isDesktop ? 560 : 340)
      // Vertical radius from the stage height, so front/back panels never leave it.
      const Ry = Math.max(40, h / 2 - panelH / 2 - 14)
      const t = now / 1000
      panels.forEach((_, i) => {
        const el = els[i]
        if (!el) return
        const o = ORBITS[i % ORBITS.length]
        if (advance && hovered.current !== i) angles[i] += o.speed * dt
        const a = angles[i]
        const r = R * o.r
        const z = Math.sin(a) * r
        const persp = R * 4.5
        let s = persp / (persp - z)
        const ex = Math.cos(a) * r
        const ey = Math.sin(a) * Ry * (0.55 + o.r * 0.45) * 0.92
        const depth = (z / r + 1) / 2 // 0 back … 1 front
        const bob = Math.sin(t * 0.9 + i * 1.7) * 5
        const x = ex * Math.cos(o.rot) - ey * Math.sin(o.rot) + state.pointer.x * 22 * (0.4 + depth)
        const y = ex * Math.sin(o.rot) + ey * Math.cos(o.rot) + o.dy + bob + state.pointer.y * -12 * (0.4 + depth)
        let opacity = 0.42 + depth * 0.58
        let zIndex = z < 0 ? 5 : 20 // behind / in front of the WebGL rings
        if (hovered.current === i) {
          s *= 1.14
          opacity = 1
          zIndex = 40
        }
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${(s * (0.8 + depth * 0.14)).toFixed(3)})`
        el.style.opacity = opacity.toFixed(3)
        el.style.zIndex = String(zIndex)
      })
    }

    // Static composition (reduced motion / not animating): place once, and on resize.
    if (reduced || !visible) {
      const id = requestAnimationFrame(() => place(performance.now(), false))
      const ro = new ResizeObserver(() => place(performance.now(), false))
      if (stage.current) ro.observe(stage.current)
      return () => {
        cancelAnimationFrame(id)
        ro.disconnect()
      }
    }
    const tick = () => place(performance.now(), true)
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [panels, visible, reduced, isDesktop, isTablet, state])

  // Category change: fade the floating panels out, swap, then stagger them in.
  useEffect(() => {
    if (cat === sceneCat) return
    if (reduced || !layer.current) {
      setSceneCat(cat)
      return
    }
    const tw = gsap.to(layer.current, { autoAlpha: 0, duration: 0.28, ease: 'power2.in', onComplete: () => setSceneCat(cat) })
    return () => {
      tw.kill()
    }
  }, [cat, sceneCat, reduced])

  useGSAP(
    () => {
      if (!layer.current) return
      gsap.set(layer.current, { autoAlpha: 1 })
      if (reduced) return
      gsap.fromTo(
        layer.current.querySelectorAll('[data-card]'),
        { autoAlpha: 0, scale: 0.82, y: 14 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.9, stagger: 0.05, ease: 'expo.out', overwrite: true },
      )
    },
    { dependencies: [sceneCat, maxPanels], scope: root },
  )

  // Scroll: entrance/exit of the stage, and scroll progress for the sculpture tilt.
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          state.scroll = self.progress
        },
      })
      gsap.matchMedia().add(MOTION, () => {
        gsap.fromTo(
          stage.current,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, ease: 'none', scrollTrigger: { trigger: stage.current, start: 'top 95%', end: 'top 45%', scrub: 0.6 } },
        )
        gsap.to(stageOut.current, {
          autoAlpha: 0.35,
          ease: 'none',
          scrollTrigger: { trigger: stage.current, start: 'bottom 15%', end: 'bottom -15%', scrub: 0.6 },
        })
      })
    },
    { scope: root },
  )

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !isDesktop) return
    const r = e.currentTarget.getBoundingClientRect()
    state.pointer.x = (e.clientX - r.left) / r.width - 0.5
    state.pointer.y = (e.clientY - r.top) / r.height - 0.5
  }
  const onPointerLeave = () => {
    state.pointer.x = 0
    state.pointer.y = 0
    hovered.current = -1
  }

  const show3D = use3D && !reduced

  return (
    <section ref={root} aria-labelledby="tech-title" className="overflow-hidden border-y border-line py-16 lg:py-24">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-3 text-muted">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              Our technologies
            </p>
            <h2 id="tech-title" className="mt-6 text-[clamp(2.2rem,4.6vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.045em]">
              Built with the <span className="serif-accent metal-text pr-[0.04em]">right tools.</span>
            </h2>
          </div>
          <p className="text-lede text-muted lg:col-span-4 lg:col-start-9 lg:pb-2">
            Languages, platforms and systems that power connected digital experiences.
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter technologies"
          className="-mx-[var(--gutter)] mt-10 flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:justify-center lg:px-0"
        >
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={cat === f.id}
              onClick={() => setCat(f.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.82rem] transition-colors duration-300 ${
                cat === f.id ? 'border-fg bg-fg text-canvas' : 'border-line-strong text-fg hover:border-accent-ink'
              }`}
            >
              {f.label}
              <span className={`font-mono text-[0.68rem] ${cat === f.id ? 'text-canvas/70' : 'text-subtle'}`}>{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3D ecosystem (decorative — the accessible list follows below).
          The wrapper carries the scroll-away fade and the stage carries the entrance, so the
          two scroll animations never share one opacity value. */}
      <div ref={stageOut}>
        <div
          ref={stage}
          aria-hidden="true"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="relative mx-auto mt-6 h-[22rem] w-full max-w-[96rem] sm:h-[28rem] lg:mt-4 lg:h-[38rem]"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(199_155_105/0.16),transparent)]" />
          <div className="pointer-events-none absolute bottom-[10%] left-1/2 h-8 w-[min(36%,22rem)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(58_42_29/0.18),transparent)]" />

          {/* Sculpture: a centred square so the rings keep their proportions */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 aspect-square h-[82%] -translate-x-1/2 -translate-y-1/2 lg:h-[92%]">
            {(!show3D || !ready) && <RingsFallback />}
            {show3D && near && (
              <ErrorBoundary fallback={<FailedScene onFail={() => setUse3D(false)} />}>
                <Suspense fallback={null}>
                  <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
                    <TechRingsScene state={state} active={visible} compact={!isDesktop} onReady={onReady} />
                  </div>
                </Suspense>
              </ErrorBoundary>
            )}
          </div>

          {/* Orbiting glass panels */}
          <div ref={layer} className="absolute inset-0">
            {panels.map((t, i) => (
              <div
                key={`${sceneCat}-${t.name}`}
                ref={(el) => {
                  panelEls.current[i] = el
                }}
                onPointerEnter={() => (hovered.current = i)}
                onPointerLeave={() => (hovered.current = -1)}
                className="absolute left-1/2 top-1/2 will-change-transform"
                style={{ opacity: 0 }}
              >
                <div
                  data-card
                  className="flex w-24 flex-col items-center gap-2 rounded-2xl border border-[#ded9d0]/90 bg-[#fbfaf7]/95 px-3 pb-3 pt-4 shadow-[0_18px_40px_-18px_rgb(58_42_29/0.35),inset_0_1px_0_rgb(255_255_255/0.9)] transition-[box-shadow,border-color] duration-500 hover:border-accent/70 hover:shadow-[0_26px_50px_-18px_rgb(140_94_52/0.4),inset_0_1px_0_rgb(255_255_255/0.9)] sm:w-28 lg:w-[8.25rem] lg:pt-5"
                >
                  <img src={t.logo} alt="" draggable={false} className="h-8 w-8 object-contain lg:h-10 lg:w-10" />
                  <span className="whitespace-nowrap text-center text-[0.72rem] font-medium tracking-[-0.01em] text-fg lg:text-[0.8rem]">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complete collection: running lines (static grid with reduced motion or short lists) */}
      <div className="mt-6 lg:mt-2">
        <p className="sr-only" aria-live="polite">
          Showing {items.length} technologies
        </p>
        {/* Accessible list (each technology once); the moving rows below are decorative copies. */}
        <ul aria-label="Technologies" className="sr-only">
          {items.map((t) => (
            <li key={t.name}>{t.name}</li>
          ))}
        </ul>
        {reduced || items.length < 8 ? (
          <ul key={cat} aria-hidden="true" className="container-x flex flex-wrap justify-center gap-2.5">
            {items.map((t, i) => (
              <TechChip key={t.name} tech={t} index={i} />
            ))}
          </ul>
        ) : (
          <div key={cat} aria-hidden="true" className="tech-marquee space-y-3">
            {(items.length >= 14 ? [items.slice(0, Math.ceil(items.length / 2)), items.slice(Math.ceil(items.length / 2))] : [items]).map((row, r) => (
              <MarqueeRow key={r} row={row} reverse={r === 1} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function TechChip({ tech, index }: { tech: Technology; index?: number }) {
  return (
    <li
      className={`${index !== undefined ? 'tech-tile' : ''} flex shrink-0 items-center gap-3 rounded-xl border border-line bg-white/55 px-4 py-3 transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-[0_12px_28px_-16px_rgb(140_94_52/0.35)]`}
      style={index !== undefined ? { ['--i' as string]: index } : undefined}
    >
      <img src={tech.logo} alt="" decoding="async" draggable={false} className="h-6 w-6 shrink-0 object-contain" />
      <span className="whitespace-nowrap text-[0.9rem] leading-tight text-fg">{tech.name}</span>
    </li>
  )
}

/** One seamless running line: the row is repeated to fill wide screens, then duplicated for a -50% loop. */
function MarqueeRow({ row, reverse }: { row: Technology[]; reverse?: boolean }) {
  const reps = Math.max(1, Math.ceil(12 / row.length))
  const half = Array.from({ length: reps }, () => row).flat()
  return (
    <div className="tech-marquee__row" style={{ ['--marquee-duration' as string]: `${half.length * 3.2}s` }}>
      <ul className={`tech-marquee__track flex w-max gap-3 ${reverse ? 'tech-marquee__track--reverse' : ''}`}>
        {[...half, ...half].map((t, i) => (
          <TechChip key={`${t.name}-${i}`} tech={t} />
        ))}
      </ul>
    </div>
  )
}

function FailedScene({ onFail }: { onFail: () => void }) {
  useEffect(onFail, [onFail])
  return null
}

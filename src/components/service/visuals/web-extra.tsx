import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, Code2, Gauge, MousePointerClick, PenLine, RefreshCw, X } from 'lucide-react'
import { useAutoCycle } from '@/hooks/useAutoCycle'
import { gsap, MOTION, ScrollTrigger, useGSAP } from '@/lib/gsap'

type Pair = { title: string; body: string }
const ink = (o: number) => `rgb(23 23 23 / ${o})`

/* ------------------------------------------------------------------ */
/*  Symptoms: each problem shown broken, then fixed, in a browser        */
/* ------------------------------------------------------------------ */
function Scene({ i, fixed }: { i: number; fixed: boolean }) {
  const line = (w: string, o = 0.14) => <span className="block h-1.5 rounded-full" style={{ width: w, background: ink(o) }} />
  // 0 — the site tells an older story
  if (i === 0)
    return fixed ? (
      <div className="grid h-full grid-cols-5 items-center gap-4 p-6">
        <div className="col-span-3 space-y-2">
          <span className="text-[0.62rem] uppercase tracking-[0.14em] text-accent-ink">Services · 2026</span>
          <p className="text-[1.15rem] font-medium leading-tight tracking-[-0.02em]">Connected systems for growing teams</p>
          {line('80%')}
          <span className="mt-2 inline-block rounded-full bg-[#171717] px-3 py-1 text-[0.6rem] text-white">See what we do</span>
        </div>
        <span className="col-span-2 h-[70%] rounded-xl bg-[linear-gradient(135deg,#e8cfae,#a8754c)]" />
      </div>
    ) : (
      <div className="h-full bg-[#eef0f4] p-5 font-serif">
        <p className="text-center text-[1rem] font-bold text-[#24408e]">Welcome to Our Homepage!</p>
        <p className="mt-1 text-center text-[0.6rem] text-[#555]">Established 2012 · Best viewed in 1024×768</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[0.55rem] text-[#24408e] underline">
          <span>Our old services</span>
          <span>Fax enquiry</span>
          <span>News (2016)</span>
        </div>
        <div className="mt-3 h-[45%] rounded-sm bg-[repeating-linear-gradient(45deg,#d9dde6_0_8px,#e6e9ef_8px_16px)]" />
      </div>
    )
  // 1 — every change needs a developer
  if (i === 1)
    return fixed ? (
      <div className="flex h-full flex-col gap-3 p-5">
        <p className="flex items-center gap-1.5 text-[0.62rem] text-muted">
          <PenLine size={11} className="text-accent-ink" /> Page editor
        </p>
        <label className="block rounded-lg border border-accent-ink bg-white p-2.5">
          <span className="block text-[0.55rem] uppercase tracking-[0.12em] text-subtle">Headline</span>
          <span className="mt-1 block text-[0.85rem]">Spring opening hours<span className="ml-0.5 animate-pulse">|</span></span>
        </label>
        <div className="rounded-lg border border-line bg-white p-2.5">
          <span className="block text-[0.55rem] uppercase tracking-[0.12em] text-subtle">Image</span>
          <span className="mt-1.5 block h-8 w-16 rounded bg-[linear-gradient(135deg,#e8cfae,#a8754c)]" />
        </div>
        <span className="mt-auto w-fit rounded-full bg-[#171717] px-3 py-1 text-[0.6rem] text-white">Publish</span>
      </div>
    ) : (
      <div className="h-full bg-[#15171c] p-5 font-mono text-[0.62rem] leading-relaxed text-[#c9ced8]">
        <p className="flex items-center gap-1.5 text-[#8a909c]">
          <Code2 size={11} /> index.html
        </p>
        <p className="mt-2"><span className="text-[#c79b69]">&lt;h1</span> class="hero-title-v3"<span className="text-[#c79b69]">&gt;</span></p>
        <p className="pl-4">Winter opening hours</p>
        <p><span className="text-[#c79b69]">&lt;/h1&gt;</span></p>
        <p className="mt-3 text-[#8a909c]">// ask a developer to change this</p>
        <p className="mt-3 inline-block rounded bg-[#2a2d35] px-2 py-1 text-[#e8a090]">Ticket #214 · waiting</p>
      </div>
    )
  // 2 — slow pages, poor mobile
  if (i === 2)
    return fixed ? (
      <div className="grid h-full grid-cols-[1fr_auto] items-center gap-5 p-6">
        <div className="space-y-2">
          <span className="block h-2.5 w-3/4 rounded bg-[#171717]/80" />
          {line('90%')}
          {line('70%')}
          <span className="block h-16 rounded-lg bg-[linear-gradient(135deg,#e8cfae,#a8754c)]" />
          <p className="flex items-center gap-1.5 pt-1 text-[0.62rem] text-[#2f5a35]">
            <Gauge size={12} /> Loads quickly, fits every screen
          </p>
        </div>
        <div className="w-16 rounded-[0.9rem] border-[3px] border-[#171717] bg-white p-1.5">
          <span className="block h-1 w-1/2 rounded bg-[#171717]/70" />
          <span className="mt-1.5 block h-7 rounded bg-[linear-gradient(135deg,#e8cfae,#a8754c)]" />
          <span className="mt-1 block h-1 rounded bg-[#171717]/15" />
          <span className="mt-1 block h-1 w-2/3 rounded bg-[#171717]/15" />
        </div>
      </div>
    ) : (
      <div className="grid h-full grid-cols-[1fr_auto] items-center gap-5 p-6">
        <div className="space-y-2">
          <span className="block h-2 w-full overflow-hidden rounded-full bg-line">
            <span className="block h-full w-[22%] rounded-full bg-[#c4705a]" />
          </span>
          <p className="flex items-center gap-1.5 text-[0.62rem] text-[#8a3b2a]">
            <RefreshCw size={11} className="animate-spin [animation-duration:2s] motion-reduce:animate-none" /> Still loading a very large image…
          </p>
          <span className="block h-16 rounded-lg bg-[repeating-linear-gradient(90deg,#e6e1d8_0_10px,#efebe4_10px_20px)]" />
        </div>
        <div className="w-16 overflow-hidden rounded-[0.9rem] border-[3px] border-[#171717] bg-white p-1.5">
          <span className="block h-1 w-[160%] rounded bg-[#171717]/70" />
          <span className="mt-1.5 block h-7 w-[150%] rounded bg-[#e6e1d8]" />
          <span className="mt-1 block text-[0.4rem] leading-tight text-[#8a3b2a]">text cut off →</span>
        </div>
      </div>
    )
  // 3 — no clear next step
  return fixed ? (
    <div className="flex h-full flex-col justify-center gap-2.5 p-6">
      <p className="text-[1.05rem] font-medium leading-tight tracking-[-0.02em]">Ready to plan your project?</p>
      <p className="text-[0.66rem] text-muted">Tell us what you need and we’ll get back to you.</p>
      <div className="mt-1 flex items-center gap-2">
        <span className="relative inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-3.5 py-1.5 text-[0.66rem] text-white">
          Book a call <ArrowRight size={11} />
          <span className="absolute -inset-1 rounded-full border border-accent/70 motion-safe:animate-ping" />
        </span>
        <span className="rounded-full border border-line-strong px-3 py-1.5 text-[0.62rem]">See our work process</span>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-[0.6rem] text-accent-ink">
        <MousePointerClick size={11} /> One clear action per page
      </p>
    </div>
  ) : (
    <div className="h-full space-y-2 p-6">
      {line('90%', 0.2)}
      {line('85%')}
      {line('95%')}
      {line('70%')}
      {line('88%')}
      {line('92%')}
      {line('60%')}
      <p className="pt-2 text-[0.6rem] italic text-subtle">…and then the page simply ends.</p>
    </div>
  )
}

/** Lays scenes out at a fixed design size and scales them to the available width. */
const BASE_W = 440
function FitBox({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / BASE_W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} className="relative aspect-[16/10] overflow-hidden">
      {/* zoom re-lays out at the larger size, so text stays crisp (transform would blur it) */}
      <div className="absolute left-0 top-0" style={{ width: BASE_W, height: BASE_W * 0.625, zoom: scale }}>
        {children}
      </div>
    </div>
  )
}

export function SymptomFixer({ items }: { items: Pair[] }) {
  const root = useRef<HTMLDivElement>(null)
  const { index, select, inView } = useAutoCycle(items.length, root, 4200)
  const [fixed, setFixed] = useState(false)
  const [userToggled, setUserToggled] = useState(false)

  // Each symptom first appears broken, then is fixed — unless the visitor is in control.
  useEffect(() => {
    if (userToggled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setFixed(true)
    setFixed(false)
    if (!inView) return
    const t = setTimeout(() => setFixed(true), 1700)
    return () => clearTimeout(t)
  }, [index, inView, userToggled])

  return (
    <div ref={root} className="grid gap-10 lg:grid-cols-12 lg:items-center">
      <ol className="space-y-2 lg:col-span-5">
        {items.map((p, i) => (
          <li key={p.title}>
            <button
              type="button"
              aria-pressed={i === index}
              onClick={() => {
                select(i)
                setUserToggled(false)
              }}
              className={`group w-full rounded-xl border px-5 py-4 text-left transition-colors duration-500 ${i === index ? 'border-fg bg-surface' : 'border-line hover:border-line-strong'}`}
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-[0.7rem] text-accent-ink">0{i + 1}</span>
                <span className="text-lg font-medium tracking-[-0.015em]">{p.title}</span>
              </span>
              <span className={`grid transition-[grid-template-rows] duration-500 ${i === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <span className="overflow-hidden pl-8 text-[0.94rem] leading-relaxed text-muted">
                  <span className="block pt-1.5">{p.body}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="lg:col-span-7">
        <div className="relative" style={{ perspective: '1600px' }}>
          <div
            className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_50px_80px_-50px_rgb(58_42_29/0.6)] transition-transform duration-700 ease-[var(--ease-out-expo)]"
            style={{ transform: fixed ? 'rotateY(-4deg) rotateX(2deg)' : 'rotateY(3deg) rotateX(1deg)' }}
            aria-hidden="true"
          >
            <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-[#171717]/15" />
              <span className="h-2 w-2 rounded-full bg-[#171717]/15" />
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="ml-2 flex h-5 flex-1 items-center rounded bg-canvas-alt px-2 text-[0.6rem] text-subtle">yourbrand.com</span>
              <span className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.58rem] font-medium transition-colors duration-500 ${fixed ? 'bg-[#e6efe6] text-[#2f5a35]' : 'bg-[#f3e1dc] text-[#8a3b2a]'}`}>
                {fixed ? <Check size={10} /> : <X size={10} />} {fixed ? 'Fixed' : 'Symptom'}
              </span>
            </div>
            <FitBox>
              <div key={`${index}-${fixed}`} className="fade-in absolute inset-0">
                <Scene i={index} fixed={fixed} />
              </div>
            </FitBox>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full border border-line-strong p-1" role="group" aria-label="Show the symptom or the fix">
            {(['Before', 'After'] as const).map((l) => {
              const on = (l === 'After') === fixed
              return (
                <button
                  key={l}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setUserToggled(true)
                    setFixed(l === 'After')
                  }}
                  className={`rounded-full px-4 py-1.5 text-[0.85rem] transition-colors duration-500 ${on ? 'bg-fg text-canvas' : 'text-muted hover:text-fg'}`}
                >
                  {l}
                </button>
              )
            })}
          </div>
          <p className="text-[0.78rem] text-subtle">Illustrative screens.</p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Process: four steps on a track that fills as you scroll              */
/* ------------------------------------------------------------------ */
function StepVisual({ i, on }: { i: number; on: boolean }) {
  const c = on ? '#8c5e34' : 'rgb(23 23 23 / 0.25)'
  if (i === 0)
    // Sitemap tree
    return (
      <svg viewBox="0 0 120 60" className="h-full w-full" aria-hidden="true">
        <rect x="48" y="4" width="24" height="12" rx="3" fill="none" stroke={c} strokeWidth="1.2" />
        <path d="M60 16 V26 M24 26 H96 M24 26 V34 M60 26 V34 M96 26 V34" fill="none" stroke={c} strokeWidth="1" />
        {[12, 48, 84].map((x) => (
          <rect key={x} x={x} y="34" width="24" height="12" rx="3" fill={on ? 'rgb(199 155 105 / 0.2)' : 'none'} stroke={c} strokeWidth="1.2" />
        ))}
        <path d="M24 46 V52 M18 52 H30" fill="none" stroke={c} strokeWidth="1" />
      </svg>
    )
  if (i === 1)
    // Type + palette
    return (
      <div className="flex h-full items-center justify-center gap-4">
        <span className="font-serif text-[2rem] italic leading-none" style={{ color: on ? '#8c5e34' : ink(0.3) }}>
          Aa
        </span>
        <span className="grid grid-cols-2 gap-1">
          {['#171717', '#8c5e34', '#c79b69', '#efe9df'].map((col) => (
            <span key={col} className="h-4 w-4 rounded transition-opacity duration-500" style={{ background: col, opacity: on ? 1 : 0.35, boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / .08)' }} />
          ))}
        </span>
      </div>
    )
  if (i === 2)
    // Templates connected to CMS
    return (
      <div className="flex h-full items-center justify-center gap-2">
        {[0, 1].map((k) => (
          <span key={k} className="flex h-10 w-9 flex-col gap-1 rounded-md border p-1" style={{ borderColor: c }}>
            <span className="h-1 rounded-full" style={{ background: c }} />
            <span className="flex-1 rounded-sm" style={{ background: on ? 'rgb(199 155 105 / 0.3)' : ink(0.06) }} />
          </span>
        ))}
        <span className="h-px w-5" style={{ background: c }} />
        <span className="grid h-10 w-10 place-items-center rounded-full border font-mono text-[0.5rem]" style={{ borderColor: c, color: c }}>
          CMS
        </span>
      </div>
    )
  // Launch: devices tested
  return (
    <div className="flex h-full items-end justify-center gap-2 pb-2">
      <span className="h-9 w-14 rounded-md border-2" style={{ borderColor: c }} />
      <span className="h-8 w-6 rounded-md border-2" style={{ borderColor: c }} />
      <span className="h-6 w-4 rounded border-2" style={{ borderColor: c }} />
      <span className={`mb-5 grid h-5 w-5 place-items-center rounded-full transition-colors duration-500 ${on ? 'bg-[#2f5a35] text-white' : 'bg-line text-subtle'}`}>
        <Check size={11} />
      </span>
    </div>
  )
}

export function ProcessTrack({ steps }: { steps: { name: string; body: string }[] }) {
  const root = useRef<HTMLOListElement>(null)
  const [reached, setReached] = useState(() => (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? steps.length : 0))
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const st = { trigger: root.current, start: 'top 75%', end: 'bottom 55%', scrub: 0.6 }
        gsap.fromTo('[data-track-x]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: st })
        gsap.fromTo('[data-track-y]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: st })
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top 75%',
          end: 'bottom 55%',
          onUpdate: (self) => setReached(Math.min(steps.length, Math.floor(self.progress * steps.length + 0.35))),
          onLeave: () => setReached(steps.length),
        })
      })
    },
    { scope: root },
  )
  return (
    <ol ref={root} className="relative grid gap-6 md:grid-cols-4 md:gap-5">
      {/* Horizontal track (md+) */}
      <span aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-[1.1rem] hidden h-px bg-line-strong md:block" />
      <span aria-hidden="true" data-track-x className="absolute left-[12.5%] right-[12.5%] top-[1.1rem] hidden h-0.5 origin-left bg-accent-ink md:block" />
      {/* Vertical track (mobile) */}
      <span aria-hidden="true" className="absolute bottom-6 left-[1.1rem] top-6 w-px bg-line-strong md:hidden" />
      <span aria-hidden="true" data-track-y className="absolute bottom-6 left-[1.1rem] top-6 w-0.5 origin-top bg-accent-ink md:hidden" />
      {steps.map((p, i) => {
        const on = i < reached
        return (
          <li key={p.name} className="relative grid grid-cols-[2.2rem_1fr] gap-4 md:block">
            <span
              className={`relative z-10 grid h-[2.2rem] w-[2.2rem] place-items-center rounded-full border font-mono text-[0.72rem] transition-colors duration-500 md:mx-auto ${
                on ? 'border-accent-ink bg-accent-ink text-canvas' : 'border-line-strong bg-canvas text-subtle'
              }`}
            >
              {i + 1}
            </span>
            <div
              className={`rounded-2xl border p-5 transition-[border-color,background,transform,box-shadow] duration-700 ease-[var(--ease-out-expo)] md:mt-6 ${
                on ? 'border-line-strong bg-surface shadow-[0_30px_50px_-36px_rgb(58_42_29/0.55)] md:-translate-y-1' : 'border-line'
              }`}
            >
              <div className="h-16 rounded-xl bg-canvas-alt">
                <StepVisual i={i} on={on} />
              </div>
              <p className="eyebrow mt-5 text-subtle">Step {i + 1}</p>
              <h3 className="mt-2 text-xl font-medium tracking-[-0.02em]">{p.name}</h3>
              <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

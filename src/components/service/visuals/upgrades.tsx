import { useRef, useState } from 'react'
import { ArrowRight, BadgeCheck, BarChart3, Bell, Check, FileText, Inbox, ChevronsLeftRight, Code2, Gauge, MapPin, RefreshCw, Search, Smartphone, Star } from 'lucide-react'
import { useAutoCycle } from '@/hooks/useAutoCycle'
import { gsap, MOTION, ScrollTrigger, useGSAP } from '@/lib/gsap'

type Pair = { title: string; body: string }
type Group = { group: string; items: string[] }
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------------ */
/*  Web: a browser audit whose checks tick off as you scroll             */
/* ------------------------------------------------------------------ */
export function WebAudit({ items }: { items: Pair[] }) {
  const root = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(() => (reduced() ? 1 : 0))
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top 70%',
          end: 'bottom 55%',
          onUpdate: (self) => setP(Math.round(self.progress * 100) / 100),
          onLeave: () => setP(1),
        })
      })
    },
    { scope: root },
  )
  const done = Math.floor(p * items.length + 0.001)

  return (
    <div ref={root} className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-[20vh]">
          <div className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_70px_-45px_rgb(58_42_29/0.6)]" aria-hidden="true">
            <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#171717]/15" />
              <span className="h-2 w-2 rounded-full bg-[#171717]/15" />
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="ml-2 flex h-4 flex-1 items-center rounded bg-canvas-alt px-2 text-[0.55rem] text-subtle">yourbrand.com</span>
            </div>
            <div className="relative p-5 pb-7">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="h-2 w-12 rounded bg-[#171717]/80" />
                  <span className="flex gap-1.5">{[0, 1, 2].map((k) => <span key={k} className="h-1.5 w-6 rounded bg-[#171717]/15" />)}</span>
                </div>
                <span className="mt-4 block h-3 w-4/5 rounded bg-[#171717]/80" />
                <span className="block h-3 w-3/5 rounded bg-[#171717]/80" />
                <span className="block h-1.5 w-2/3 rounded bg-[#171717]/15" />
                <span className="block h-[22%] rounded-lg bg-[linear-gradient(135deg,#e8cfae,#a8754c)]" style={{ minHeight: '5rem' }} />
                <div className="grid grid-cols-3 gap-2 pt-1">{[0, 1, 2].map((k) => <span key={k} className="h-10 rounded border border-line" />)}</div>
                <span className="block h-1.5 w-1/2 rounded bg-[#171717]/15" />
                <span className="mt-2 inline-block h-5 w-20 rounded-full bg-[#171717]" />
              </div>
              {/* Scan line */}
              <span className="absolute inset-x-0 h-12 -translate-y-full bg-gradient-to-b from-transparent to-accent/25 transition-[top] duration-150 motion-reduce:hidden" style={{ top: `${Math.min(100, p * 100)}%` }}>
                <span className="absolute inset-x-0 bottom-0 h-px bg-accent-ink" />
              </span>
            </div>
          </div>
          <p className="mt-4 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-subtle" aria-hidden="true">
            Launch checks · {done} / {items.length}
          </p>
        </div>
      </div>
      <ol className="space-y-3 lg:col-span-7">
        {items.map((it, i) => {
          const ok = i < done
          return (
            <li key={it.title} className={`grid grid-cols-[2.5rem_1fr] gap-2 rounded-2xl border p-5 transition-[border-color,background] duration-500 ${ok ? 'border-line-strong bg-surface' : 'border-line'}`}>
              <span className={`grid h-7 w-7 place-items-center rounded-full border transition-colors duration-500 ${ok ? 'border-accent-ink bg-accent-ink text-canvas' : 'border-line-strong text-subtle'}`}>
                {ok ? <Check size={13} aria-hidden="true" /> : <span className="font-mono text-[0.65rem]">{i + 1}</span>}
              </span>
              <div>
                <h3 className="text-lg font-medium tracking-[-0.015em]">{it.title}</h3>
                <p className="mt-1.5 leading-relaxed text-muted">{it.body}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Mobile: each capability group demonstrated on a phone screen         */
/* ------------------------------------------------------------------ */
function PhoneScreen({ i }: { i: number }) {
  if (i === 0)
    // Product: prioritised features + store listing preview
    return (
      <div className="space-y-2 p-3">
        <p className="text-[0.62rem] font-medium">Feature priorities</p>
        {['Book a job', 'Offline notes', 'Photo upload', 'Dark mode'].map((f, k) => (
          <div key={f} className="flex items-center gap-2 rounded-lg border border-line bg-white px-2 py-1.5 text-[0.58rem]">
            <span className={`h-1.5 w-1.5 rounded-full ${k < 2 ? 'bg-accent-ink' : k < 3 ? 'bg-accent' : 'bg-line-strong'}`} />
            {f}
            <span className="ml-auto text-subtle">{k < 2 ? 'Must' : k < 3 ? 'Should' : 'Later'}</span>
          </div>
        ))}
        <div className="mt-2 rounded-lg bg-canvas-alt p-2">
          <p className="flex items-center gap-1 text-[0.56rem] text-muted"><Star size={9} /> Store listing draft</p>
          <div className="mt-1.5 flex gap-1">{[0, 1, 2].map((k) => <span key={k} className="h-8 flex-1 rounded bg-[linear-gradient(160deg,#f0d9bd,#a8754c)]" style={{ opacity: 1 - k * 0.25 }} />)}</div>
        </div>
      </div>
    )
  if (i === 1)
    // Engineering: offline + push + device features
    return (
      <div className="space-y-2 p-3">
        <div className="flex items-center gap-2 rounded-xl bg-[#171717] px-2.5 py-2 text-[0.58rem] text-white">
          <Bell size={11} className="text-accent" /> New job assigned · tap to open
        </div>
        <div className="rounded-lg border border-line bg-white p-2">
          <p className="flex items-center gap-1 text-[0.58rem] font-medium"><MapPin size={10} className="text-accent-ink" /> Site 2 · checked in</p>
          <div className="mt-1.5 h-10 rounded bg-[repeating-linear-gradient(45deg,#efe9df_0_6px,#f7f4ef_6px_12px)]" />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-dashed border-accent/60 bg-accent/10 px-2 py-1.5 text-[0.56rem]">
          <span>Offline · 2 changes saved</span>
          <RefreshCw size={10} className="animate-spin text-accent-ink [animation-duration:3s] motion-reduce:animate-none" />
        </div>
      </div>
    )
  // Operations: release pipeline + monitoring
  return (
    <div className="space-y-2 p-3">
      <p className="text-[0.62rem] font-medium">Release 1.4</p>
      {['Build', 'Tests', 'Beta', 'Store review'].map((s, k) => (
        <div key={s} className="flex items-center gap-2 text-[0.58rem]">
          <span className={`grid h-4 w-4 place-items-center rounded-full ${k < 3 ? 'bg-accent-ink text-white' : 'border border-line-strong'}`}>{k < 3 && <Check size={8} />}</span>
          {s}
          <span className="ml-auto h-1 w-12 rounded-full bg-line">
            <span className="block h-full rounded-full bg-accent" style={{ width: k < 3 ? '100%' : '45%' }} />
          </span>
        </div>
      ))}
      <div className="rounded-lg bg-canvas-alt p-2">
        <p className="flex items-center gap-1 text-[0.56rem] text-muted"><Gauge size={9} /> Crash-free sessions · monitored</p>
        <svg viewBox="0 0 100 24" className="mt-1 h-6 w-full" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 14 L20 12 L40 13 L60 8 L80 9 L100 6" fill="none" stroke="#8c5e34" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  )
}

export function CapabilityPhone({ groups }: { groups: Group[] }) {
  const root = useRef<HTMLDivElement>(null)
  const { index, select } = useAutoCycle(groups.length, root, 3400)
  const icons = [Smartphone, Code2, Gauge]
  return (
    <div ref={root} className="grid items-center gap-8 sm:grid-cols-[auto_1fr]">
      <div className="mx-auto w-[12.5rem] rounded-[2rem] border-[6px] border-[#171717] bg-[#faf8f4] shadow-[0_40px_60px_-30px_rgb(0_0_0/0.45)]" style={{ transform: 'perspective(900px) rotateY(-8deg)' }} aria-hidden="true">
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-[#171717]" />
        <div key={index} className="fade-in h-[19rem]">
          <PhoneScreen i={index} />
        </div>
      </div>
      <div role="tablist" aria-label="Capabilities" className="space-y-2">
        {groups.map((g, i) => {
          const I = icons[i] ?? Smartphone
          return (
            <button
              key={g.group}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => select(i)}
              onMouseEnter={() => select(i)}
              className={`w-full rounded-xl border p-4 text-left transition-colors duration-500 ${i === index ? 'border-fg bg-surface' : 'border-line hover:border-line-strong'}`}
            >
              <span className="flex items-center gap-2 font-medium">
                <I size={15} className="text-accent-ink" aria-hidden="true" /> {g.group}
              </span>
              <span className="mt-2 flex flex-wrap gap-1.5">
                {g.items.map((x) => (
                  <span key={x} className="rounded-full border border-line px-2.5 py-0.5 text-[0.8rem] text-muted">
                    {x}
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
/*  ERP: before / after a connected system, as a switchable view          */
/* ------------------------------------------------------------------ */
export function ErpBeforeAfter({ problems, benefits }: { problems: Pair[]; benefits: Pair[] }) {
  const [after, setAfter] = useState(true)
  const items = after ? benefits : problems
  const nodes = ['Sales', 'Stock', 'Finance', 'Service', 'Purchasing']
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-6">
        <div className="inline-flex rounded-full border border-line-strong p-1" role="group" aria-label="Compare before and after">
          {(['Before', 'After'] as const).map((l) => {
            const on = (l === 'After') === after
            return (
              <button key={l} type="button" aria-pressed={on} onClick={() => setAfter(l === 'After')} className={`rounded-full px-5 py-2 text-[0.9rem] transition-colors duration-500 ${on ? 'bg-fg text-canvas' : 'text-muted hover:text-fg'}`}>
                {l}
              </button>
            )
          })}
        </div>
        {/* Diagram: scattered spreadsheets (before) or one connected record (after) */}
        <div className="relative mt-8 aspect-[4/3] rounded-3xl border border-line bg-canvas-alt/60" aria-hidden="true">
          <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full">
            {nodes.map((_, k) => {
              const a = ((-90 + k * 72) * Math.PI) / 180
              const x = 50 + Math.cos(a) * 30
              const y = 37.5 + Math.sin(a) * 26
              return <line key={k} x1="50" y1="37.5" x2={x} y2={y} stroke="#8c5e34" strokeWidth="0.5" style={{ opacity: after ? 1 : 0, transition: 'opacity .6s' }} />
            })}
          </svg>
          {nodes.map((n, k) => {
            const a = ((-90 + k * 72) * Math.PI) / 180
            const ax = 50 + Math.cos(a) * 30
            const ay = 50 + Math.sin(a) * 35
            const bx = [14, 82, 70, 22, 50][k]
            const by = [20, 18, 80, 76, 50][k]
            return (
              <span
                key={n}
                className={`absolute rounded-lg border px-3 py-2 text-[0.75rem] transition-all duration-700 ease-[var(--ease-out-expo)] ${after ? 'border-fg bg-white' : 'border-dashed border-line-strong bg-white/70'}`}
                style={{ left: `${after ? ax : bx}%`, top: `${after ? ay : by}%`, transform: `translate(-50%,-50%) rotate(${after ? 0 : [-8, 6, -4, 9, 3][k]}deg)` }}
              >
                {after ? n : `${n}.xlsx`}
              </span>
            )
          })}
          <span className={`absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-fg text-center text-[0.6rem] leading-tight text-canvas transition-[opacity,transform] duration-700 ${after ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            One
            <br />
            record
          </span>
        </div>
      </div>
      <ul className="space-y-3 lg:col-span-5 lg:col-start-8" aria-live="polite">
        {items.map((it) => (
          <li key={it.title} className="fade-in rounded-2xl border border-line p-5">
            <p className={`eyebrow text-[0.6rem] ${after ? 'text-accent-ink' : 'text-subtle'}`}>{after ? 'After' : 'Before'}</p>
            <h3 className="mt-2 font-medium">{it.title}</h3>
            <p className="mt-1 text-muted">{it.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Marketing: each capability with its own illustrative chart           */
/* ------------------------------------------------------------------ */
function ChannelChart({ i }: { i: number }) {
  if (i === 0)
    // Visibility: search results rising (positions, no numbers)
    return (
      <div className="flex h-full flex-col justify-center gap-3 p-6">
        <p className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-[0.8rem] text-muted"><Search size={14} /> your service near me</p>
        {[0, 1, 2, 3].map((k) => (
          <div key={k} className={`rounded-xl border p-3 ${k === 0 ? 'border-accent-ink bg-accent/10' : 'border-line bg-white'}`}>
            <span className="block text-[0.6rem] text-[#2f7a4f]">{k === 0 ? 'yourbrand.com' : 'another-site.com'}</span>
            <span className={`mt-1 block h-2 rounded-full ${k === 0 ? 'w-1/2 bg-[#1a3d8f]/70' : 'w-2/5 bg-[#171717]/20'}`} />
            <span className="mt-2 block h-1.5 w-4/5 rounded-full bg-[#171717]/10" />
          </div>
        ))}
      </div>
    )
  if (i === 1)
    // Acquisition: funnel bars narrowing
    return (
      <div className="flex h-full flex-col justify-center gap-4 p-6">
        {['Reach', 'Clicks', 'Landing page', 'Enquiries'].map((s, k) => (
          <div key={s} className="flex items-center gap-3 text-[0.8rem]">
            <span className="w-24 shrink-0 text-muted">{s}</span>
            <span className="h-9 rounded-lg bg-[linear-gradient(90deg,#e8cfae,#a8754c)] transition-[width] duration-700" style={{ width: `${88 - k * 20}%`, opacity: 1 - k * 0.12 }} />
          </div>
        ))}
      </div>
    )
  // Insight: dashboard tiles + line
  return (
    <div className="grid h-full grid-cols-2 gap-3 p-6">
      {['Sessions', 'Conversions', 'Cost per lead', 'Channel mix'].map((t, k) => (
        <div key={t} className="flex flex-col rounded-xl border border-line bg-white p-3">
          <p className="text-[0.72rem] text-muted">{t}</p>
          <svg viewBox="0 0 60 20" className="mt-2 w-full flex-1" preserveAspectRatio="none" aria-hidden="true">
            <path d={['M0 16 L15 12 L30 13 L45 7 L60 5', 'M0 15 L15 14 L30 10 L45 9 L60 6', 'M0 6 L15 8 L30 9 L45 12 L60 13', 'M0 12 L15 9 L30 12 L45 8 L60 10'][k]} fill="none" stroke="#8c5e34" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      ))}
    </div>
  )
}

export function ChannelShowcase({ groups }: { groups: Group[] }) {
  const root = useRef<HTMLDivElement>(null)
  const { index, select } = useAutoCycle(groups.length, root, 3400)
  return (
    <div ref={root} className="grid gap-8 lg:grid-cols-12 lg:items-center">
      <div role="tablist" aria-label="Marketing capabilities" className="grid gap-2 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
        {groups.map((g, i) => (
          <button
            key={g.group}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => select(i)}
            onMouseEnter={() => select(i)}
            className={`rounded-xl border p-5 text-left transition-colors duration-500 ${i === index ? 'border-fg bg-surface' : 'border-line hover:border-line-strong'}`}
          >
            <span className="font-mono text-[0.68rem] text-accent-ink">0{i + 1}</span>
            <span className="mt-1 block text-xl font-medium tracking-[-0.02em]">{g.group}</span>
            <span className="mt-3 block space-y-1 text-[0.92rem] text-muted">
              {g.items.map((x) => (
                <span key={x} className="block">
                  {x}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <div className="relative" style={{ perspective: '1400px' }}>
          <div className="aspect-[16/11] overflow-hidden rounded-3xl border border-line bg-canvas shadow-[0_40px_70px_-45px_rgb(58_42_29/0.6)]" style={{ transform: 'rotateY(-6deg) rotateX(3deg)' }} aria-hidden="true">
            <div key={index} className="fade-in h-full">
              <ChannelChart i={index} />
            </div>
          </div>
        </div>
        <p className="mt-4 text-[0.78rem] text-subtle">Illustrative charts — no real figures or results.</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  UI/UX: drag to compare an unclear interface with a designed one      */
/* ------------------------------------------------------------------ */
function MessyUi() {
  return (
    <div className="h-full bg-[#f4f1ec] p-4">
      <div className="flex flex-wrap gap-1">{['Home', 'Menu', 'Tools', 'More', 'Settings', 'Help', 'Admin'].map((t) => <span key={t} className="rounded border border-[#171717]/20 px-1.5 text-[0.55rem]">{t}</span>)}</div>
      <p className="mt-3 text-[0.8rem] font-bold">WELCOME TO THE PORTAL!!!</p>
      <div className="mt-2 grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }, (_, k) => (
          <span key={k} className="h-6 rounded-sm border border-[#171717]/20" style={{ background: ['#e9d7d2', '#d8e2ea', '#efe8cf'][k % 3] }} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {['Submit', 'Save', 'OK', 'Continue', 'Next'].map((b, k) => (
          <span key={b} className="rounded px-1.5 py-0.5 text-[0.55rem] text-white" style={{ background: ['#6b7fa3', '#8a6b6b', '#6b8a72', '#a38a6b', '#7a6b8a'][k] }}>
            {b}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[0.5rem] leading-tight text-[#171717]/50">Please note that fields marked with an asterisk may be required depending on the selection made in the previous section of the form…</p>
    </div>
  )
}
function CleanUi() {
  return (
    <div className="h-full bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="h-2 w-10 rounded bg-[#171717]/80" />
        <span className="flex gap-2 text-[0.55rem] text-muted">
          <span>Overview</span>
          <span>Requests</span>
        </span>
      </div>
      <p className="mt-4 text-[0.9rem] font-medium tracking-[-0.02em]">Good morning</p>
      <p className="text-[0.6rem] text-muted">You have two requests to review.</p>
      <div className="mt-3 space-y-1.5">
        {['Leave request · Priya', 'Expense · Travel'].map((t) => (
          <div key={t} className="flex items-center justify-between rounded-lg border border-line px-2 py-1.5 text-[0.6rem]">
            {t}
            <ArrowRight size={10} className="text-accent-ink" />
          </div>
        ))}
      </div>
      <span className="mt-3 inline-block rounded-full bg-[#171717] px-3 py-1 text-[0.55rem] text-white">Review requests</span>
    </div>
  )
}

export function DesignCompare({ problems, benefits }: { problems: Pair[]; benefits: Pair[] }) {
  const [x, setX] = useState(50)
  const box = useRef<HTMLDivElement>(null)
  const drag = (clientX: number) => {
    const r = box.current!.getBoundingClientRect()
    setX(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)))
  }
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-6">
        <div
          ref={box}
          className="relative aspect-[4/3] touch-pan-y select-none overflow-hidden rounded-3xl border border-line shadow-[0_40px_70px_-45px_rgb(58_42_29/0.6)]"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            drag(e.clientX)
          }}
          onPointerMove={(e) => e.buttons === 1 && drag(e.clientX)}
          aria-hidden="true"
        >
          <div className="absolute inset-0">
            <CleanUi />
          </div>
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}>
            <MessyUi />
          </div>
          <span className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-fg" style={{ left: `${x}%` }}>
            <span className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-fg text-canvas shadow-lg">
              <ChevronsLeftRight size={16} />
            </span>
          </span>
          <span className="absolute bottom-3 left-3 rounded-full bg-[#171717]/70 px-2 py-0.5 text-[0.6rem] text-white">Without design</span>
          <span className="absolute bottom-3 right-3 rounded-full bg-accent px-2 py-0.5 text-[0.6rem] text-[#171717]">With design</span>
        </div>
        <label className="mt-4 flex items-center gap-3 text-[0.8rem] text-muted">
          Compare
          <input type="range" min={4} max={96} value={x} onChange={(e) => setX(Number(e.target.value))} className="flex-1 accent-[#8c5e34]" aria-label="Move the comparison divider" />
        </label>
        <p className="mt-2 text-[0.75rem] text-subtle">Illustrative interfaces — drag the handle or use the slider.</p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:col-start-8">
        <div>
          <h3 className="eyebrow text-muted">Without it</h3>
          <ul className="mt-4 space-y-4">
            {problems.map((p) => (
              <li key={p.title}>
                <p className="font-medium">{p.title}</p>
                <p className="mt-1 text-[0.92rem] text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow text-accent-ink">With it</h3>
          <ul className="mt-4 space-y-4">
            {benefits.map((b) => (
              <li key={b.title}>
                <p className="font-medium">{b.title}</p>
                <p className="mt-1 text-[0.92rem] text-muted">{b.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  E-commerce: storefront, platform and operations as stacked layers     */
/* ------------------------------------------------------------------ */
function LayerFace({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="grid h-full grid-cols-3 gap-1.5 p-3">
        {[0, 1, 2].map((k) => (
          <div key={k} className="rounded-md bg-white p-1.5">
            <span className="block h-8 rounded bg-[linear-gradient(135deg,#e8cfae,#a8754c)]" style={{ opacity: 1 - k * 0.2 }} />
            <span className="mt-1 block h-1 w-3/4 rounded bg-[#171717]/30" />
          </div>
        ))}
      </div>
    )
  if (i === 1)
    return (
      <div className="flex h-full items-center justify-around p-3 text-[0.55rem] text-[#171717]/70">
        {['Catalogue', 'Checkout', 'Payments'].map((t) => (
          <span key={t} className="rounded-md border border-[#171717]/20 bg-white/80 px-2 py-1">{t}</span>
        ))}
      </div>
    )
  return (
    <div className="flex h-full items-center justify-around p-3 text-[0.55rem] text-white/80">
      {['Stock', 'Shipping', 'Accounting'].map((t) => (
        <span key={t} className="rounded-md border border-white/20 px-2 py-1">{t}</span>
      ))}
    </div>
  )
}

export function CommerceLayers({ groups }: { groups: Group[] }) {
  const root = useRef<HTMLDivElement>(null)
  const { index, select } = useAutoCycle(groups.length, root, 3000)
  const faces = ['bg-[#f7f4ef] border-line-strong', 'bg-[#efe6d8] border-accent/50', 'bg-[#1a1c21] border-[#1a1c21]']
  return (
    <div ref={root} className="grid items-center gap-12 lg:grid-cols-12">
      <div aria-hidden="true" className="relative mx-auto h-[18rem] w-full max-w-[24rem] max-sm:scale-[0.85] lg:col-span-5" style={{ perspective: '1100px' }}>
        <div className="absolute inset-0" style={{ transform: 'rotateX(55deg) rotateZ(-32deg)', transformStyle: 'preserve-3d' }}>
          {groups.map((g, i) => (
            <div
              key={g.group}
              className={`absolute inset-x-[10%] top-[20%] h-[56%] overflow-hidden rounded-2xl border shadow-[0_24px_40px_-24px_rgb(23_23_23/0.55)] transition-transform duration-700 ease-[var(--ease-out-expo)] ${faces[i] ?? faces[0]}`}
              style={{ transform: `translateZ(${(groups.length - 1 - i) * 60 + (i === index ? 30 : 0)}px)` }}
            >
              <LayerFace i={i} />
            </div>
          ))}
        </div>
      </div>
      <ol className="space-y-3 lg:col-span-7">
        {groups.map((g, i) => (
          <li key={g.group}>
            <button
              type="button"
              aria-pressed={i === index}
              onClick={() => select(i)}
              onMouseEnter={() => select(i)}
              className={`w-full rounded-xl border p-5 text-left transition-colors duration-500 ${i === index ? 'border-fg bg-surface' : 'border-line hover:border-line-strong'}`}
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-[0.7rem] text-accent-ink">{['Front', 'Core', 'Back office'][i] ?? `0${i + 1}`}</span>
                <span className="text-lg font-medium">{g.group}</span>
              </span>
              <span className="mt-3 flex flex-wrap gap-2">
                {g.items.map((x) => (
                  <span key={x} className="chip">
                    {x}
                  </span>
                ))}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  AI: before → after patterns as flip cards                            */
/* ------------------------------------------------------------------ */
const areaIcons = [Inbox, FileText, BadgeCheck, BarChart3]

export function FlipPatterns({ examples }: { examples: { area: string; before: string; after: string }[] }) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})
  const face = 'absolute inset-0 flex flex-col rounded-2xl border p-6 [backface-visibility:hidden]'
  return (
    <ul className="grid gap-5 sm:grid-cols-2" style={{ perspective: '1600px' }}>
      {examples.map((ex, i) => {
        const on = !!flipped[i]
        const AreaIcon = areaIcons[i] ?? Check
        return (
          <li key={ex.area} className="relative h-[16rem]">
            <button
              type="button"
              aria-pressed={on}
              onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}
              onMouseEnter={() => setFlipped((f) => ({ ...f, [i]: true }))}
              onMouseLeave={() => setFlipped((f) => ({ ...f, [i]: false }))}
              className="absolute inset-0 text-left transition-transform duration-700 ease-[var(--ease-out-expo)] [transform-style:preserve-3d]"
              style={{ transform: on ? 'rotateY(180deg)' : 'none' }}
            >
              <span className={`${face} border-dashed border-line-strong bg-canvas-alt`}>
                <span className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-line-strong bg-canvas text-muted">
                    <AreaIcon size={17} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-[#f3e1dc] px-2.5 py-0.5 text-[0.62rem] font-medium text-[#8a3b2a]">Manual today</span>
                </span>
                <span className="eyebrow mt-5 text-[0.62rem] text-subtle">Before · {ex.area}</span>
                <span className="mt-2 text-lg leading-snug text-muted">{ex.before}</span>
                <span className="mt-auto inline-flex items-center gap-2 text-[0.8rem] text-accent-ink">
                  See it automated <ArrowRight size={13} aria-hidden="true" />
                </span>
              </span>
              <span className={`${face} border-fg bg-surface [transform:rotateY(180deg)]`}>
                <span className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-fg text-accent">
                    <AreaIcon size={17} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-[#e6efe6] px-2.5 py-0.5 text-[0.62rem] font-medium text-[#2f5a35]">Automated</span>
                </span>
                <span className="eyebrow mt-5 text-[0.62rem] text-accent-ink">After · {ex.area}</span>
                <span className="mt-2 text-lg leading-snug">{ex.after}</span>
                <span className="mt-auto inline-flex items-center gap-2 text-[0.8rem] text-muted">
                  <Check size={13} className="text-accent-ink" aria-hidden="true" /> A person still reviews exceptions
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}


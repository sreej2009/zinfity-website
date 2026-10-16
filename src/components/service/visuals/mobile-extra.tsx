import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AlertTriangle, ArrowRight, Check, CircleHelp, Cloud, CloudOff, FileText, Globe, Map as MapIcon, RefreshCw, ShieldCheck, Smartphone } from 'lucide-react'
import { useAutoCycle } from '@/hooks/useAutoCycle'
import { useInView } from '@/hooks/useInView'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

type Pair = { title: string; body: string }
type Option = { name: string; bestFor: string; consider: string }

/* Small phone used across these compositions. */
function Phone({ children, label, tone = 'light', className = '' }: { children?: ReactNode; label?: string; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className={`relative h-[7.5rem] w-[4rem] rounded-[1rem] border-[3px] border-[#171717] p-1 shadow-[0_18px_30px_-18px_rgb(0_0_0/0.5)] ${tone === 'dark' ? 'bg-[#1a1c21]' : 'bg-white'}`}>
        <span className="mx-auto block h-1 w-5 rounded-full bg-[#171717]" />
        <div className="mt-1 h-[calc(100%-0.5rem)] overflow-hidden rounded-[0.6rem]">{children}</div>
      </div>
      {label && <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-subtle">{label}</span>}
    </div>
  )
}
const AppScreen = ({ accent = '#c79b69' }: { accent?: string }) => (
  <div className="flex h-full flex-col gap-1 bg-[#f7f4ef] p-1">
    <span className="h-1 w-1/2 rounded bg-[#171717]/70" />
    <span className="h-6 rounded" style={{ background: `linear-gradient(135deg,#f0d9bd,${accent})` }} />
    <span className="h-1 rounded bg-[#171717]/15" />
    <span className="h-1 w-2/3 rounded bg-[#171717]/15" />
    <span className="mt-auto h-2 rounded-full bg-[#171717]" />
  </div>
)

/* ------------------------------------------------------------------ */
/*  Platform choice: how each approach reaches devices                   */
/* ------------------------------------------------------------------ */
function CodeChip({ children, hot }: { children: ReactNode; hot?: boolean }) {
  return <span className={`whitespace-nowrap rounded-lg border px-3 py-1.5 font-mono text-[0.7rem] ${hot ? 'border-accent-ink bg-accent/15 text-fg' : 'border-line-strong bg-white text-muted'}`}>{children}</span>
}

function PlatformDiagram({ i }: { i: number }) {
  // Phones sit at 28% and 72%; connectors are plain lines so they always line up.
  const line = 'absolute bg-[#8c5e34]/45'
  const dot = 'absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-ink motion-safe:animate-pulse'
  return (
    <div className="relative h-[19rem]">
      {i === 1 ? (
        <>
          <span className={`${line} left-[28%] top-[3.2rem] h-[5.5rem] w-px`} />
          <span className={`${line} left-[72%] top-[3.2rem] h-[5.5rem] w-px`} />
          <span className={`${dot} left-[28%] top-[6rem]`} />
          <span className={`${dot} left-[72%] top-[6rem]`} />
          <span className="absolute left-[28%] top-3 -translate-x-1/2"><CodeChip hot>Swift</CodeChip></span>
          <span className="absolute left-[72%] top-3 -translate-x-1/2"><CodeChip hot>Kotlin</CodeChip></span>
        </>
      ) : (
        <>
          <span className={`${line} left-1/2 top-[3.2rem] h-[2.8rem] w-px`} />
          <span className={`${line} left-[28%] right-[28%] top-[6rem] h-px`} />
          <span className={`${line} left-[28%] top-[6rem] h-[2.7rem] w-px`} />
          <span className={`${line} left-[72%] top-[6rem] h-[2.7rem] w-px`} />
          <span className={`${dot} left-1/2 top-[6rem]`} />
          <span className="absolute left-1/2 top-3 -translate-x-1/2">
            {i === 0 ? (
              <CodeChip hot>One shared codebase</CodeChip>
            ) : (
              <CodeChip hot>
                <span className="inline-flex items-center gap-1.5">
                  <Globe size={12} /> One web app
                </span>
              </CodeChip>
            )}
          </span>
        </>
      )}
      <div className="absolute inset-x-0 bottom-2 h-[10rem]">
        <span className="absolute left-[28%] -translate-x-1/2">
          <Phone label={i === 2 ? 'Browser' : 'iOS'}>
            <AppScreen />
          </Phone>
        </span>
        <span className="absolute left-[72%] -translate-x-1/2">
          <Phone label={i === 2 ? 'Home screen' : 'Android'}>
            {i === 2 ? (
              <div className="grid h-full grid-cols-2 content-start gap-1 bg-[linear-gradient(160deg,#efe6d8,#d9c3a5)] p-1.5">
                {[0, 1, 2, 3].map((k) => (
                  <span key={k} className={`aspect-square rounded-md ${k === 0 ? 'bg-[#171717]' : 'bg-white/70'}`} />
                ))}
              </div>
            ) : (
              <AppScreen accent="#a8754c" />
            )}
          </Phone>
        </span>
      </div>
    </div>
  )
}

export function PlatformPicker({ options }: { options: Option[] }) {
  const root = useRef<HTMLDivElement>(null)
  const { index, select, inView } = useAutoCycle(options.length, root, 4200)
  const o = options[index]
  return (
    <div ref={root} className={`grid gap-10 lg:grid-cols-12 lg:items-center ${inView ? '' : 'is-paused'}`}>
      <div className="lg:col-span-5">
        <div role="tablist" aria-label="Platform options" className="grid gap-2">
          {options.map((op, i) => (
            <button
              key={op.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => select(i)}
              className={`flex items-center justify-between rounded-xl border px-5 py-4 text-left transition-colors duration-500 ${i === index ? 'border-fg bg-surface' : 'border-line hover:border-line-strong'}`}
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-[0.7rem] text-accent-ink">0{i + 1}</span>
                <span className="text-lg font-medium tracking-[-0.015em]">{op.name}</span>
              </span>
              {i === 0 && <span className="eyebrow text-[0.58rem] text-accent-ink">Usual start</span>}
            </button>
          ))}
        </div>
        <div key={index} className="fade-in mt-6 grid gap-3 sm:grid-cols-2" role="tabpanel" aria-label={o.name}>
          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="flex items-center gap-1.5 eyebrow text-[0.6rem] text-[#2f5a35]">
              <Check size={12} aria-hidden="true" /> Best for
            </p>
            <p className="mt-2 leading-relaxed">{o.bestFor}</p>
          </div>
          <div className="rounded-xl border border-line p-4">
            <p className="flex items-center gap-1.5 eyebrow text-[0.6rem] text-accent-ink">
              <AlertTriangle size={12} aria-hidden="true" /> Consider
            </p>
            <p className="mt-2 leading-relaxed text-muted">{o.consider}</p>
          </div>
        </div>
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <div className="rounded-3xl border border-line bg-[linear-gradient(180deg,#fbfaf7,#f1ece4)] p-6" aria-hidden="true">
          <div key={index} className="fade-in">
            <PlatformDiagram i={index} />
          </div>
        </div>
        <p className="mt-4 text-[0.8rem] text-subtle">We recommend an approach after looking at your users, features and budget.</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Benefits: each one demonstrated on a phone                            */
/* ------------------------------------------------------------------ */
function DecisionScreen() {
  return (
    <div className="flex h-full flex-col gap-1 bg-[#f7f4ef] p-1.5 text-[0.42rem]">
      <span className="font-medium">Recommendation</span>
      {['Users', 'Features', 'Budget'].map((t) => (
        <span key={t} className="flex items-center gap-1 rounded bg-white px-1 py-0.5">
          <Check size={7} className="text-[#2f5a35]" /> {t}
        </span>
      ))}
      <span className="mt-auto rounded bg-[#171717] py-0.5 text-center text-white">Cross-platform</span>
    </div>
  )
}
function OfflineScreen({ phase }: { phase: number }) {
  const states = [
    { icon: CloudOff, text: 'Offline · saved', c: 'text-[#8a3b2a]' },
    { icon: RefreshCw, text: 'Syncing…', c: 'text-accent-ink' },
    { icon: Cloud, text: 'All synced', c: 'text-[#2f5a35]' },
  ]
  const s = states[phase]
  return (
    <div className="flex h-full flex-col gap-1 bg-[#f7f4ef] p-1.5 text-[0.42rem]">
      <span className="font-medium">Site visit</span>
      <span className="h-5 rounded bg-white" />
      <span className="h-3 rounded bg-white" />
      <span className={`mt-auto flex items-center gap-1 rounded bg-white px-1 py-0.5 ${s.c}`}>
        <s.icon size={8} className={phase === 1 ? 'animate-spin motion-reduce:animate-none' : ''} /> {s.text}
      </span>
    </div>
  )
}
function ReleaseScreen({ phase }: { phase: number }) {
  return (
    <div className="flex h-full flex-col gap-1 bg-[#f7f4ef] p-1.5 text-[0.42rem]">
      <span className="font-medium">Releases</span>
      {['1.2', '1.3', '1.4'].map((v, k) => (
        <span key={v} className={`flex items-center justify-between rounded px-1 py-0.5 ${k <= phase ? 'bg-white' : 'bg-white/40 text-subtle'}`}>
          v{v}
          {k <= phase ? <Check size={7} className="text-[#2f5a35]" /> : <span>…</span>}
        </span>
      ))}
      <span className="mt-auto rounded bg-accent/25 py-0.5 text-center">Automated build & tests</span>
    </div>
  )
}

export function BenefitPhones({ items, title }: { items: Pair[]; title: string }) {
  const root = useRef<HTMLElement>(null)
  const inView = useInView(root, { threshold: 0.3 })
  const [phase, setPhase] = useState(2)
  useEffect(() => {
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setPhase((p) => (p + 1) % 3), 1400)
    return () => clearInterval(t)
  }, [inView])
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.from('[data-bphone]', { y: 60, autoAlpha: 0, duration: 1.1, stagger: 0.14, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
      })
    },
    { scope: root },
  )
  const screens = [<DecisionScreen key="a" />, <OfflineScreen key="b" phase={phase} />, <ReleaseScreen key="c" phase={phase} />]
  return (
    <section ref={root} aria-labelledby="mobile-benefits" className="container-x py-20 lg:py-28">
      <p className="eyebrow text-muted">Business benefits</p>
      <h2 id="mobile-benefits" className="mt-4 mb-12 text-[clamp(1.9rem,3vw,2.8rem)] font-medium tracking-[-0.035em]">
        {title}
      </h2>
      <ol className="grid gap-6 md:grid-cols-3" style={{ perspective: '1400px' }}>
        {items.map((b, i) => (
          <li key={b.title} data-bphone>
            <div className="group h-full rounded-3xl border border-line bg-surface p-6 transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-line-strong hover:shadow-[0_40px_60px_-40px_rgb(58_42_29/0.55)]">
            <div className="grid h-52 place-items-center rounded-2xl bg-[radial-gradient(circle_at_50%_60%,rgb(199_155_105/0.22),transparent_70%)]" aria-hidden="true">
              <div className="scale-[1.3] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:[transform:rotateY(-10deg)_rotateX(4deg)]">
                <Phone>{screens[i]}</Phone>
              </div>
            </div>
            <p className="mt-6 font-mono text-[0.7rem] text-accent-ink">0{i + 1}</p>
            <h3 className="mt-1.5 text-xl font-medium tracking-[-0.02em]">{b.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{b.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Why teams come to us: situation → what changes                        */
/* ------------------------------------------------------------------ */
const shifts = [
  { from: CircleHelp, fromLabel: 'Unclear case', to: MapIcon, toLabel: 'Clear roadmap' },
  { from: FileText, fromLabel: 'Paper & chats', to: Smartphone, toLabel: 'One field app' },
  { from: AlertTriangle, fromLabel: 'Fragile app', to: ShieldCheck, toLabel: 'Stable releases' },
]

export function WhyTeams({ items }: { items: Pair[] }) {
  return (
    <section aria-labelledby="why" className="theme-dark bg-canvas py-20 lg:py-28">
      <div className="container-x">
        <p className="eyebrow text-accent">Why teams come to us</p>
        <h2 id="why" className="mt-4 mb-12 max-w-2xl text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">
          The situations we’re usually called in for
        </h2>
        <ol className="grid gap-5 md:grid-cols-3">
          {items.map((p, i) => {
            const s = shifts[i] ?? shifts[0]
            return (
              <li key={p.title} data-reveal className="group flex flex-col rounded-3xl border border-line bg-[#1a1c21] p-6 transition-colors duration-500 hover:border-accent/50">
                <div className="flex items-center gap-3" aria-hidden="true">
                  <span className="flex flex-col items-center gap-1.5">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line-strong text-muted">
                      <s.from size={20} strokeWidth={1.5} />
                    </span>
                    <span className="text-[0.62rem] text-subtle">{s.fromLabel}</span>
                  </span>
                  <span className="relative mb-5 h-px flex-1 bg-line-strong">
                    <span className="absolute inset-y-0 left-0 w-0 bg-accent transition-[width] duration-700 ease-[var(--ease-out-expo)] group-hover:w-full" />
                    <ArrowRight size={14} className="absolute -right-1 -top-[7px] text-accent" />
                  </span>
                  <span className="flex flex-col items-center gap-1.5">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-accent/60 bg-accent/10 text-accent transition-transform duration-500 group-hover:scale-110">
                      <s.to size={20} strokeWidth={1.5} />
                    </span>
                    <span className="text-[0.62rem] text-accent">{s.toLabel}</span>
                  </span>
                </div>
                <p className="mt-8 font-mono text-[0.7rem] text-accent">0{i + 1}</p>
                <h3 className="mt-1.5 text-xl font-medium tracking-[-0.02em]">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

import { useRef, useState } from 'react'
import { ArrowRight, Check, CornerDownLeft, type LucideIcon } from 'lucide-react'
import { useAutoCycle } from '@/hooks/useAutoCycle'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

type Step = { name: string; body: string }

/* Small decorative strip that differs per variant. */
function Strip({ variant, i, n, on }: { variant: 'loop' | 'phases' | 'grow' | 'track'; i: number; n: number; on: boolean }) {
  if (variant === 'phases') {
    // Fidelity rises: sketch → structure → prototype → system
    const fills = [
      ['border-dashed', 'bg-transparent'],
      ['border-solid', 'bg-[#171717]/5'],
      ['border-solid', 'bg-accent/20'],
      ['border-solid', 'bg-[linear-gradient(135deg,#f0d9bd,#c79b69)]'],
    ][Math.min(i, 3)]
    return (
      <span aria-hidden="true" className="grid h-14 grid-cols-3 gap-1.5 rounded-xl bg-canvas-alt p-2">
        {[0, 1, 2].map((k) => (
          <span key={k} className={`rounded-md border border-[#171717]/25 ${fills[0]} ${k === 0 ? fills[1] : ''} transition-transform duration-500 ${on ? '-translate-y-0.5' : ''}`} />
        ))}
      </span>
    )
  }
  if (variant === 'grow') {
    // Scope grows step by step
    return (
      <span aria-hidden="true" className="flex h-14 items-end gap-1 rounded-xl bg-canvas-alt p-2">
        {Array.from({ length: n }, (_, k) => (
          <span key={k} className="flex-1 rounded-sm transition-[height,background] duration-500" style={{ height: `${25 + k * 22}%`, background: k <= i ? (on ? '#8c5e34' : '#c79b69') : 'rgb(23 23 23 / 0.08)' }} />
        ))}
      </span>
    )
  }
  // loop / track: progress dots
  return (
    <span aria-hidden="true" className="flex h-14 items-center gap-1.5 rounded-xl bg-canvas-alt px-3">
      {Array.from({ length: n }, (_, k) => (
        <span key={k} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${k <= i ? (on ? 'bg-accent-ink' : 'bg-accent') : 'bg-[#171717]/10'}`} />
      ))}
    </span>
  )
}

/** Process steps as connected cards. Each page picks its own variant. */
export function StepFlow({ steps, icons, variant = 'track', loopLabel, columns }: { steps: Step[]; icons: LucideIcon[]; variant?: 'loop' | 'phases' | 'grow' | 'track'; loopLabel?: string; columns?: 2 | 3 | 4 }) {
  const root = useRef<HTMLDivElement>(null)
  const [hot, setHot] = useState<number | null>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 78%', once: true } })
        tl.from('[data-step]', { autoAlpha: 0, y: 34, duration: 0.9, stagger: 0.12, ease: 'expo.out' }).from('[data-link]', { scaleX: 0, transformOrigin: 'left center', duration: 0.5, stagger: 0.12 }, 0.35)
      })
    },
    { scope: root },
  )
  const perRow = columns ?? (steps.length === 4 ? 4 : 3)
  const cols = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' }[perRow]
  return (
    <div ref={root}>
      <ol className={`grid gap-4 sm:grid-cols-2 lg:gap-6 ${cols}`}>
        {steps.map((s, i) => {
          const Icon = icons[i] ?? Check
          const on = hot === i
          return (
            <li key={s.name} data-step className="relative" onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)}>
              {i < steps.length - 1 && (i + 1) % perRow !== 0 && (
                <span aria-hidden="true" data-link className="absolute left-[calc(100%+0.15rem)] top-[2.6rem] z-10 hidden items-center lg:flex">
                  <span className="h-px w-4 bg-accent-ink/50" />
                  <ArrowRight size={12} className="-ml-1 text-accent-ink" />
                </span>
              )}
              <div className={`flex h-full flex-col rounded-3xl border bg-surface p-5 transition-[border-color,transform,box-shadow] duration-500 sm:p-6 ${on ? '-translate-y-1 border-fg shadow-[0_30px_50px_-36px_rgb(58_42_29/0.6)]' : 'border-line'}`}>
                <span className="flex items-center justify-between">
                  <span className={`grid h-11 w-11 place-items-center rounded-2xl transition-colors duration-500 ${on ? 'bg-fg text-accent' : 'bg-canvas-alt text-accent-ink'}`}>
                    <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[0.7rem] text-subtle">{variant === 'phases' ? `Phase ${i + 1}` : `Step 0${i + 1}`}</span>
                </span>
                <h3 className="mt-6 text-lg font-medium tracking-[-0.015em]">{s.name}</h3>
                <p className="mt-1.5 flex-1 text-[0.94rem] leading-relaxed text-muted">{s.body}</p>
                <div className="mt-5">
                  <Strip variant={variant} i={i} n={steps.length} on={on} />
                </div>
              </div>
            </li>
          )
        })}
      </ol>
      {variant === 'loop' && (
        <div aria-hidden="true" className="mt-4 hidden items-center gap-3 lg:flex">
          <span className="h-6 flex-1 rounded-b-2xl border-x border-b border-dashed border-accent-ink/50" />
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line-strong bg-surface px-3 py-1 text-[0.8rem] text-accent-ink">
            <CornerDownLeft size={13} /> {loopLabel ?? 'Then repeat'}
          </span>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Capability groups as connected columns (vertical rails of nodes)    */
/* ------------------------------------------------------------------ */
export function NodeColumns({ groups, icons }: { groups: { group: string; items: string[] }[]; icons: LucideIcon[] }) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 78%', once: true } })
        tl.from('[data-col]', { autoAlpha: 0, y: 30, duration: 0.9, stagger: 0.12 }).from('[data-rail]', { scaleY: 0, transformOrigin: 'top', duration: 0.9, stagger: 0.12, ease: 'power2.out' }, 0.3).from('[data-node]', { scale: 0, duration: 0.4, stagger: 0.05, ease: 'back.out(2)' }, 0.5)
      })
    },
    { scope: root },
  )
  return (
    <div ref={root} className="grid gap-5 md:grid-cols-3">
      {groups.map((g, i) => {
        const Icon = icons[i] ?? Check
        return (
          <div key={g.group} data-col className="group rounded-3xl border border-line bg-surface p-6 transition-colors duration-500 hover:border-line-strong sm:p-7">
            <span className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-fg text-accent">
                <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-mono text-[0.66rem] text-subtle">0{i + 1}</span>
                <span className="block text-xl font-medium tracking-[-0.02em]">{g.group}</span>
              </span>
            </span>
            <ul className="relative mt-6 space-y-4 pl-6">
              <span aria-hidden="true" data-rail className="absolute bottom-2 left-[0.3rem] top-2 w-px bg-accent-ink/40" />
              {g.items.map((x) => (
                <li key={x} className="relative text-[0.95rem]">
                  <span aria-hidden="true" data-node className="absolute -left-6 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent-ink bg-surface transition-colors duration-300 group-hover:bg-accent" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Icon cards on a dark band (culture, values)                          */
/* ------------------------------------------------------------------ */
export function ValueCards({ items, icons }: { items: { title: string; body: string }[]; icons: LucideIcon[] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {items.map((c, i) => {
        const Icon = icons[i] ?? Check
        return (
          <li key={c.title} data-reveal className="group relative overflow-hidden rounded-3xl border border-line bg-[#1a1c21] p-6 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-accent/50 sm:p-7">
            <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[radial-gradient(closest-side,rgb(199_155_105/0.16),transparent)] transition-transform duration-700 group-hover:scale-125" />
            <span className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-accent/40 bg-accent/10 text-accent">
                <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="font-mono text-[0.7rem] text-subtle">0{i + 1}</span>
            </span>
            <h3 className="mt-8 text-xl font-medium tracking-[-0.02em]">{c.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{c.body}</p>
          </li>
        )
      })}
    </ol>
  )
}

/* ------------------------------------------------------------------ */
/*  Culture: a featured principle beside a numbered index               */
/* ------------------------------------------------------------------ */
export function PrincipleIndex({ items, icons, glyphs }: { items: { title: string; body: string }[]; icons: LucideIcon[]; glyphs: string[] }) {
  const root = useRef<HTMLDivElement>(null)
  const { index, select } = useAutoCycle(items.length, root, 3800)
  const Icon = icons[index] ?? Check
  const c = items[index]
  return (
    <div ref={root} className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
      {/* Featured */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#14161b] p-8 text-[#ede9e3] sm:p-10 lg:col-span-6" aria-live="polite">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgb(199_155_105/0.3),transparent)]" />
        <span aria-hidden="true" key={`g${index}`} style={{ animationDelay: '0ms', animationDuration: '.6s' }} className="fade-in pointer-events-none absolute right-8 bottom-[-0.12em] select-none font-serif text-[clamp(9rem,16vw,14rem)] italic leading-none text-accent/15">
          {glyphs[index]}
        </span>
        <div key={index} className="fade-in relative flex h-full min-h-[20rem] flex-col" style={{ animationDelay: '0ms', animationDuration: '.45s' }}>
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-accent/40 bg-accent/10 text-accent">
            <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <p className="mt-10 font-mono text-[0.72rem] text-accent">Principle 0{index + 1}</p>
          <h3 className="mt-3 text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1.02] tracking-[-0.04em]">{c.title}</h3>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-[#ede9e3]/70">{c.body}</p>
          <div className="mt-auto flex gap-1.5 pt-10" aria-hidden="true">
            {items.map((_, i) => (
              <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-10 bg-accent' : 'w-4 bg-[#ede9e3]/20'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Index */}
      <ol className="flex flex-col justify-center lg:col-span-6">
        {items.map((it, i) => {
          const on = i === index
          return (
            <li key={it.title} className="border-b border-line first:border-t">
              <button
                type="button"
                aria-pressed={on}
                onClick={() => select(i)}
                onMouseEnter={() => select(i)}
                className="group flex w-full items-center gap-6 py-6 text-left"
              >
                <span className={`font-serif text-[clamp(2.4rem,4vw,3.4rem)] italic leading-none transition-colors duration-500 ${on ? 'text-accent-ink' : 'text-fg/15 group-hover:text-fg/35'}`}>{i + 1}</span>
                <span className={`flex-1 text-[clamp(1.2rem,1.8vw,1.5rem)] font-medium tracking-[-0.02em] transition-[color,transform] duration-500 ${on ? 'translate-x-1 text-fg' : 'text-muted'}`}>{it.title}</span>
                <span className={`grid h-10 w-10 place-items-center rounded-full border transition-[background,border-color,color] duration-500 ${on ? 'border-fg bg-fg text-canvas' : 'border-line-strong text-subtle'}`}>
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

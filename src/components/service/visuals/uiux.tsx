import { useRef } from 'react'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

const ink = (o: number) => `rgb(23 23 23 / ${o})`
const box = (o = 0.08) => ({ background: ink(o) })

/* ------------------------------------------------------------------ */
/*  Artefact thumbnails — fidelity increases along the sequence         */
/* ------------------------------------------------------------------ */
function ArtefactThumb({ i }: { i: number }) {
  switch (i) {
    case 0: // journey map
      return (
        <svg viewBox="0 0 160 70" className="h-full w-full" aria-hidden="true">
          <path d="M8 50 C 30 50, 36 20, 58 24 S 92 58, 112 44 S 140 14, 152 18" fill="none" stroke="#8c5e34" strokeWidth="1.4" pathLength={1} strokeDasharray="1" data-thumb-draw />
          {[
            [8, 50],
            [58, 24],
            [112, 44],
            [152, 18],
          ].map(([x, y], k) => (
            <circle key={k} cx={x} cy={y} r="3.5" fill={k === 2 ? '#fff' : '#c79b69'} stroke="#8c5e34" strokeWidth="1" />
          ))}
          <path d="M8 62 H152" stroke={ink(0.12)} strokeDasharray="2 3" />
        </svg>
      )
    case 1: // user flow
      return (
        <svg viewBox="0 0 160 70" className="h-full w-full" aria-hidden="true">
          {[10, 62, 114].map((x) => (
            <rect key={x} x={x} y="24" width="36" height="22" rx="4" fill="#fff" stroke={ink(0.3)} />
          ))}
          <path d="M46 35 H62 M98 35 H114" stroke={ink(0.3)} />
          <path d="M46 35 H62 M98 35 H114" stroke="#8c5e34" strokeWidth="1.6" pathLength={1} className="flow-dash" />
          <path d="M80 46 V60 H132" fill="none" stroke={ink(0.2)} strokeDasharray="2 2" />
        </svg>
      )
    case 2: // wireframe
      return (
        <div className="grid h-full grid-cols-3 gap-1.5 p-3">
          <span className="col-span-3 h-2.5 rounded-sm" style={box(0.12)} />
          <span className="col-span-2 row-span-2 rounded-sm border border-dashed border-[#171717]/25" />
          <span className="rounded-sm" style={box()} />
          <span className="rounded-sm" style={box()} />
        </div>
      )
    case 3: // prototype with hotspot
      return (
        <div className="relative flex h-full flex-col gap-1.5 p-3">
          <span className="h-2.5 w-2/3 rounded-sm" style={box(0.18)} />
          <span className="h-2 w-1/2 rounded-sm" style={box(0.1)} />
          <span className="relative mt-auto w-fit rounded-md border border-[#c79b69] bg-[#c79b69]/15 px-3 py-1 text-[0.5rem] font-medium">
            Continue
            <span className="absolute -inset-1 animate-ping rounded-lg border border-[#c79b69]/60 motion-reduce:hidden" />
          </span>
          <svg viewBox="0 0 12 16" className="absolute bottom-2 left-[38%] h-4 w-3" aria-hidden="true">
            <path d="M1 1 L1 13 L4 10 L6.5 15 L8.5 14 L6 9 L10 9 Z" fill="#171717" stroke="#fff" strokeWidth="0.8" />
          </svg>
        </div>
      )
    case 4: // polished UI
      return (
        <div className="flex h-full gap-2 p-3">
          <span className="w-1/3 rounded-md bg-[linear-gradient(160deg,#f0d9bd,#a8754c)]" />
          <span className="flex flex-1 flex-col gap-1.5">
            <span className="h-2.5 w-4/5 rounded-sm bg-[#171717]/80" />
            <span className="h-1.5 w-full rounded-sm" style={box(0.12)} />
            <span className="h-1.5 w-3/4 rounded-sm" style={box(0.12)} />
            <span className="mt-auto h-4 w-14 rounded-full bg-[#171717]" />
          </span>
        </div>
      )
    default: // design system
      return (
        <div className="grid h-full grid-cols-[auto_1fr] items-center gap-3 p-3">
          <span className="grid grid-cols-2 gap-1">
            {['#171717', '#8c5e34', '#c79b69', '#efe9df'].map((c) => (
              <span key={c} className="h-4 w-4 rounded" style={{ background: c, boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / .08)' }} />
            ))}
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="h-4 w-16 rounded-full bg-[#171717]" />
            <span className="h-4 w-16 rounded-full border border-[#171717]/40" />
            <span className="flex gap-1">
              <span className="h-3 w-7 rounded-full bg-[#c79b69]/30" />
              <span className="h-3 w-5 rounded-full bg-[#c79b69]/30" />
            </span>
          </span>
        </div>
      )
  }
}

/** Artefacts presented as a connected sequence, from research to a design system. */
export function ArtefactSequence({ items }: { items: { name: string; body: string }[] }) {
  const root = useRef<HTMLOListElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
        tl.from('[data-artefact]', { autoAlpha: 0, y: 40, duration: 1, stagger: 0.12, ease: 'expo.out' })
          .fromTo('[data-thumb-draw]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.3)
          .from('[data-link]', { scaleX: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, 0.5)
      })
    },
    { scope: root },
  )
  return (
    <ol ref={root} className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: '1400px' }}>
      {items.map((a, i) => (
        <li key={a.name} data-artefact className="group relative">
          {/* Connection to the next artefact (desktop rows) */}
          {i % 3 !== 2 && i < items.length - 1 && (
            <span aria-hidden="true" data-link className="absolute left-[calc(100%+0.5rem)] top-[3.25rem] hidden h-px w-[1.5rem] origin-left bg-[#8c5e34]/60 lg:block" />
          )}
          <div aria-hidden="true" className="relative h-[6.5rem]" style={{ transformStyle: 'preserve-3d' }}>
            {/* Layer behind: the previous fidelity peeking out */}
            <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-xl border border-dashed border-line-strong bg-canvas-alt transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4" />
            <div className="absolute inset-0 overflow-hidden rounded-xl border border-line bg-white shadow-[0_20px_36px_-28px_rgb(58_42_29/0.5)] transition-transform duration-500 group-hover:[transform:translate3d(-4px,-6px,0)_rotateX(5deg)]">
              <ArtefactThumb i={i} />
            </div>
          </div>
          <p className="mt-6 font-mono text-[0.72rem] text-accent-ink">{String(i + 1).padStart(2, '0')}</p>
          <h3 className="mt-1.5 text-xl font-medium tracking-[-0.02em]">{a.name}</h3>
          <p className="mt-2 leading-relaxed text-muted">{a.body}</p>
        </li>
      ))}
    </ol>
  )
}

/* ------------------------------------------------------------------ */
/*  Capabilities: a specimen per discipline                             */
/* ------------------------------------------------------------------ */
function Specimen({ i }: { i: number }) {
  if (i === 0)
    // research: sticky notes clustering
    return (
      <div className="relative h-full">
        {[
          ['12%', '18%', '-6deg', '#f3e3c8'],
          ['38%', '10%', '4deg', '#efe9df'],
          ['24%', '48%', '3deg', '#e8cfae'],
          ['56%', '42%', '-4deg', '#f3e3c8'],
        ].map(([l, t, r, c], k) => (
          <span
            key={k}
            className="absolute h-10 w-12 rounded-sm shadow-[0_8px_14px_-8px_rgb(58_42_29/0.5)] transition-transform duration-700 group-hover:translate-x-[var(--dx)]"
            style={{ left: l, top: t, background: c, transform: `rotate(${r})`, ['--dx' as string]: `${(k % 2 ? -1 : 1) * 6}px` }}
          />
        ))}
      </div>
    )
  if (i === 1)
    // design: wireframe plane lifts to reveal the finished layer
    return (
      <div className="relative h-full" style={{ perspective: '600px' }}>
        <div className="absolute inset-x-[14%] inset-y-[14%] rounded-lg border border-dashed border-[#171717]/30 bg-white/60 p-2 transition-transform duration-700 [transform:rotateX(28deg)_translateZ(-10px)] group-hover:[transform:rotateX(28deg)_translateZ(-40px)]">
          <span className="block h-1.5 w-1/2 rounded-sm" style={box(0.15)} />
        </div>
        <div className="absolute inset-x-[14%] inset-y-[14%] rounded-lg border border-line bg-white p-2 shadow-[0_18px_30px_-20px_rgb(58_42_29/0.55)] transition-transform duration-700 [transform:rotateX(28deg)_translateZ(10px)] group-hover:[transform:rotateX(28deg)_translateZ(30px)_translateY(-6px)]">
          <span className="block h-2 w-2/3 rounded-sm bg-[#171717]/80" />
          <span className="mt-1.5 block h-1.5 w-1/2 rounded-sm" style={box(0.12)} />
          <span className="mt-2 block h-3 w-10 rounded-full bg-[#c79b69]" />
        </div>
      </div>
    )
  // systems: components snapping into a library grid
  return (
    <div className="grid h-full grid-cols-3 content-center gap-2 px-[12%]">
      {['h-4 rounded-full bg-[#171717]', 'h-4 rounded-full border border-[#171717]/40', 'h-4 rounded-md bg-[#c79b69]/40', 'h-6 rounded-md border border-line-strong bg-white', 'h-6 rounded-md bg-[#efe9df]', 'h-6 rounded-md border border-dashed border-[#8c5e34]/50'].map((c, k) => (
        <span key={k} className={`${c} transition-transform duration-500 group-hover:scale-105`} style={{ transitionDelay: `${k * 40}ms` }} />
      ))}
    </div>
  )
}

export function CapabilitySpecimens({ groups, title }: { groups: { group: string; items: string[] }[]; title: string }) {
  return (
    <section aria-labelledby="uiux-capabilities" className="border-b border-line py-20 lg:py-28">
      <div className="container-x">
        <p className="eyebrow text-muted">Capabilities</p>
        <h2 id="uiux-capabilities" className="mt-4 mb-12 text-[clamp(1.8rem,3vw,2.8rem)] font-medium tracking-[-0.035em]">
          {title}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {groups.map((g, i) => (
            <div key={g.group} data-reveal className="group rounded-2xl border border-line bg-surface p-3 transition-colors duration-500 hover:border-line-strong">
              <div aria-hidden="true" className="h-32 overflow-hidden rounded-xl bg-canvas-alt">
                <Specimen i={i} />
              </div>
              <div className="px-3 pb-3 pt-5">
                <h3 className="text-2xl font-medium tracking-[-0.025em]">{g.group}</h3>
                <ul className="mt-4 space-y-2 text-muted">
                  {g.items.map((x) => (
                    <li key={x} className="flex items-center gap-3">
                      <span aria-hidden="true" className="h-px w-3 bg-accent-ink" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

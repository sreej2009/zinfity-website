import { useRef } from 'react'
import { Check } from 'lucide-react'
import { useAutoCycle } from '@/hooks/useAutoCycle'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

/* Visual for each rollout stage (decorative). */
function StageVisual({ i }: { i: number }) {
  if (i === 0)
    // Fit analysis: your processes vs platform capabilities
    return (
      <div className="relative grid h-full place-items-center">
        <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
          <circle cx="78" cy="52" r="40" fill="rgb(199 155 105 / 0.18)" stroke="#8c5e34" strokeWidth="1.2" />
          <circle cx="122" cy="52" r="40" fill="rgb(23 23 23 / 0.05)" stroke="rgb(23 23 23 / 0.35)" strokeWidth="1.2" />
          <text x="62" y="52" fontSize="7.5" fill="#8c5e34" textAnchor="middle">Your</text>
          <text x="62" y="62" fontSize="7.5" fill="#8c5e34" textAnchor="middle">process</text>
          <text x="140" y="58" fontSize="7.5" fill="rgb(23 23 23 / 0.55)" textAnchor="middle">Platform</text>
          <text x="100" y="53" fontSize="7" fill="#171717" textAnchor="middle" fontWeight="600">Fit</text>
          <text x="100" y="63" fontSize="6" fill="rgb(23 23 23 / 0.55)" textAnchor="middle">configure</text>
          <text x="100" y="104" fontSize="6.5" fill="#8c5e34" textAnchor="middle">Gaps are built, not forced</text>
        </svg>
      </div>
    )
  if (i === 1)
    // Prepare data: messy rows → clean rows
    return (
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-3 px-4">
        <div className="space-y-1.5 font-mono text-[0.52rem]">
          {['ACME ltd', 'Acme Ltd.', '— missing —', 'acme limited'].map((r, k) => (
            <span key={k} className={`block truncate rounded border px-1.5 py-1 ${k === 2 ? 'border-[#c4705a]/50 text-[#a4513d]' : 'border-line bg-white text-muted'}`}>
              {r}
            </span>
          ))}
        </div>
        <span className="font-mono text-[0.7rem] text-accent-ink">→</span>
        <div className="space-y-1.5 font-mono text-[0.52rem]">
          <span className="flex items-center gap-1 rounded border border-accent-ink/50 bg-[#f3e6d6] px-1.5 py-1">
            <Check size={9} className="text-[#2f5a35]" /> Acme Ltd
          </span>
          <span className="block rounded border border-line bg-white px-1.5 py-1 text-muted">Mapped: 3 → 1</span>
          <span className="block rounded border border-line bg-white px-1.5 py-1 text-muted">Gaps flagged</span>
        </div>
      </div>
    )
  if (i === 2)
    // Configure & integrate in a test environment
    return (
      <div className="relative h-full p-4">
        <span className="absolute right-3 top-3 rounded-full border border-dashed border-accent-ink/60 px-2 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-accent-ink">Test environment</span>
        <svg viewBox="0 0 200 90" className="mt-4 h-[80%] w-full" aria-hidden="true">
          {[
            [30, 'Sales'],
            [100, 'Stock'],
            [170, 'Finance'],
          ].map(([x, t]) => (
            <g key={t as string}>
              <rect x={(x as number) - 24} y="30" width="48" height="26" rx="6" fill="#fff" stroke="rgb(23 23 23 / 0.3)" />
              <text x={x as number} y="46" fontSize="8" textAnchor="middle" fill="#171717">
                {t}
              </text>
            </g>
          ))}
          {['M54 43 H76', 'M124 43 H146'].map((d, k) => (
            <g key={k}>
              <path d={d} stroke="rgb(140 94 52 / 0.35)" strokeWidth="1.5" />
              <path d={d} stroke="#8c5e34" strokeWidth="3" strokeLinecap="round" pathLength={1} className="flow-dash" style={{ animationDelay: `-${k * 1.2}s` }} />
            </g>
          ))}
          <path d="M100 56 V74 H160" fill="none" stroke="rgb(23 23 23 / 0.25)" strokeDasharray="3 3" />
          <text x="164" y="77" fontSize="7" fill="rgb(23 23 23 / 0.55)">Roles</text>
        </svg>
      </div>
    )
  // Train & go live
  return (
    <div className="flex h-full items-center justify-between gap-4 px-5">
      <div className="flex -space-x-2">
        {['#e8cfae', '#c79b69', '#a8754c', '#8c5e34'].map((c) => (
          <span key={c} className="h-9 w-9 rounded-full border-2 border-white" style={{ background: c }} />
        ))}
      </div>
      <div className="text-right">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#171717] py-1 pl-1 pr-3 text-[0.62rem] text-white">
          <span className="relative h-4 w-7 rounded-full bg-[#2f5a35]">
            <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-white" />
          </span>
          Live
        </span>
        <p className="mt-1.5 text-[0.58rem] text-muted">Teams trained · support on hand</p>
      </div>
    </div>
  )
}

export function RolloutJourney({ steps }: { steps: { name: string; body: string }[] }) {
  const root = useRef<HTMLDivElement>(null)
  const { index, select } = useAutoCycle(steps.length, root, 3400)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.from('[data-rollout]', { autoAlpha: 0, y: 30, duration: 0.9, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 78%', once: true } })
      })
    },
    { scope: root },
  )
  const progress = (index / (steps.length - 1)) * 100

  return (
    <div ref={root}>
      {/* Progress track with a "live" endpoint */}
      <div className="relative mb-6 hidden md:block" aria-hidden="true">
        <span className="absolute left-[12.5%] right-[12.5%] top-1/2 h-px bg-line-strong" />
        <span className="absolute left-[12.5%] top-1/2 h-0.5 -translate-y-px bg-accent-ink transition-[width] duration-700 ease-[var(--ease-out-expo)]" style={{ width: `${progress * 0.75}%` }} />
        <div className="relative grid grid-cols-4">
          {steps.map((s, i) => (
            <span key={s.name} className="flex justify-center">
              <span className={`grid h-8 w-8 place-items-center rounded-full border font-mono text-[0.7rem] transition-colors duration-500 ${i <= index ? 'border-accent-ink bg-accent-ink text-canvas' : 'border-line-strong bg-canvas text-subtle'}`}>
                {i < index ? <Check size={13} /> : i + 1}
              </span>
            </span>
          ))}
        </div>
      </div>

      <ol className="grid gap-4 md:grid-cols-4">
        {steps.map((s, i) => {
          const on = i === index
          return (
            <li key={s.name} data-rollout>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => select(i)}
                onMouseEnter={() => select(i)}
                className={`flex h-full w-full flex-col rounded-3xl border p-4 text-left transition-[border-color,background,box-shadow,transform] duration-500 ${
                  on ? 'border-fg bg-surface shadow-[0_30px_50px_-36px_rgb(58_42_29/0.6)] md:-translate-y-1' : 'border-line hover:border-line-strong'
                }`}
              >
                <span aria-hidden="true" className={`block h-32 overflow-hidden rounded-2xl transition-colors duration-500 ${on ? 'bg-canvas-alt' : 'bg-canvas-alt/50'}`}>
                  <StageVisual i={i} />
                </span>
                <span className="mt-5 flex items-center gap-2 px-1">
                  <span className="font-mono text-[0.68rem] text-accent-ink md:hidden">0{i + 1}</span>
                  <span className="text-lg font-medium tracking-[-0.015em]">{s.name}</span>
                </span>
                <span className="mt-1.5 px-1 pb-1 text-[0.92rem] leading-relaxed text-muted">{s.body}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

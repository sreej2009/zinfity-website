import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { DemoFrame, Seg } from './DemoFrame'
import { useInView } from '@/hooks/useInView'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

const layers = [
  { name: 'Interface', detail: 'Web and mobile screens send the request and show the result.', modules: ['Portal', 'Admin', 'Mobile'] },
  { name: 'Application services', detail: 'Business rules check permissions, validate and decide what happens.', modules: ['Orders', 'Billing', 'Users', 'Rules'] },
  { name: 'Integrations', detail: 'Connectors talk to the tools you already use.', modules: ['Payments', 'Email', 'ERP'] },
  { name: 'Data & infrastructure', detail: 'Records are stored, logged and backed up.', modules: ['Database', 'Files', 'Logs'] },
]

/** Custom software: a layered platform in CSS 3D; a request travels down and back up. */
export function ArchitectureDemo({ tone = 'dark', blueprint = false }: { tone?: 'dark' | 'light'; blueprint?: boolean }) {
  const [active, setActive] = useState(0)
  const [running, setRunning] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const root = useRef<HTMLDivElement>(null)
  const stack = useRef<HTMLDivElement>(null)
  const seen = useInView(root, { once: true, threshold: 0.5 })

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Play one request through the layers the first time the demo is seen.
  useEffect(() => {
    if (seen && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen])

  // Exploded view: layers start spread apart and come together as you scroll.
  useGSAP(
    () => {
      if (!blueprint) return
      gsap.matchMedia().add(MOTION, () => {
        gsap.fromTo(
          stack.current,
          { '--gap': '78px' },
          { '--gap': '34px', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'center 45%', scrub: 0.6 } },
        )
      })
    },
    { scope: root, dependencies: [blueprint] },
  )

  const run = () => {
    timers.current.forEach(clearTimeout)
    setRunning(true)
    const seq = [0, 1, 2, 3, 2, 1, 0]
    seq.forEach((l, i) => timers.current.push(setTimeout(() => setActive(l), i * 550)))
    timers.current.push(setTimeout(() => setRunning(false), seq.length * 550))
  }

  return (
    <div ref={root}>
    <DemoFrame
      tone={tone}
      title="A platform in clear layers"
      controls={
        <Seg on={running} onClick={run} label="Send a request through the platform">
          <Play size={13} aria-hidden="true" /> {running ? 'Request in flight…' : 'Send a request'}
        </Seg>
      }
    >
      <div className="grid items-center gap-8 px-5 py-10 lg:grid-cols-12 lg:px-10">
        {/* Phones: a flat, readable stack. Larger screens: the tilted 3D view. */}
        <div className="lg:col-span-7 sm:[perspective:1100px]">
          {/* Flatter tilt on phones keeps every layer readable */}
          <div
            ref={stack}
            className="mx-auto max-w-[30rem] sm:[transform:rotateX(52deg)_rotateZ(-32deg)]"
            style={{ transformStyle: 'preserve-3d', ['--gap' as string]: '34px' }}
          >
            {layers.map((l, i) => (
              <button
                key={l.name}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={`relative mb-2 block w-full rounded-2xl sm:mb-[-1.2rem] border p-4 text-left transition-all duration-500 ${
                  active === i ? 'border-accent bg-accent/20 shadow-[0_0_60px_rgb(217_182_144/0.35)]' : 'border-line-strong bg-surface/80'
                }`}
                style={{ transform: `translateZ(calc(var(--gap) * ${layers.length - i} + ${active === i ? 18 : 0}px))` }}
              >
                <span className="eyebrow text-[0.6rem] text-subtle">L{i + 1}</span>
                <span className="mt-1 block text-[0.95rem] font-medium">{l.name}</span>
                <span className="mt-2 flex flex-wrap gap-1.5" aria-hidden="true">
                  {l.modules.map((m) => (
                    <span key={m} className="rounded border border-line px-1.5 py-0.5 text-[0.6rem] text-muted">
                      {m}
                    </span>
                  ))}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5" aria-live="polite">
          <p className="eyebrow text-accent">Layer {active + 1} of {layers.length}</p>
          <p className="mt-3 text-2xl font-medium tracking-[-0.02em]">{layers[active].name}</p>
          <p className="mt-3 leading-relaxed text-muted">{layers[active].detail}</p>
          <ol className="mt-8 space-y-2">
            {layers.map((l, i) => (
              <li key={l.name} className="flex items-center gap-3 text-[0.85rem]">
                <span className={`h-px transition-all duration-500 ${i === active ? 'w-10 bg-accent' : 'w-4 bg-line-strong'}`} />
                <span className={i === active ? 'text-fg' : 'text-subtle'}>{l.name}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </DemoFrame>
    </div>
  )
}

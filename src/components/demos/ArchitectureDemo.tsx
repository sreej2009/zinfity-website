import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { DemoFrame, Seg } from './DemoFrame'

const layers = [
  { name: 'Interface', detail: 'Web and mobile screens send the request and show the result.', modules: ['Portal', 'Admin', 'Mobile'] },
  { name: 'Application services', detail: 'Business rules check permissions, validate and decide what happens.', modules: ['Orders', 'Billing', 'Users', 'Rules'] },
  { name: 'Integrations', detail: 'Connectors talk to the tools you already use.', modules: ['Payments', 'Email', 'ERP'] },
  { name: 'Data & infrastructure', detail: 'Records are stored, logged and backed up.', modules: ['Database', 'Files', 'Logs'] },
]

/** Custom software: a layered platform in CSS 3D; a request travels down and back up. */
export function ArchitectureDemo() {
  const [active, setActive] = useState(0)
  const [running, setRunning] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const run = () => {
    timers.current.forEach(clearTimeout)
    setRunning(true)
    const seq = [0, 1, 2, 3, 2, 1, 0]
    seq.forEach((l, i) => timers.current.push(setTimeout(() => setActive(l), i * 550)))
    timers.current.push(setTimeout(() => setRunning(false), seq.length * 550))
  }

  return (
    <DemoFrame
      title="A platform in clear layers"
      controls={
        <Seg on={running} onClick={run} label="Send a request through the platform">
          <Play size={13} aria-hidden="true" /> {running ? 'Request in flight…' : 'Send a request'}
        </Seg>
      }
    >
      <div className="grid items-center gap-8 px-5 py-10 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-7" style={{ perspective: '1100px' }}>
          <div className="mx-auto max-w-[30rem]" style={{ transform: 'rotateX(52deg) rotateZ(-32deg)', transformStyle: 'preserve-3d' }}>
            {layers.map((l, i) => (
              <button
                key={l.name}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={`relative mb-[-1.2rem] block w-full rounded-2xl border p-4 text-left transition-all duration-500 ${
                  active === i ? 'border-accent bg-accent/20 shadow-[0_0_60px_rgb(217_182_144/0.35)]' : 'border-line-strong bg-surface/80'
                }`}
                style={{ transform: `translateZ(${(layers.length - i) * 34 + (active === i ? 18 : 0)}px)` }}
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
  )
}

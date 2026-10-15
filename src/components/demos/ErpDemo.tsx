import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'
import { DemoFrame, Seg } from './DemoFrame'

const modules = [
  { id: 'crm', name: 'CRM & sales', x: 18, y: 22 },
  { id: 'inventory', name: 'Inventory', x: 50, y: 12 },
  { id: 'purchasing', name: 'Purchasing', x: 82, y: 22 },
  { id: 'finance', name: 'Finance', x: 82, y: 78 },
  { id: 'service', name: 'Service', x: 50, y: 88 },
  { id: 'people', name: 'People', x: 18, y: 78 },
]

const events = [
  { module: 'crm', text: 'Order captured against the customer record' },
  { module: 'inventory', text: 'Stock reserved at the nearest location' },
  { module: 'purchasing', text: 'Reorder suggested — stock below threshold' },
  { module: 'finance', text: 'Invoice raised from the same order data' },
  { module: 'service', text: 'Delivery scheduled and customer notified' },
]

/** ERP/CRM: one order moves through connected modules; each step is logged once. */
export function ErpDemo() {
  const [step, setStep] = useState(-1)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const run = () => {
    timers.current.forEach(clearTimeout)
    setStep(-1)
    events.forEach((_, i) => timers.current.push(setTimeout(() => setStep(i), 300 + i * 900)))
  }
  const reset = () => {
    timers.current.forEach(clearTimeout)
    setStep(-1)
  }

  const lit = new Set(events.slice(0, step + 1).map((e) => e.module))
  const current = step >= 0 ? events[step].module : null

  return (
    <DemoFrame
      title="One order, every team in step"
      controls={
        <>
          <Seg on={false} onClick={run} label="Simulate a customer order">
            <Play size={13} aria-hidden="true" /> Place an order
          </Seg>
          <Seg on={false} onClick={reset} label="Reset the simulation">
            <RotateCcw size={13} aria-hidden="true" />
          </Seg>
        </>
      }
    >
      <div className="grid gap-8 px-5 py-8 lg:grid-cols-12 lg:px-8">
        <div className="relative aspect-[4/3] lg:col-span-7" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {modules.map((m) => (
              <line
                key={m.id}
                x1="50"
                y1="50"
                x2={m.x}
                y2={m.y}
                stroke={lit.has(m.id) ? '#d9b690' : 'rgb(237 233 227 / 0.15)'}
                strokeWidth={lit.has(m.id) ? 0.6 : 0.3}
                vectorEffect="non-scaling-stroke"
                style={{ transition: 'stroke .5s' }}
              />
            ))}
          </svg>
          <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-accent bg-accent/15 text-center text-[0.7rem] leading-tight">
            Shared
            <br />
            record
          </div>
          {modules.map((m) => (
            <div
              key={m.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border px-3 py-2 text-[0.75rem] transition-all duration-500 ${
                current === m.id
                  ? 'scale-110 border-accent bg-accent text-[#171717]'
                  : lit.has(m.id)
                    ? 'border-accent/60 bg-surface text-fg'
                    : 'border-line-strong bg-surface text-muted'
              }`}
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
            >
              {m.name}
            </div>
          ))}
        </div>
        <div className="lg:col-span-5">
          <p className="eyebrow text-subtle">Event log</p>
          <ol className="mt-4 space-y-2" aria-live="polite">
            {events.map((e, i) => (
              <li
                key={e.text}
                className={`flex gap-3 rounded-lg border px-3 py-2.5 text-[0.85rem] transition-all duration-500 ${
                  i <= step ? 'border-line-strong text-fg opacity-100' : 'border-transparent text-subtle opacity-40'
                }`}
              >
                <span className="font-mono text-[0.7rem] text-accent">{String(i + 1).padStart(2, '0')}</span>
                {i <= step ? e.text : 'Waiting…'}
              </li>
            ))}
          </ol>
          <p className="mt-5 text-[0.82rem] text-muted">Entered once. Every team sees the same order — no re-typing between tools.</p>
        </div>
      </div>
    </DemoFrame>
  )
}

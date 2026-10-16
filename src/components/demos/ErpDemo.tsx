import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'
import { DemoFrame, Seg } from './DemoFrame'
import { useInView } from '@/hooks/useInView'

const modules = [
  { id: 'crm', name: 'CRM & sales', x: 18, y: 22 },
  { id: 'inventory', name: 'Inventory', x: 50, y: 12 },
  { id: 'purchasing', name: 'Purchasing', x: 82, y: 22 },
  { id: 'finance', name: 'Finance', x: 82, y: 78 },
  { id: 'service', name: 'Operations', x: 50, y: 88 },
  { id: 'people', name: 'People', x: 18, y: 78 },
]

const events = [
  { module: 'crm', text: 'Order captured against the customer record' },
  { module: 'inventory', text: 'Stock reserved at the nearest location' },
  { module: 'purchasing', text: 'Reorder suggested — stock below threshold' },
  { module: 'finance', text: 'Invoice raised from the same order data' },
  { module: 'service', text: 'Delivery scheduled and customer notified' },
]

/** Illustrative dashboard figures (not real data). Each step of the order updates them. */
const base = { pipeline: 24, orders: 12, stock: 46, invoices: 8 }
const kpiAfterStep = (step: number) => ({
  pipeline: base.pipeline - (step >= 0 ? 1 : 0),
  orders: base.orders + (step >= 0 ? 1 : 0),
  stock: base.stock - (step >= 1 ? 1 : 0),
  invoices: base.invoices + (step >= 3 ? 1 : 0),
})

const spark = (seed: number) =>
  Array.from({ length: 12 }, (_, i) => 30 + Math.sin(i * 0.9 + seed) * 10 + i * 2 * (seed % 2 ? 1 : -0.4))
    .map((y, i) => `${i ? 'L' : 'M'}${(i * 100) / 11} ${60 - y}`)
    .join(' ')

/** ERP/CRM: an operations dashboard; one order moves through connected modules. */
export function ErpDemo() {
  const [step, setStep] = useState(-1)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const root = useRef<HTMLDivElement>(null)
  const seen = useInView(root, { once: true, threshold: 0.45 })
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const run = () => {
    timers.current.forEach(clearTimeout)
    setStep(-1)
    events.forEach((_, i) => timers.current.push(setTimeout(() => setStep(i), 400 + i * 1000)))
  }
  const reset = () => {
    timers.current.forEach(clearTimeout)
    setStep(-1)
  }

  // Play the example order automatically the first time the dashboard is seen.
  useEffect(() => {
    if (seen && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen])

  const lit = new Set(events.slice(0, step + 1).map((e) => e.module))
  const current = step >= 0 ? events[step].module : null
  const k = kpiAfterStep(step)
  const kpis = [
    { label: 'Sales pipeline', value: k.pipeline, unit: 'open deals', mod: 'crm' },
    { label: 'Open orders', value: k.orders, unit: 'today', mod: 'crm' },
    { label: 'Stock on hand', value: k.stock, unit: 'units · SKU-204', mod: 'inventory' },
    { label: 'Invoices issued', value: k.invoices, unit: 'this week', mod: 'finance' },
  ]

  return (
    <div ref={root}>
      <DemoFrame
        title="Operations dashboard — one order, every team in step"
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
        caption="Illustrative data for demonstration — not a real business or live system."
      >
        {/* KPI row */}
        <ul className="grid grid-cols-2 gap-px border-b border-line bg-line lg:grid-cols-4" aria-label="Illustrative dashboard figures">
          {kpis.map((c, i) => (
            <li key={c.label} className={`bg-canvas px-5 py-4 transition-colors duration-500 ${current === c.mod ? 'bg-accent/10' : ''}`}>
              <p className="eyebrow text-[0.58rem] text-subtle">{c.label}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-2xl font-medium tabular-nums tracking-[-0.03em]">
                  {c.value}
                  <span className="ml-1.5 text-[0.7rem] font-normal tracking-normal text-subtle">{c.unit}</span>
                </p>
                <svg viewBox="0 0 100 60" className="h-7 w-16" aria-hidden="true" preserveAspectRatio="none">
                  <path d={spark(i + 1)} fill="none" stroke={i % 2 ? '#d9b690' : 'rgb(237 233 227 / 0.5)'} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            </li>
          ))}
        </ul>

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
                  stroke={lit.has(m.id) ? '#d9b690' : 'rgb(237 233 227 / 0.22)'}
                  strokeWidth={lit.has(m.id) ? 0.7 : 0.35}
                  strokeDasharray={lit.has(m.id) ? undefined : '1.5 1.5'}
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
                    ? 'scale-110 border-accent bg-accent text-[#171717] shadow-[0_0_30px_rgb(217_182_144/0.35)]'
                    : lit.has(m.id)
                      ? 'border-accent/60 bg-surface text-fg'
                      : 'border-line-strong bg-surface text-fg/80'
                }`}
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
              >
                <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${lit.has(m.id) ? 'bg-accent' : 'bg-success'}`} />
                {m.name}
              </div>
            ))}
            {/* The moving order token */}
            {current && (
              <span
                key={current}
                className="fade-in absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_6px_rgb(217_182_144/0.25)] transition-all duration-700"
                style={{ left: `${(50 + modules.find((m) => m.id === current)!.x) / 2}%`, top: `${(50 + modules.find((m) => m.id === current)!.y) / 2}%` }}
              />
            )}
          </div>
          <div className="lg:col-span-5">
            <p className="eyebrow flex items-center justify-between text-subtle">
              Event log
              <span className="font-mono normal-case tracking-normal">Order #1042 · example</span>
            </p>
            <ol className="mt-4 space-y-2" aria-live="polite">
              {events.map((e, i) => (
                <li
                  key={e.text}
                  className={`flex gap-3 rounded-lg border px-3 py-2.5 text-[0.85rem] transition-all duration-500 ${
                    i <= step ? 'border-line-strong bg-surface/60 text-fg' : 'border-line text-muted'
                  }`}
                >
                  <span className={`font-mono text-[0.7rem] ${i <= step ? 'text-accent' : 'text-subtle'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1">{e.text}</span>
                  <span className="text-[0.7rem] text-subtle">{i <= step ? 'Done' : 'Next'}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-[0.82rem] text-muted">Entered once. Every team sees the same order — no re-typing between tools.</p>
          </div>
        </div>
      </DemoFrame>
    </div>
  )
}

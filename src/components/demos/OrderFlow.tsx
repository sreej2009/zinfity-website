import { useEffect, useRef, useState } from 'react'
import { Check, Package, RotateCcw } from 'lucide-react'
import { useInView } from '@/hooks/useInView'

/** The systems one purchase passes through, with the step at which each one updates. */
const pipeline = [
  { name: 'Checkout', at: 0 },
  { name: 'Order', at: 1 },
  { name: 'Inventory', at: 1 },
  { name: 'Payment', at: 2 },
  { name: 'Invoice', at: 3 },
]

const shopper = ['Product added to bag', 'Checkout completed', 'Payment confirmed', 'Confirmation email sent']
const operator = [
  { area: 'Orders', text: 'New order #2048 created' },
  { area: 'Inventory', text: 'Form Bottle · Bronze: stock 18 → 17' },
  { area: 'Payments', text: 'Payment matched to the order' },
  { area: 'Finance', text: 'Invoice INV-2048 generated' },
]

/** E-commerce: the shopper's purchase and the operator's back office, side by side (illustrative). */
export function OrderFlow() {
  const [step, setStep] = useState(-1)
  const root = useRef<HTMLDivElement>(null)
  const seen = useInView(root, { once: true, threshold: 0.4 })
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const play = () => {
    timers.current.forEach(clearTimeout)
    setStep(-1)
    shopper.forEach((_, i) => timers.current.push(setTimeout(() => setStep(i), 300 + i * 900)))
  }
  useEffect(() => {
    if (!seen) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setStep(shopper.length - 1)
    else play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen])

  const row = (on: boolean, children: React.ReactNode, key: string) => (
    <li
      key={key}
      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-[0.88rem] transition-all duration-500 ${on ? 'border-accent/60 bg-accent/10 opacity-100' : 'border-line opacity-45'}`}
    >
      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${on ? 'border-accent-ink bg-accent-ink text-canvas' : 'border-line-strong'}`}>
        {on && <Check size={11} aria-hidden="true" />}
      </span>
      {children}
    </li>
  )

  const lit = pipeline.filter((p) => step >= p.at).length
  return (
    <div ref={root}>
      {/* Pipeline: the purchase travelling through each connected system */}
      <div aria-hidden="true" className="relative mb-6 px-[6%]">
        <span className="absolute left-[14.8%] right-[14.8%] top-[0.95rem] h-px bg-line-strong" />
        <span
          className="absolute left-[14.8%] top-[0.95rem] h-px bg-accent-ink transition-[width] duration-700 ease-[var(--ease-out-expo)]"
          style={{
            width: `${Math.max(0, lit - 1) * 17.6}%`,
          }}
        />
        <span
          className="absolute top-[0.95rem] z-10 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md bg-accent text-[#171717] shadow-[0_0_0_5px_rgb(199_155_105/0.2)] transition-[left,opacity] duration-700 ease-[var(--ease-out-expo)]"
          style={{
            left: `${14.8 + Math.max(0, lit - 1) * 17.6}%`,
            opacity: lit ? 1 : 0,
          }}
        >
          <Package size={13} />
        </span>
        <ol className="relative grid grid-cols-5">
          {pipeline.map((p, i) => (
            <li key={p.name} className="flex flex-col items-center gap-2">
              <span className={`h-[1.9rem] w-[1.9rem] rounded-full border-2 transition-colors duration-500 ${i < lit ? 'border-accent-ink bg-surface' : 'border-line-strong bg-canvas'}`} />
              <span className={`text-[0.7rem] transition-colors duration-500 sm:text-[0.8rem] ${i < lit ? 'text-fg' : 'text-subtle'}`}>{p.name}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="grid overflow-hidden rounded-[1.5rem] border border-line md:grid-cols-2">
        <div className="bg-surface p-6 sm:p-8">
          <p className="eyebrow text-accent-ink">Shopper · storefront</p>
          <ol className="mt-5 space-y-2.5" aria-label="Shopper steps">
            {shopper.map((s, i) => row(i <= step, <span>{s}</span>, s))}
          </ol>
        </div>
        <div className="theme-dark bg-canvas p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-accent">Operator · back office</p>
            <button type="button" onClick={play} className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1 text-[0.75rem] text-fg hover:border-fg">
              <RotateCcw size={12} aria-hidden="true" /> Replay
            </button>
          </div>
          <ol className="mt-5 space-y-2.5" aria-label="Back-office updates" aria-live="polite">
            {operator.map((o, i) =>
              row(
                i <= step,
                <span className="flex flex-1 items-baseline justify-between gap-3">
                  <span>{o.text}</span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-subtle">{o.area}</span>
                </span>,
                o.text,
              ),
            )}
          </ol>
          <p className="mt-5 text-[0.78rem] text-muted">Illustrative example — fictional product and order.</p>
        </div>
      </div>
    </div>
  )
}

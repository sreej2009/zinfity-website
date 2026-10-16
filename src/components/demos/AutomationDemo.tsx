import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Bot, Hand } from 'lucide-react'
import { DemoFrame, Seg } from './DemoFrame'
import { useInView } from '@/hooks/useInView'
import { Flip } from '@/lib/gsap'

const requests = [
  { id: 'r1', text: 'Question about an invoice', tag: 'Billing', team: 'Finance' },
  { id: 'r2', text: 'New quote request', tag: 'Sales', team: 'Sales' },
  { id: 'r3', text: 'Change delivery date', tag: 'Orders', team: 'Operations' },
  { id: 'r4', text: 'Contract renewal', tag: 'Accounts', team: 'Account manager' },
  { id: 'r5', text: 'Product not working', tag: 'Support', team: 'Support' },
]
const columns = ['Inbox', 'Classified', 'Routed', 'Ready for review']

/** AI & automation: the same requests handled manually vs. by a connected workflow. */
export function AutomationDemo() {
  // Populated starting state: requests already spread across the pipeline.
  const [mode, setMode] = useState<'manual' | 'auto'>('auto')
  const [stage, setStage] = useState<number[]>([3, 2, 1, 1, 0])
  const board = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const seen = useInView(root, { once: true, threshold: 0.4 })
  const flipState = useRef<Flip.FlipState | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Animate cards between columns with FLIP whenever their stage changes.
  useLayoutEffect(() => {
    if (!flipState.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    Flip.from(flipState.current, { duration: 0.7, ease: 'power3.inOut', absolute: true })
    flipState.current = null
  }, [stage])

  const move = (next: number[]) => {
    if (board.current) flipState.current = Flip.getState(board.current.querySelectorAll('[data-card]'))
    setStage(next)
  }

  const switchMode = (m: 'manual' | 'auto') => {
    timers.current.forEach(clearTimeout)
    setMode(m)
    if (m === 'manual') return move(requests.map(() => 0))
    let current = requests.map(() => 0)
    move([...current])
    // Each request advances one column at a time, staggered.
    for (let step = 1; step <= 3; step++) {
      requests.forEach((_, i) => {
        timers.current.push(
          setTimeout(() => {
            current = current.map((v, k) => (k === i ? step : v))
            move([...current])
          }, 500 + (step - 1) * 900 + i * 160),
        )
      })
    }
  }

  // Replay the automated flow from the inbox when the board scrolls into view.
  useEffect(() => {
    if (seen && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) switchMode('auto')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen])

  return (
    <div ref={root}>
    <DemoFrame
      title="From manual triage to a connected workflow"
      controls={
        <>
          <Seg on={mode === 'manual'} onClick={() => switchMode('manual')}>
            <Hand size={13} aria-hidden="true" /> Manual
          </Seg>
          <Seg on={mode === 'auto'} onClick={() => switchMode('auto')}>
            <Bot size={13} aria-hidden="true" /> Automated
          </Seg>
        </>
      }
      caption={
        <span aria-live="polite">
          {mode === 'manual'
            ? 'Manual: every request waits until someone reads, sorts and forwards it.'
            : 'Automated: requests are classified, routed and drafted — a person still reviews before anything is sent.'}
        </span>
      }
    >
      <div ref={board} className="grid gap-3 overflow-x-auto px-5 py-8 sm:grid-cols-4 lg:px-8">
        {columns.map((c, ci) => (
          <div key={c} className="min-h-[18rem] rounded-xl border border-line bg-surface/50 p-3">
            <p className="eyebrow flex items-center justify-between text-subtle">
              {c}
              <span className="font-mono">{stage.filter((s) => s === ci).length}</span>
            </p>
            <ul className="mt-3 space-y-2">
              {requests.map((r, i) =>
                stage[i] === ci ? (
                  <li key={r.id} data-card data-flip-id={r.id} className="rounded-lg border border-line-strong bg-canvas p-3 text-[0.8rem]">
                    <p className="text-fg">{r.text}</p>
                    {ci === 0 && mode === 'manual' && <p className="mt-1 text-[0.7rem] text-subtle">Waiting for someone to read</p>}
                    {ci >= 1 && <span className="mt-2 inline-block rounded border border-accent/50 px-1.5 py-0.5 text-[0.65rem] text-accent">{r.tag}</span>}
                    {ci >= 2 && <p className="mt-1 text-[0.7rem] text-muted">→ {r.team}</p>}
                    {ci === 3 && <p className="mt-1 text-[0.7rem] text-accent">Draft reply prepared</p>}
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        ))}
      </div>
    </DemoFrame>
    </div>
  )
}


import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Activity, Camera, Check, ChevronDown, Database, Globe, KeyRound, ListFilter, RotateCcw, Server, ShieldCheck, TextCursorInput, Users, X, Zap } from 'lucide-react'
import { useAutoCycle } from '@/hooks/useAutoCycle'
import { useInView } from '@/hooks/useInView'
import type { MsProductId } from '@/content/microsoft'

/* Shared chrome: a light application window with a title bar. */
function AppWindow({ title, tag, children, className = '' }: { title: string; tag?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_70px_-45px_rgb(58_42_29/0.6)] ${className}`}>
      <div className="flex items-center gap-3 border-b border-line bg-canvas-alt/70 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-[#171717]/15" />
          <span className="h-2 w-2 rounded-full bg-[#171717]/15" />
          <span className="h-2 w-2 rounded-full bg-accent" />
        </span>
        <span className="truncate text-[0.78rem] font-medium">{title}</span>
        {tag && <span className="ml-auto shrink-0 rounded-full border border-line px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-subtle">{tag}</span>}
      </div>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Dynamics 365: sales pipeline + customer timeline                    */
/* ------------------------------------------------------------------ */
const stages = ['Lead', 'Qualified', 'Proposal', 'Won']
const others = [
  ['Clinic group', 'Retail chain'],
  ['Logistics firm'],
  ['Training institute', 'Hotel group'],
  ['Builders’ merchant'],
]
const timeline = ['Enquiry received from website', 'Discovery call logged', 'Proposal shared with the buyer', 'Order confirmed — handed to finance']

function PipelineBoard() {
  const root = useRef<HTMLDivElement>(null)
  const { index, select } = useAutoCycle(stages.length, root, 2400)
  return (
    <div ref={root}>
      <AppWindow title="Sales · Opportunity pipeline" tag="Illustrative">
        <div className="grid grid-cols-4 gap-2 p-3 sm:gap-3 sm:p-4">
          {stages.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => select(i)}
              aria-pressed={i === index}
              aria-label={`Move the highlighted opportunity to ${s}`}
              className={`min-h-[11rem] rounded-xl border p-1.5 text-left transition-colors duration-500 sm:p-2 ${i === index ? 'border-accent/70 bg-accent/10' : 'border-line bg-canvas-alt/50 hover:border-line-strong'}`}
            >
              <span className="flex items-center justify-between px-1 pb-2 text-[0.62rem] font-medium uppercase tracking-[0.08em] text-muted sm:text-[0.68rem]">{s}</span>
              <span className="flex flex-col gap-1.5">
                {i === index && (
                  <span key={`hot-${index}`} className="fade-in rounded-lg border border-fg bg-white p-1.5 shadow-[0_14px_24px_-16px_rgb(23_23_23/0.6)] sm:p-2">
                    <span className="block break-words text-[0.56rem] font-medium leading-tight sm:text-[0.7rem]">Manufacturing co.</span>
                    <span className="mt-1 block h-1 w-3/4 rounded-full bg-accent" />
                  </span>
                )}
                {others[i].map((o) => (
                  <span key={o} className="rounded-lg border border-line bg-white p-1.5 sm:p-2">
                    <span className="block text-[0.58rem] leading-tight text-muted sm:text-[0.68rem]">{o}</span>
                    <span className="mt-1 block h-1 w-1/2 rounded-full bg-[#171717]/10" />
                  </span>
                ))}
              </span>
            </button>
          ))}
        </div>
      </AppWindow>
      <div className="relative z-10 -mt-6 ml-auto w-[88%] rounded-xl border border-line bg-surface p-4 shadow-[0_24px_40px_-28px_rgb(58_42_29/0.55)] sm:w-[62%]" aria-live="polite">
        <p className="eyebrow text-[0.6rem] text-accent-ink">Customer timeline</p>
        <ol className="mt-3 space-y-2">
          {timeline.map((t, i) => (
            <li key={t} className={`flex items-start gap-2.5 text-[0.78rem] transition-opacity duration-500 ${i <= index ? 'opacity-100' : 'opacity-30'}`}>
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${i <= index ? 'bg-accent-ink' : 'bg-line-strong'}`} />
              {t}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Business Central: finance, sales, purchasing, inventory views       */
/* ------------------------------------------------------------------ */
const bcTabs = ['Finance', 'Sales', 'Purchasing', 'Inventory'] as const

function StatusPill({ tone, children }: { tone: 'ok' | 'wait' | 'warn'; children: ReactNode }) {
  const c = tone === 'ok' ? 'bg-[#e6efe6] text-[#2f5a35]' : tone === 'wait' ? 'bg-accent/15 text-accent-ink' : 'bg-[#f3e1dc] text-[#8a3b2a]'
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-medium ${c}`}>{children}</span>
}

function BcView({ tab }: { tab: (typeof bcTabs)[number] }) {
  const row = (a: string, b: ReactNode, k: string) => (
    <li key={k} className="flex items-center justify-between gap-3 border-b border-line py-2 text-[0.76rem] last:border-0">
      <span className="truncate">{a}</span>
      {b}
    </li>
  )
  if (tab === 'Finance')
    return (
      <div className="grid gap-3 sm:grid-cols-5">
        <div className="rounded-xl border border-line p-3 sm:col-span-3">
          <p className="text-[0.68rem] text-muted">Cash flow forecast</p>
          <svg viewBox="0 0 200 70" className="mt-2 h-24 w-full" aria-hidden="true" preserveAspectRatio="none">
            <path d="M0 55 C30 50 40 30 70 34 S120 50 140 28 S180 14 200 18 L200 70 L0 70 Z" fill="rgb(199 155 105 / 0.18)" />
            <path d="M0 55 C30 50 40 30 70 34 S120 50 140 28 S180 14 200 18" fill="none" stroke="#8c5e34" strokeWidth="1.6" pathLength={1} className="draw" />
          </svg>
        </div>
        <ul className="rounded-xl border border-line px-3 py-1 sm:col-span-2">
          {row('Bank reconciliation', <StatusPill tone="ok">Done</StatusPill>, 'a')}
          {row('VAT return', <StatusPill tone="wait">Draft</StatusPill>, 'b')}
          {row('Overdue invoices', <StatusPill tone="warn">Review</StatusPill>, 'c')}
        </ul>
      </div>
    )
  if (tab === 'Sales')
    return (
      <ul className="rounded-xl border border-line px-3 py-1">
        {row('SO-1042 · Manufacturing co.', <StatusPill tone="ok">Shipped</StatusPill>, 'a')}
        {row('SO-1043 · Retail chain', <StatusPill tone="wait">Picking</StatusPill>, 'b')}
        {row('SO-1044 · Hotel group', <StatusPill tone="wait">Released</StatusPill>, 'c')}
        {row('Invoice for SO-1042', <StatusPill tone="ok">Posted</StatusPill>, 'd')}
      </ul>
    )
  if (tab === 'Purchasing')
    return (
      <ul className="rounded-xl border border-line px-3 py-1">
        {row('PO-2210 · Packaging supplier', <StatusPill tone="wait">Awaiting approval</StatusPill>, 'a')}
        {row('PO-2211 · Raw materials', <StatusPill tone="ok">Approved</StatusPill>, 'b')}
        {row('PO-2208 · Spare parts', <StatusPill tone="ok">Received</StatusPill>, 'c')}
        {row('Vendor invoice matched to PO-2208', <StatusPill tone="ok">Matched</StatusPill>, 'd')}
      </ul>
    )
  return (
    <div className="rounded-xl border border-line p-3">
      <p className="text-[0.68rem] text-muted">Stock against reorder point</p>
      <div className="mt-3 space-y-2.5">
        {[
          ['Item A · Bronze', 78],
          ['Item B · Steel', 52],
          ['Item C · Graphite', 24],
          ['Item D · Copper', 64],
        ].map(([n, w]) => (
          <div key={n as string} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 text-[0.72rem]">
            <span className="truncate">{n}</span>
            <span className="relative h-2 rounded-full bg-canvas-alt">
              <span className={`absolute inset-y-0 left-0 rounded-full ${(w as number) < 35 ? 'bg-[#c4705a]' : 'bg-accent'}`} style={{ width: `${w}%` }} />
              <span className="absolute -top-1 bottom-[-0.25rem] left-[35%] w-px bg-fg/50" />
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[0.66rem] text-subtle">Line marks the reorder point. Item C would raise a purchase suggestion.</p>
    </div>
  )
}

function BcDashboard() {
  const root = useRef<HTMLDivElement>(null)
  const { index, select } = useAutoCycle(bcTabs.length, root, 3000)
  return (
    <div ref={root}>
      <AppWindow title="Business Central · Role centre" tag="Illustrative data">
        <div className="grid sm:grid-cols-[9rem_1fr]">
          <div role="tablist" aria-label="Business Central areas" className="flex gap-1 overflow-x-auto border-b border-line p-2 sm:flex-col sm:border-b-0 sm:border-r">
            {bcTabs.map((t, i) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={i === index}
                onClick={() => select(i)}
                className={`shrink-0 rounded-lg px-3 py-2 text-left text-[0.78rem] transition-colors ${i === index ? 'bg-fg text-canvas' : 'text-muted hover:bg-canvas-alt hover:text-fg'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div role="tabpanel" aria-label={bcTabs[index]} className="min-h-[13.5rem] p-3 sm:p-4">
            <div key={index} className="fade-in">
              <BcView tab={bcTabs[index]} />
            </div>
          </div>
        </div>
      </AppWindow>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Power Apps: low-code builder assembling a mobile form               */
/* ------------------------------------------------------------------ */
const parts = [
  { icon: TextCursorInput, label: 'Text input', render: <span className="block rounded-md border border-line px-2 py-1.5 text-[0.6rem] text-subtle">Site name</span> },
  { icon: ChevronDown, label: 'Dropdown', render: <span className="flex items-center justify-between rounded-md border border-line px-2 py-1.5 text-[0.6rem] text-subtle">Inspection type <ChevronDown size={10} /></span> },
  { icon: Camera, label: 'Camera', render: <span className="grid h-12 place-items-center rounded-md border border-dashed border-line-strong text-[0.58rem] text-subtle"><Camera size={14} /></span> },
  { icon: Check, label: 'Button', render: <span className="block rounded-full bg-[#171717] py-1.5 text-center text-[0.6rem] text-white">Submit inspection</span> },
]

function AppBuilder() {
  const root = useRef<HTMLDivElement>(null)
  const seen = useInView(root, { threshold: 0.35 })
  const [n, setN] = useState(0)
  const [run, setRun] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setN(parts.length + 1)
    setN(0)
    const t = Array.from({ length: parts.length + 1 }, (_, i) => setTimeout(() => setN(i + 1), 500 + i * 800))
    return () => t.forEach(clearTimeout)
  }, [seen, run])
  const connected = n > parts.length

  return (
    <div ref={root}>
      <AppWindow title="Power Apps · Canvas app" tag="Illustrative">
        <div className="grid grid-cols-[1fr_auto] gap-3 p-3 sm:grid-cols-[8.5rem_1fr_9rem] sm:gap-4 sm:p-4">
          {/* Component palette */}
          <ul className="hidden space-y-1.5 sm:block" aria-label="Components">
            {parts.map((p, i) => (
              <li key={p.label} className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-[0.7rem] transition-colors duration-500 ${i < n ? 'border-line text-subtle' : 'border-line-strong bg-canvas-alt'}`}>
                <p.icon size={12} aria-hidden="true" /> {p.label}
              </li>
            ))}
          </ul>
          {/* Phone canvas */}
          <div className="mx-auto w-[10.5rem] rounded-[1.4rem] border-[5px] border-[#171717] bg-white p-2.5 shadow-[0_24px_40px_-24px_rgb(0_0_0/0.5)]">
            <p className="text-[0.66rem] font-medium">Site inspection</p>
            <div className="mt-2 min-h-[10.5rem] space-y-1.5 rounded-lg border border-dashed border-line p-1.5">
              {parts.slice(0, n).map((p) => (
                <div key={p.label} className="fade-in">
                  {p.render}
                </div>
              ))}
            </div>
          </div>
          {/* Data source */}
          <div className="flex flex-col justify-center gap-2">
            <div className={`rounded-xl border p-2.5 transition-colors duration-500 ${connected ? 'border-accent-ink bg-accent/10' : 'border-line'}`}>
              <Database size={14} className="text-accent-ink" aria-hidden="true" />
              <p className="mt-1.5 text-[0.66rem] font-medium leading-tight">Dataverse table</p>
              <p className="text-[0.6rem] text-muted">Inspections</p>
            </div>
            <p className={`text-[0.6rem] transition-opacity duration-500 ${connected ? 'text-accent-ink opacity-100' : 'opacity-40'}`}>{connected ? '● Connected' : '○ Not connected'}</p>
            <button type="button" onClick={() => setRun((r) => r + 1)} className="inline-flex w-fit items-center gap-1 rounded-full border border-line-strong px-2.5 py-1 text-[0.66rem] hover:border-fg">
              <RotateCcw size={10} aria-hidden="true" /> Rebuild
            </button>
          </div>
        </div>
      </AppWindow>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Power BI: report canvas with a working slicer (illustrative data)   */
/* ------------------------------------------------------------------ */
const regions = ['All regions', 'North', 'South', 'West'] as const
const barSets = [
  [52, 64, 58, 72, 68, 80],
  [40, 46, 55, 50, 62, 66],
  [60, 58, 70, 74, 71, 84],
  [35, 48, 44, 57, 61, 59],
]
const linePaths = [
  'M0 40 C20 36 35 30 50 31 S80 22 100 14',
  'M0 44 C20 42 35 38 50 34 S80 30 100 24',
  'M0 36 C20 30 35 26 50 24 S80 14 100 8',
  'M0 46 C20 44 35 40 50 41 S80 34 100 30',
]
const donut = [62, 48, 70, 40]

function BiReport() {
  const root = useRef<HTMLDivElement>(null)
  const { index, select } = useAutoCycle(regions.length, root, 3200)
  const circ = 2 * Math.PI * 15
  return (
    <div ref={root}>
      <AppWindow title="Power BI · Operations report" tag="Illustrative data">
        <div className="space-y-3 p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Region slicer">
            <ListFilter size={13} className="mr-1 text-subtle" aria-hidden="true" />
            {regions.map((r, i) => (
              <button
                key={r}
                type="button"
                aria-pressed={i === index}
                onClick={() => select(i)}
                className={`rounded-full border px-2.5 py-1 text-[0.68rem] transition-colors ${i === index ? 'border-fg bg-fg text-canvas' : 'border-line hover:border-line-strong'}`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2" aria-hidden="true">
            {['Orders', 'On-time delivery', 'Open cases'].map((k, i) => (
              <div key={k} className="rounded-lg border border-line p-2">
                <p className="truncate text-[0.6rem] text-muted">{k}</p>
                <p className="mt-1 flex items-center gap-1 text-[0.66rem] font-medium">
                  <span className={`inline-block transition-transform duration-500 ${(index + i) % 3 === 2 ? 'rotate-90' : ''}`}>↗</span>
                  <span className="h-1.5 flex-1 rounded-full bg-[#171717]/10">
                    <span className="block h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${40 + ((index * 17 + i * 23) % 50)}%` }} />
                  </span>
                </p>
              </div>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-5" aria-hidden="true">
            <div className="rounded-lg border border-line p-2 sm:col-span-3">
              <p className="text-[0.6rem] text-muted">Monthly volume</p>
              <div className="mt-2 flex h-24 items-end gap-1.5">
                {barSets[index].map((h, k) => (
                  <span key={k} className="flex-1 rounded-t-sm transition-[height] duration-700 ease-[var(--ease-out-expo)]" style={{ height: `${h}%`, background: k === 5 ? 'linear-gradient(#e8cfae,#a8754c)' : 'rgb(140 94 52 / 0.25)' }} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:col-span-2 sm:grid-cols-1">
              <div className="rounded-lg border border-line p-2">
                <p className="text-[0.6rem] text-muted">Trend</p>
                <svg viewBox="0 0 100 50" className="mt-1 h-10 w-full" preserveAspectRatio="none">
                  <path d={linePaths[index]} fill="none" stroke="#8c5e34" strokeWidth="1.5" style={{ transition: 'd .7s' }} vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-line p-2">
                <svg viewBox="0 0 40 40" className="h-11 w-11 -rotate-90">
                  <circle cx="20" cy="20" r="15" fill="none" stroke="#efe9df" strokeWidth="6" />
                  <circle cx="20" cy="20" r="15" fill="none" stroke="#c79b69" strokeWidth="6" strokeDasharray={`${(donut[index] / 100) * circ} ${circ}`} style={{ transition: 'stroke-dasharray .7s' }} />
                </svg>
                <p className="text-[0.6rem] leading-tight text-muted">Channel mix</p>
              </div>
            </div>
          </div>
        </div>
      </AppWindow>
      <p className="mt-3 text-[0.75rem] text-subtle">Illustrative data — no real figures or client results. Choose a region to filter the report.</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Power Automate: approval flow with manual approve / reject          */
/* ------------------------------------------------------------------ */
function FlowRunner() {
  const root = useRef<HTMLDivElement>(null)
  const seen = useInView(root, { threshold: 0.35 })
  const [step, setStep] = useState(0)
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null)
  const [run, setRun] = useState(0)
  useEffect(() => {
    if (!seen) return
    setDecision(null)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setStep(2)
    setStep(0)
    const t = [setTimeout(() => setStep(1), 700), setTimeout(() => setStep(2), 1600)]
    // If nobody decides, approve automatically after a pause so the flow completes.
    const auto = setTimeout(() => setDecision((d) => d ?? 'approved'), 4200)
    return () => [...t, auto].forEach(clearTimeout)
  }, [seen, run])

  const card = (on: boolean, children: ReactNode) => (
    <div className={`relative z-10 rounded-xl border bg-white p-3 text-[0.78rem] transition-[border-color,box-shadow,opacity] duration-500 ${on ? 'border-fg opacity-100 shadow-[0_20px_34px_-24px_rgb(23_23_23/0.6)]' : 'border-line opacity-55'}`}>{children}</div>
  )
  const label = (icon: ReactNode, t: string, sub: string) => (
    <span className="flex items-start gap-2.5">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-panel text-accent">{icon}</span>
      <span>
        <span className="block font-medium">{t}</span>
        <span className="block text-[0.68rem] text-muted">{sub}</span>
      </span>
    </span>
  )
  const done = decision !== null

  return (
    <div ref={root} className="rounded-2xl border border-line bg-canvas-alt/60 p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="eyebrow text-[0.62rem] text-accent-ink">Power Automate · Cloud flow</p>
        <button type="button" onClick={() => setRun((r) => r + 1)} className="inline-flex items-center gap-1 rounded-full border border-line-strong px-2.5 py-1 text-[0.66rem] hover:border-fg">
          <RotateCcw size={10} aria-hidden="true" /> Run again
        </button>
      </div>
      <div className="relative mx-auto max-w-md space-y-3">
        <span aria-hidden="true" className="absolute bottom-6 left-1/2 top-6 w-px -translate-x-1/2 bg-line-strong" />
        {card(step >= 0, label(<Zap size={12} />, 'When a purchase request is submitted', 'Trigger · SharePoint list'))}
        {card(step >= 1, label(<ListFilter size={12} />, 'Check the request value', 'Condition · route to the right approver'))}
        {card(
          step >= 2,
          <>
            {label(<Users size={12} />, 'Start and wait for an approval', 'Approval · sent to the budget holder in Teams')}
            <div className="mt-3 flex gap-2" aria-live="polite">
              <button
                type="button"
                disabled={step < 2 || done}
                onClick={() => setDecision('approved')}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[0.7rem] transition-colors disabled:cursor-default ${decision === 'approved' ? 'bg-[#2f5a35] text-white' : 'bg-fg text-canvas disabled:opacity-40'}`}
              >
                <Check size={11} aria-hidden="true" /> {decision === 'approved' ? 'Approved' : 'Approve'}
              </button>
              <button
                type="button"
                disabled={step < 2 || done}
                onClick={() => setDecision('rejected')}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[0.7rem] transition-colors disabled:cursor-default ${decision === 'rejected' ? 'border-[#8a3b2a] bg-[#8a3b2a] text-white' : 'border-line-strong disabled:opacity-40'}`}
              >
                <X size={11} aria-hidden="true" /> {decision === 'rejected' ? 'Rejected' : 'Reject'}
              </button>
            </div>
          </>,
        )}
        <div className="relative z-10 grid grid-cols-2 gap-3">
          {card(decision === 'approved', label(<Check size={12} />, 'Create purchase order', 'Business Central'))}
          {card(decision === 'rejected', label(<X size={12} />, 'Notify the requester', 'Outlook · with the reason'))}
        </div>
      </div>
      <p className="mt-4 text-center text-[0.72rem] text-subtle">Illustrative flow — not connected to a live system.</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Azure: tiered cloud architecture with travelling requests           */
/* ------------------------------------------------------------------ */
function Tier({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="relative z-10">
      <p className="mb-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-subtle">{label}</p>
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </div>
  )
}
function Svc({ icon, name, note, hot }: { icon: ReactNode; name: string; note: string; hot?: boolean }) {
  return (
    <div className={`flex items-start gap-2 rounded-xl border bg-white p-2.5 ${hot ? 'border-accent-ink' : 'border-line'}`}>
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-panel text-accent">{icon}</span>
      <span className="min-w-0">
        <span className="block truncate text-[0.74rem] font-medium">{name}</span>
        <span className="block text-[0.62rem] leading-snug text-muted">{note}</span>
      </span>
    </div>
  )
}

function AzureArchitecture() {
  const root = useRef<HTMLDivElement>(null)
  const inView = useInView(root, { threshold: 0.2 })
  return (
    <div ref={root} className={`rounded-2xl border border-line bg-[linear-gradient(180deg,#fbfaf7,#f1ece4)] p-4 sm:p-6 ${inView ? '' : 'is-paused'}`}>
      <div className="mb-4 flex items-center justify-between">
        <p className="eyebrow text-[0.62rem] text-accent-ink">Illustrative architecture</p>
        <span className="flex items-center gap-1.5 text-[0.66rem] text-muted">
          <Globe size={12} aria-hidden="true" /> Users · apps · partners
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_9.5rem]">
        <div className="relative space-y-5">
          {/* Request path running through the tiers */}
          <svg aria-hidden="true" className="absolute left-[25%] top-4 h-[calc(100%-2rem)] w-2" viewBox="0 0 2 100" preserveAspectRatio="none">
            <line x1="1" y1="0" x2="1" y2="100" stroke="rgb(140 94 52 / 0.3)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <line x1="1" y1="0" x2="1" y2="100" stroke="#8c5e34" strokeWidth="3" pathLength={1} className="flow-dash" vectorEffect="non-scaling-stroke" />
          </svg>
          <svg aria-hidden="true" className="absolute left-[75%] top-4 h-[calc(100%-2rem)] w-2" viewBox="0 0 2 100" preserveAspectRatio="none">
            <line x1="1" y1="0" x2="1" y2="100" stroke="rgb(140 94 52 / 0.3)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <line x1="1" y1="0" x2="1" y2="100" stroke="#c79b69" strokeWidth="3" pathLength={1} className="flow-dash flow-dash--slow" vectorEffect="non-scaling-stroke" style={{ animationDelay: '-1.3s' }} />
          </svg>
          <Tier label="Entry">
            <Svc icon={<Globe size={13} />} name="App Service" note="Web app & portal hosting" hot />
            <Svc icon={<Server size={13} />} name="API Management" note="One gateway for APIs" />
          </Tier>
          <Tier label="Compute">
            <Svc icon={<Zap size={13} />} name="Azure Functions" note="Event-driven integration logic" hot />
            <Svc icon={<Activity size={13} />} name="Logic Apps" note="Workflow-based integrations" />
          </Tier>
          <Tier label="Data">
            <Svc icon={<Database size={13} />} name="Azure SQL Database" note="Relational application data" hot />
            <Svc icon={<Database size={13} />} name="Blob Storage" note="Documents & files" />
          </Tier>
        </div>
        <div className="grid gap-2 sm:content-start">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-subtle">Across every tier</p>
          <Svc icon={<ShieldCheck size={13} />} name="Entra ID" note="Sign-in & access" />
          <Svc icon={<KeyRound size={13} />} name="Key Vault" note="Secrets & keys" />
          <Svc icon={<Activity size={13} />} name="Azure Monitor" note="Logs & alerts" />
        </div>
      </div>
      <p className="mt-4 text-[0.72rem] text-subtle">Example pattern — each architecture is designed around your requirements, security needs and budget.</p>
    </div>
  )
}

export const productVisuals: Record<MsProductId, () => ReactNode> = {
  d365: () => <PipelineBoard />,
  bc: () => <BcDashboard />,
  apps: () => <AppBuilder />,
  bi: () => <BiReport />,
  automate: () => <FlowRunner />,
  azure: () => <AzureArchitecture />,
}

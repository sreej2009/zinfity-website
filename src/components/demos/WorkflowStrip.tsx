import { useRef } from 'react'
import { FileText, Mail, ShieldCheck, ClipboardList } from 'lucide-react'
import { aiWorkflow } from '@/content/service-extras'
import { useAutoCycle } from '@/hooks/useAutoCycle'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

const inputs = [
  { icon: Mail, label: 'Email', sample: '“Can you change my delivery to Friday?”' },
  { icon: FileText, label: 'PDF invoice', sample: 'Supplier invoice, 2 pages' },
  { icon: ClipboardList, label: 'Web form', sample: 'Quote request · 3 products' },
]

/**
 * AI & automation: a wide before → after flow. Unstructured inputs become
 * structured tasks; a human-review checkpoint sits before anything is acted on.
 * Illustrative only — not a live integration.
 */
export function WorkflowStrip() {
  const root = useRef<HTMLDivElement>(null)
  // One item is followed through the stages on a loop while the strip is in view.
  const { index: active, select } = useAutoCycle(aiWorkflow.length, root, 2400)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
        tl.from('[data-stage]', { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.18, ease: 'expo.out' })
          .fromTo('[data-progress]', { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 0.2)
          .from('[data-input]', { autoAlpha: 0, x: -14, duration: 0.6, stagger: 0.1 }, 0.3)
          .from('[data-task]', { autoAlpha: 0, x: 14, duration: 0.6, stagger: 0.1 }, 1.2)
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="relative mt-12">
      {/* Connector line behind the stages (desktop) */}
      <span aria-hidden="true" className="absolute left-0 right-0 top-[2.15rem] hidden h-px bg-line-strong lg:block" />
      <span aria-hidden="true" data-progress className="absolute left-0 right-0 top-[2.15rem] hidden h-px origin-left bg-gradient-to-r from-accent to-accent-ink lg:block" />
      {/* The item currently being processed (desktop) */}
      <span
        aria-hidden="true"
        className="absolute top-[2.15rem] z-20 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-ink shadow-[0_0_0_6px_rgb(199_155_105/0.3)] transition-[left] duration-[900ms] ease-[var(--ease-out-expo)] lg:block"
        style={{ left: `calc(${active} * (100% + 1.25rem) / ${aiWorkflow.length} + 2.15rem + 2.6rem)` }}
      />

      <ol className="relative grid gap-6 lg:grid-cols-4 lg:gap-5">
        {aiWorkflow.map((stage, i) => {
          const checkpoint = 'checkpoint' in stage && stage.checkpoint
          return (
            <li key={stage.id} data-stage className="flex flex-col" onMouseEnter={() => select(i)}>
              <span
                className={`relative z-10 grid h-[4.3rem] w-[4.3rem] place-items-center rounded-full border text-sm transition-[box-shadow,border-color,transform] duration-500 ${
                  checkpoint ? 'border-accent-ink bg-accent text-[#171717] shadow-[0_0_0_8px_rgb(199_155_105/0.2)]' : 'border-line-strong bg-canvas text-fg'
                } ${i === active ? 'scale-105 !border-fg' : ''}`}
              >
                {checkpoint ? <ShieldCheck size={22} aria-hidden="true" /> : <span className="font-mono text-[0.8rem]">0{i + 1}</span>}
              </span>
              <h3 className="mt-5 text-lg font-medium">{stage.name}</h3>
              <p className="mt-1.5 text-[0.92rem] leading-relaxed text-muted">{stage.body}</p>

              {/* Stage detail */}
              <div
                className={`mt-5 flex-1 rounded-xl border p-3 transition-[border-color,box-shadow,transform] duration-500 ${checkpoint ? 'border-accent-ink/50 bg-accent/10' : 'border-line bg-surface/60'} ${
                  i === active ? 'lg:-translate-y-1 !border-fg shadow-[0_24px_40px_-28px_rgb(58_42_29/0.55)]' : ''
                }`}
              >
                {stage.id === 'inputs' && (
                  <ul className="space-y-2">
                    {inputs.map((x) => (
                      <li key={x.label} data-input className="flex items-start gap-2 rounded-lg border border-dashed border-line-strong bg-canvas p-2 text-[0.78rem]">
                        <x.icon size={14} className="mt-0.5 shrink-0 text-muted" aria-hidden="true" />
                        <span>
                          <span className="font-medium">{x.label}</span>
                          <span className="block text-muted">{x.sample}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {stage.id === 'extract' && (
                  <dl className="space-y-1.5 font-mono text-[0.72rem]">
                    {[
                      ['type', 'Change request'],
                      ['customer', 'Matched'],
                      ['order', '#1042'],
                      ['new date', 'Friday'],
                      ['confidence', 'High'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 border-b border-line pb-1.5 last:border-0">
                        <dt className="text-subtle">{k}</dt>
                        <dd className="text-fg">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {stage.id === 'review' && (
                  <div className="text-[0.82rem]">
                    <p className="font-medium">Approval checkpoint</p>
                    <p className="mt-1 text-muted">Uncertain or sensitive items always wait for a person.</p>
                    <div className="mt-3 flex gap-2">
                      <span className={`relative rounded-full bg-fg px-3 py-1 text-[0.72rem] text-canvas ${active === i ? 'ring-4 ring-accent/40' : ''}`}>{active > i ? 'Approved ✓' : 'Approve'}</span>
                      <span className="rounded-full border border-line-strong px-3 py-1 text-[0.72rem]">Edit</span>
                    </div>
                  </div>
                )}
                {stage.id === 'route' && (
                  <ul className="space-y-2">
                    {[
                      ['Operations', 'Update delivery date'],
                      ['Finance', 'Post supplier invoice'],
                      ['Sales', 'Prepare quote'],
                    ].map(([team, task]) => (
                      <li key={task} data-task className="rounded-lg border border-line bg-canvas p-2 text-[0.78rem]">
                        <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-accent-ink">{team}</span>
                        <span className="mt-0.5 block">{task}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          )
        })}
      </ol>
      <p className="mt-6 text-[0.8rem] text-subtle">Illustrative example — not a live integration or a description of any client’s system.</p>
    </div>
  )
}

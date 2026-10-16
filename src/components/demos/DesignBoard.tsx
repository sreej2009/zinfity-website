import { useEffect, useRef, useState } from 'react'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

const notes = [
  { text: 'Users skip the onboarding tour', x: 2, y: 6, r: -4, c: '#fbe7b8' },
  { text: 'Find invoices faster', x: 20, y: 2, r: 3, c: '#f3d9c4' },
  { text: '“Where is my order?”', x: 6, y: 30, r: 2, c: '#e3ecd9' },
]
const flow = ['Sign in', 'Dashboard', 'Invoices', 'Pay']

/**
 * UI/UX hero: a light design board — research notes, a user flow, components
 * and a screen that switches between wireframe and finished design.
 */
export function DesignBoard() {
  const [final, setFinal] = useState(false)
  const touched = useRef(false)
  const root = useRef<HTMLDivElement>(null)

  // Reveal the finished design shortly after load, unless the visitor already interacted.
  useEffect(() => {
    const t = setTimeout(() => !touched.current && setFinal(true), 2200)
    return () => clearTimeout(t)
  }, [])
  const set = (v: boolean | ((f: boolean) => boolean)) => {
    touched.current = true
    setFinal(v)
  }

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap
          .timeline({ delay: 0.4 })
          .from('[data-note]', { autoAlpha: 0, y: -16, rotation: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.6)' })
          .from('[data-flow]', { autoAlpha: 0, x: -10, duration: 0.6, stagger: 0.08 }, 0.3)
          .from('[data-screen]', { autoAlpha: 0, y: 24, duration: 1, ease: 'expo.out' }, 0.5)
          .from('[data-comp]', { autoAlpha: 0, scale: 0.8, duration: 0.6, stagger: 0.06, ease: 'back.out(1.8)' }, 0.8)
      })
    },
    { scope: root },
  )

  const box = (cls: string) => (final ? cls : 'border-2 border-dashed border-[#171717]/30 bg-transparent')

  return (
    <div
      ref={root}
      className="relative aspect-[5/4] w-full overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-[0_40px_80px_-50px_rgb(58_42_29/0.35)]"
      style={{ backgroundImage: 'radial-gradient(rgb(23 23 23 / 0.08) 1px, transparent 1px)', backgroundSize: '18px 18px' }}
    >
      <span className="eyebrow absolute left-4 top-4 rounded-full border border-accent-ink/40 px-2.5 py-1 text-[0.58rem] text-accent-ink">Design canvas · illustrative</span>

      {/* Research notes */}
      {notes.map((n) => (
        <div
          key={n.text}
          data-note
          aria-hidden="true"
          className="absolute w-[24%] p-2 text-[0.62rem] leading-snug text-[#3b3935] shadow-[0_8px_14px_-8px_rgb(58_42_29/0.4)] sm:text-[0.7rem]"
          style={{ left: `${n.x}%`, top: `${n.y + 10}%`, transform: `rotate(${n.r}deg)`, background: n.c }}
        >
          {n.text}
        </div>
      ))}

      {/* User flow */}
      <ol aria-label="Example user flow" className="absolute bottom-[8%] left-[3%] flex items-center gap-1.5">
        {flow.map((f, i) => (
          <li key={f} data-flow className="flex items-center gap-1.5">
            <span className="rounded-md border border-[#171717]/20 bg-white px-2 py-1 text-[0.6rem] text-[#171717] sm:text-[0.68rem]">{f}</span>
            {i < flow.length - 1 && <span aria-hidden="true" className="text-[0.7rem] text-accent-ink">→</span>}
          </li>
        ))}
      </ol>

      {/* Components */}
      <div aria-hidden="true" className="absolute bottom-[24%] left-[4%] flex gap-2">
        <span data-comp className="rounded-full bg-[#171717] px-3 py-1 text-[0.6rem] text-white">Button</span>
        <span data-comp className="rounded-full border border-[#171717]/30 px-3 py-1 text-[0.6rem] text-[#171717]">Secondary</span>
        <span data-comp className="grid h-6 w-6 place-items-center rounded-md bg-[#c79b69] text-[0.6rem] text-[#171717]">Aa</span>
      </div>

      {/* Screen: wireframe ↔ finished design */}
      <div data-screen className="absolute right-[4%] top-[12%] w-[44%]">
        <button
          type="button"
          onClick={() => set((f) => !f)}
          onMouseEnter={() => set(false)}
          onMouseLeave={() => set(true)}
          aria-pressed={final}
          aria-label={final ? 'Showing finished design — press to show the wireframe' : 'Showing wireframe — press to show the finished design'}
          className="block w-full rounded-2xl border border-[#171717]/15 bg-white p-2.5 text-left shadow-[0_24px_40px_-24px_rgb(58_42_29/0.5)] transition-transform duration-500 hover:-translate-y-1"
        >
          <span aria-hidden="true" className="flex flex-col gap-2">
            <span className="flex items-center justify-between">
              <span className={`h-3 w-12 rounded ${box('bg-[#171717]')}`} />
              <span className={`h-4 w-4 rounded-full ${box('bg-[linear-gradient(135deg,#e8cfae,#a8754c)]')}`} />
            </span>
            <span className={`relative aspect-[16/10] overflow-hidden rounded-lg transition-colors duration-500 ${box('bg-[linear-gradient(135deg,#1c2433,#2a2018)]')}`}>
              {final && <span className="absolute bottom-2 left-2 text-[0.6rem] font-medium text-white">Invoices · 3 due</span>}
            </span>
            {[0, 1, 2].map((i) => (
              <span key={i} className={`flex items-center justify-between rounded-md px-2 py-1.5 ${final ? 'border border-[#171717]/10' : 'border-2 border-dashed border-[#171717]/20'}`}>
                <span className={`h-1.5 w-1/2 rounded-full ${final ? 'bg-[#171717]/60' : 'bg-[#171717]/15'}`} />
                <span className={`h-3 w-8 rounded-full ${final ? (i === 0 ? 'bg-[#c79b69]' : 'bg-[#171717]/10') : 'bg-[#171717]/10'}`} />
              </span>
            ))}
          </span>
        </button>
        <p className="mt-2 text-center text-[0.68rem] text-muted" aria-live="polite">
          {final ? 'Finished design' : 'Wireframe'} — hover or tap to compare
        </p>
      </div>
    </div>
  )
}

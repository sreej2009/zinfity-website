import { useRef, useState, type KeyboardEvent } from 'react'
import { services, servicePath } from '@/content/services'
import { ServiceStage } from '@/components/blocks/ServiceStage'
import { ArrowLink } from '@/components/blocks/ArrowLink'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { useScroll } from '@/lib/scroll'
import { ScrollTrigger, useGSAP } from '@/lib/gsap'

const pad = (n: number) => String(n).padStart(2, '0')
/** First sentence only — the full description belongs to /services. */
const teaser = (s: string) => s.split(/(?<=[.—])\s/)[0].replace(/\s—$/, '.')
/** Scroll distance per service, in viewport heights. */
const STEP_VH = 50

/**
 * Home: a compact discovery control. While scrolling, the section stays in place
 * and steps through every service in order, then releases to the next section.
 * Tabs remain clickable (they scroll to their step). With reduced motion it is a
 * normal, non-sticky section driven by clicks only.
 */
export function ServiceDiscovery() {
  const [active, setActive] = useState(0)
  const fills = useRef<(HTMLSpanElement | null)[]>([])
  const root = useRef<HTMLElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const trigger = useRef<ScrollTrigger | null>(null)
  const reduced = useReducedMotion()
  const scrolly = !reduced
  const { scrollToY } = useScroll()
  const current = services[active]
  const n = services.length

  useGSAP(
    () => {
      if (!scrolly) return
      trigger.current = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const p = self.progress
          const i = Math.min(n - 1, Math.floor(p * n))
          const within = p >= 1 ? 1 : (p * n) % 1
          setActive(i) // React skips the render when the index is unchanged
          // Progress fills are written directly (no re-render per scroll frame).
          fills.current.forEach((el, k) => {
            if (el) el.style.transform = `scaleX(${k < i ? 1 : k === i ? Math.max(0.08, within) : 0})`
          })
        },
      })
      return () => {
        trigger.current = null
      }
    },
    { scope: root, dependencies: [scrolly], revertOnUpdate: true },
  )

  /** Select a service: in scroll mode, scroll to that service's step. */
  const go = (i: number) => {
    const st = trigger.current
    if (scrolly && st) scrollToY(st.start + ((i + 0.5) / n) * (st.end - st.start))
    else setActive(i)
  }

  const onKey = (e: KeyboardEvent) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    let i = -1
    if (e.key === 'Home') i = 0
    else if (e.key === 'End') i = n - 1
    else if (dir) i = (active + dir + n) % n
    if (i < 0) return
    e.preventDefault()
    go(i)
    tabs.current[i]?.focus({ preventScroll: true })
  }

  return (
    <section
      ref={root}
      aria-labelledby="discover-title"
      className="relative"
      style={scrolly ? { height: `calc(100svh + ${n * STEP_VH}svh)` } : undefined}
    >
      <div className={scrolly ? 'sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-[calc(var(--header-h)*0.6)]' : 'py-24 lg:py-36'}>
        <div className="container-x">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 id="discover-title" className="max-w-xl text-[clamp(1.9rem,3.4vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.04em]">
              What can we build <span className="serif-accent metal-text">for you?</span>
            </h2>
            <ArrowLink to="/services">The full service directory</ArrowLink>
          </div>

          <div
            role="tablist"
            aria-label="Services"
            onKeyDown={onKey}
            className="-mx-[var(--gutter)] mt-8 flex snap-x scroll-px-[var(--gutter)] gap-2 overflow-x-auto pb-2 [scrollbar-width:none] before:block before:w-[calc(var(--gutter)-0.5rem)] before:shrink-0 after:block after:w-[calc(var(--gutter)-0.5rem)] after:shrink-0 lg:mx-0 lg:mt-12 lg:grid lg:grid-cols-8 lg:overflow-visible lg:before:hidden lg:after:hidden"
          >
            {services.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                id={`disc-tab-${s.id}`}
                role="tab"
                type="button"
                aria-selected={i === active}
                aria-controls="disc-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={(e) => {
                  go(i)
                  e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
                }}
                className={`group relative shrink-0 snap-start border-t border-line-strong pb-3 pr-6 pt-4 text-left transition-colors duration-500 lg:pr-3 ${
                  i === active ? 'text-fg' : 'text-muted hover:text-fg'
                }`}
              >
                {/* Progress fill: completed steps full, current step fills as you scroll. */}
                <span
                  ref={(el) => {
                    fills.current[i] = el
                  }}
                  aria-hidden="true"
                  className="absolute -top-px left-0 h-[2px] w-full origin-left bg-fg transition-transform duration-200 ease-out"
                  style={scrolly ? { transform: `scaleX(${i === 0 ? 0.08 : 0})` } : { transform: `scaleX(${i === active ? 1 : 0})` }}
                />
                <span className={`eyebrow block ${i === active ? 'text-accent-ink' : 'text-subtle'}`}>{pad(i + 1)}</span>
                <span className="mt-2 block whitespace-nowrap text-[0.98rem] tracking-[-0.01em] lg:whitespace-normal">{s.short}</span>
              </button>
            ))}
          </div>

          <div
            id="disc-panel"
            role="tabpanel"
            aria-labelledby={`disc-tab-${current.id}`}
            className="mt-6 grid items-end gap-6 lg:mt-10 lg:grid-cols-12 lg:gap-12"
          >
            <ServiceStage
              visual={current.visual}
              replayKey={current.id}
              glowShift={active}
              aspect="aspect-[16/10] max-h-[42svh] w-full lg:aspect-[21/9] lg:max-h-[48svh]"
              padding="p-5 lg:px-[16%]"
              className="lg:col-span-8"
              bottomLeft={current.short}
            />
            <div className="lg:col-span-4 lg:pb-2" aria-live="polite">
              <p className="text-title">{current.title}</p>
              <p className="mt-3 leading-relaxed text-muted lg:mt-4">{teaser(current.description)}</p>
              <ArrowLink to={servicePath(current)} className="mt-4 lg:mt-6">
                Explore {current.title}
              </ArrowLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

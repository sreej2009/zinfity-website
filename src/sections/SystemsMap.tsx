import { useCallback, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Boxes, Cable, Database, LayoutTemplate, Workflow, type LucideIcon } from 'lucide-react'
import { layers, solutions } from '@/content/solutions'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

const layerIcons: LucideIcon[] = [LayoutTemplate, Boxes, Cable, Database, Workflow]

const pad = (n: number) => String(n).padStart(2, '0')

type Props = { active: number; onChange: (i: number) => void }

/**
 * Architecture map: five layers drawn as a blueprint. The selected solution's
 * route is traced through the layers and a single signal travels it once.
 */
export function SystemsMap({ active, onChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef(new Map<string, HTMLElement>())
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const [d, setD] = useState('')
  const [size, setSize] = useState({ w: 0, h: 0 })
  const current = solutions[active]

  const measure = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    // Layout offsets (not getBoundingClientRect) so the scroll tilt doesn't skew the route.
    const offsetIn = (el: HTMLElement) => {
      let x = 0
      let y = 0
      let n: HTMLElement | null = el
      while (n && n !== map) {
        x += n.offsetLeft
        y += n.offsetTop
        n = n.offsetParent as HTMLElement | null
      }
      return [x, y]
    }
    const pts = current.path
      .map((name) => nodeRefs.current.get(name))
      .filter(Boolean)
      .map((el) => {
        const [x, y] = offsetIn(el!)
        return [x + el!.offsetWidth / 2, y + el!.offsetHeight / 2]
      })
    setSize({ w: map.offsetWidth, h: map.offsetHeight })
    // Orthogonal "circuit" routing between consecutive nodes.
    let path = ''
    pts.forEach(([x, y], i) => {
      if (i === 0) path += `M${x} ${y}`
      else {
        const [px, py] = pts[i - 1]
        const my = (py + y) / 2
        path += ` L${px} ${my} L${x} ${my} L${x} ${y}`
      }
    })
    setD(path)
  }, [current])

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (mapRef.current) ro.observe(mapRef.current)
    return () => ro.disconnect()
  }, [measure])

  // Depth: the map tilts back slightly and settles flat as it scrolls into view.
  useGSAP(
    () => {
      gsap.matchMedia().add(`${MOTION} and (min-width: 1024px)`, () => {
        gsap.fromTo(
          '[data-map-tilt]',
          { rotateX: 14, y: 30 },
          { rotateX: 0, y: 0, ease: 'none', scrollTrigger: { trigger: stage.current, start: 'top 95%', end: 'top 35%', scrub: 0.6 } },
        )
      })
    },
    { scope: stage },
  )

  const onKey = (e: KeyboardEvent) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const i = (active + dir + solutions.length) % solutions.length
    onChange(i)
    tabs.current[i]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label="Solution scenarios" onKeyDown={onKey} className="flex flex-wrap gap-2">
        {solutions.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              tabs.current[i] = el
            }}
            role="tab"
            type="button"
            id={`sol-tab-${s.id}`}
            aria-selected={i === active}
            aria-controls="sol-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => onChange(i)}
            className={`rounded-full border px-4 py-2 text-[0.88rem] transition-colors duration-300 ${
              i === active ? 'border-fg bg-fg text-canvas' : 'border-line-strong hover:border-fg'
            }`}
          >
            <span className="mr-2 font-mono text-[0.7rem] opacity-60">{pad(i + 1)}</span>
            {s.title}
          </button>
        ))}
      </div>

      <div ref={stage} className="relative mt-10" style={{ perspective: '1600px' }}>
      <div data-map-tilt className="relative" style={{ transformOrigin: '50% 100%' }}>
      {/* Stacked plates behind the map give it physical depth */}
      <div aria-hidden="true" className="absolute inset-x-6 -bottom-3 top-3 rounded-[1.5rem] border border-line bg-canvas-alt" />
      <div aria-hidden="true" className="absolute inset-x-12 -bottom-6 top-6 rounded-[1.5rem] border border-line bg-canvas-alt/60" />
      <div
        ref={mapRef}
        className="relative overflow-hidden rounded-[1.5rem] border border-line-strong bg-surface shadow-[0_40px_80px_-50px_rgb(58_42_29/0.55)]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(23 23 23 / 0.035) 1px, transparent 1px), linear-gradient(90deg, rgb(23 23 23 / 0.035) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-describedby="sol-panel"
      >
        {layers.map((layer, li) => (
          <div key={layer.id} className={`relative grid gap-4 px-5 py-6 sm:px-8 lg:grid-cols-12 lg:items-center ${li ? 'border-t border-dashed border-line-strong' : ''}`}>
            <div className="flex items-start gap-3 lg:col-span-3">
              {(() => {
                const Icon = layerIcons[li]
                return (
                  <span aria-hidden="true" className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-panel text-accent">
                    <Icon size={16} strokeWidth={1.6} />
                  </span>
                )
              })()}
              <div>
                <p className="eyebrow text-accent-ink">L{li + 1}</p>
                <p className="mt-1 font-medium tracking-[-0.01em]">{layer.name}</p>
                <p className="text-[0.8rem] text-subtle">{layer.note}</p>
              </div>
            </div>
            <ul className="relative z-10 flex flex-wrap justify-around gap-2 lg:col-span-9">
              {layer.nodes.map((n) => {
                const on = current.path.includes(n)
                const step = current.path.indexOf(n)
                return (
                  <li
                    key={n}
                    ref={(el) => {
                      if (el) nodeRefs.current.set(n, el)
                    }}
                    className={`relative rounded-lg border px-3 py-2 text-[0.84rem] transition-all duration-500 ${
                      on ? '-translate-y-0.5 border-fg bg-fg text-canvas shadow-[0_14px_30px_-10px_rgb(23_23_23/0.55)]' : 'border-line-strong bg-canvas text-muted'
                    }`}
                  >
                    {on && (
                      <span aria-hidden="true" className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-accent font-mono text-[0.6rem] text-[#171717]">
                        {step + 1}
                      </span>
                    )}
                    {n}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {size.w > 0 && (
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${size.w} ${size.h}`}>
            <path key={`${active}-trace`} d={d} fill="none" stroke="#8c5e34" strokeWidth={1.5} strokeDasharray="4 5" className="fade-in" />
            <path key={`${active}-draw`} d={d} fill="none" stroke="#c79b69" strokeWidth={2.5} pathLength={1} className="draw" style={{ animationDuration: '1.8s' }} />
          </svg>
        )}
        {/* Data moving continuously along the route, layer to layer */}
        {d &&
          [0, 1, 2].map((k) => (
            <span
              key={`${active}-signal-${k}`}
              aria-hidden="true"
              className="signal-loop pointer-events-none absolute left-0 top-0 z-20 h-3 w-3 rounded-full bg-accent shadow-[0_0_0_6px_rgb(199_155_105/0.25)]"
              style={{ offsetPath: `path('${d}')`, animationDelay: `${k * 1.13}s` }}
            />
          ))}
      </div>
      </div>
      </div>
    </div>
  )
}

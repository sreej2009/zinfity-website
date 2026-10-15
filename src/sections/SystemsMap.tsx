import { useCallback, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { layers, solutions } from '@/content/solutions'

const pad = (n: number) => String(n).padStart(2, '0')

type Props = { active: number; onChange: (i: number) => void }

/**
 * Architecture map: five layers drawn as a blueprint. The selected solution's
 * route is traced through the layers and a single signal travels it once.
 */
export function SystemsMap({ active, onChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef(new Map<string, HTMLElement>())
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const [d, setD] = useState('')
  const [size, setSize] = useState({ w: 0, h: 0 })
  const current = solutions[active]

  const measure = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    const box = map.getBoundingClientRect()
    const pts = current.path
      .map((name) => nodeRefs.current.get(name))
      .filter(Boolean)
      .map((el) => {
        const r = el!.getBoundingClientRect()
        return [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2]
      })
    setSize({ w: box.width, h: box.height })
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

      <div
        ref={mapRef}
        className="relative mt-10 overflow-hidden rounded-[1.5rem] border border-line-strong bg-surface"
        style={{
          backgroundImage:
            'linear-gradient(rgb(23 23 23 / 0.035) 1px, transparent 1px), linear-gradient(90deg, rgb(23 23 23 / 0.035) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-describedby="sol-panel"
      >
        {layers.map((layer, li) => (
          <div key={layer.id} className={`relative grid gap-4 px-5 py-6 sm:px-8 lg:grid-cols-12 lg:items-center ${li ? 'border-t border-dashed border-line-strong' : ''}`}>
            <div className="lg:col-span-3">
              <p className="eyebrow text-accent-ink">L{li + 1}</p>
              <p className="mt-1 font-medium tracking-[-0.01em]">{layer.name}</p>
              <p className="text-[0.8rem] text-subtle">{layer.note}</p>
            </div>
            <ul className="relative z-10 flex flex-wrap justify-around gap-2 lg:col-span-9">
              {layer.nodes.map((n) => {
                const on = current.path.includes(n)
                return (
                  <li
                    key={n}
                    ref={(el) => {
                      if (el) nodeRefs.current.set(n, el)
                    }}
                    className={`rounded-lg border px-3 py-2 text-[0.84rem] transition-all duration-500 ${
                      on ? 'border-fg bg-fg text-canvas shadow-[0_10px_30px_-10px_rgb(23_23_23/0.5)]' : 'border-line-strong bg-canvas text-muted'
                    }`}
                  >
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
        {d && (
          <span
            key={`${active}-signal`}
            aria-hidden="true"
            className="signal pointer-events-none absolute left-0 top-0 z-20 h-3 w-3 rounded-full bg-accent shadow-[0_0_0_6px_rgb(199_155_105/0.25)]"
            style={{ offsetPath: `path('${d}')` }}
          />
        )}
      </div>
    </div>
  )
}

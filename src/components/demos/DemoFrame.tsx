import type { ReactNode } from 'react'

/** Dark showcase frame for the interactive service demonstrations. */
export function DemoFrame({
  title,
  controls,
  children,
  className = '',
  caption,
}: {
  title: string
  controls?: ReactNode
  children: ReactNode
  className?: string
  caption?: ReactNode
}) {
  return (
    <figure className={`theme-dark relative overflow-hidden rounded-[1.5rem] bg-canvas shadow-[0_40px_90px_-40px_rgb(17_18_22/0.6)] ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(rgb(237 233 227 / 0.035) 1px, transparent 1px), linear-gradient(90deg, rgb(237 233 227 / 0.035) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
        <figcaption className="flex items-center gap-3">
          <span className="eyebrow rounded-full border border-accent/50 px-2.5 py-1 text-[0.58rem] text-accent">Interactive</span>
          <span className="text-[0.92rem] text-fg">{title}</span>
        </figcaption>
        {controls && <div className="flex flex-wrap gap-2">{controls}</div>}
      </div>
      <div className="relative">{children}</div>
      {caption && <div className="relative border-t border-line px-5 py-3 text-[0.82rem] text-muted sm:px-6">{caption}</div>}
    </figure>
  )
}

/** Segmented control button used by the demos. */
export function Seg({ on, onClick, children, label }: { on: boolean; onClick: () => void; children: ReactNode; label?: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.82rem] transition-colors duration-300 ${
        on ? 'border-fg bg-fg text-canvas' : 'border-line-strong text-fg hover:border-fg'
      }`}
    >
      {children}
    </button>
  )
}

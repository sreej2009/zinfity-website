import type { ReactNode } from 'react'
import type { ServiceVisualKey } from '@/content/services'
import { ServiceVisual } from '@/visuals/ServiceVisual'

type Props = {
  visual: ServiceVisualKey
  /** Changing the key replays the line drawing. */
  replayKey?: string
  topLeft?: ReactNode
  topRight?: ReactNode
  bottomLeft?: ReactNode
  className?: string
  aspect?: string
  padding?: string
  glowShift?: number
}

/** Dark showcase panel framing a service illustration. Always dark, on any page theme. */
export function ServiceStage({
  visual,
  replayKey,
  topLeft,
  topRight,
  bottomLeft,
  className = '',
  aspect = 'aspect-[4/3]',
  padding = 'p-8',
  glowShift = 0,
}: Props) {
  return (
    <div
      className={`theme-dark relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-surface via-canvas to-canvas-alt shadow-[0_30px_70px_-30px_rgb(17_18_22/0.55)] ${aspect} ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(rgb(237 233 227 / 0.04) 1px, transparent 1px), linear-gradient(90deg, rgb(237 233 227 / 0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(80% 80% at 50% 50%, #000, transparent)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl transition-transform duration-1000"
        style={{ transform: `translate(${(glowShift % 3) * -30}px, ${(glowShift % 4) * 30}px)` }}
      />
      <ServiceVisual key={replayKey ?? visual} visual={visual} className={`absolute inset-0 h-full w-full ${padding}`} />
      {(topLeft || topRight) && (
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
          <span className="eyebrow text-muted">{topLeft}</span>
          {topRight}
        </div>
      )}
      {bottomLeft && <div className="eyebrow absolute bottom-5 left-5 text-fg">{bottomLeft}</div>}
    </div>
  )
}

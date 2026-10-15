import type { ReactNode } from 'react'

/**
 * Gentle, CSS-only horizontal marquee. The list is rendered twice (second copy
 * hidden from assistive tech) so the loop is seamless. Pauses on hover/focus;
 * with reduced motion it becomes a static, wrapping row.
 */
export function LogoMarquee({ children, label, duration = 45 }: { children: ReactNode; label: string; duration?: number }) {
  return (
    <div className="logo-marquee group/marquee relative overflow-hidden" style={{ ['--marquee-duration' as string]: `${duration}s` }}>
      <div className="logo-marquee__track flex w-max">
        <ul aria-label={label} className="flex shrink-0 items-center">
          {children}
        </ul>
        <ul aria-hidden="true" className="logo-marquee__copy flex shrink-0 items-center">
          {children}
        </ul>
      </div>
    </div>
  )
}

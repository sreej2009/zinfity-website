import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'

/** Understated text link with a drawn underline and arrow. */
export function ArrowLink({ to, children, className = '', label }: { to: string; children: ReactNode; className?: string; label?: string }) {
  return (
    <Link to={to} aria-label={label} className={`group inline-flex items-center gap-2 text-[0.94rem] text-fg ${className}`}>
      <span className="link-draw pb-0.5">{children}</span>
      <ArrowUpRight
        size={16}
        aria-hidden="true"
        className="text-accent-ink transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  )
}

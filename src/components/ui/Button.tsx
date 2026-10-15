import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { ArrowRight } from 'lucide-react'

type Common = {
  variant?: 'primary' | 'ghost'
  size?: 'md' | 'sm'
  icon?: boolean
  children: ReactNode
  className?: string
}

const cls = ({ variant = 'primary', size = 'md', className = '' }: Omit<Common, 'children'>) =>
  ['btn', variant === 'primary' ? 'btn-primary' : 'btn-ghost', size === 'sm' ? 'btn-sm' : '', className]
    .filter(Boolean)
    .join(' ')

function Inner({ children, icon = true }: Pick<Common, 'children' | 'icon'>) {
  return (
    <>
      <span>{children}</span>
      {icon && (
        <span className="btn-icon" aria-hidden="true">
          <ArrowRight size={14} strokeWidth={1.75} />
        </span>
      )}
    </>
  )
}

export function Button(props: Common & ComponentPropsWithoutRef<'button'>) {
  const { variant, size, icon, children, className, type = 'button', ...rest } = props
  return (
    <button type={type} className={cls({ variant, size, className })} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  )
}

/** Internal route link styled as a button. */
export function ButtonLink(props: Common & Omit<LinkProps, 'className' | 'children'>) {
  const { variant, size, icon, children, className, ...rest } = props
  return (
    <Link className={cls({ variant, size, className })} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </Link>
  )
}

/** External link styled as a button. */
export function ButtonAnchor(props: Common & ComponentPropsWithoutRef<'a'>) {
  const { variant, size, icon, children, className, ...rest } = props
  return (
    <a className={cls({ variant, size, className })} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </a>
  )
}

import { Link } from 'react-router'
import { Seo } from '@/components/Seo'
import { ButtonLink } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'

const shortcuts = [
  { to: '/services', label: 'Services' },
  { to: '/work', label: 'Work' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[85svh] items-center gap-12 pb-20 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12">
      <Seo title="Page not found" description="The page you were looking for could not be found." noindex />
      <div className="lg:col-span-7">
        <p className="eyebrow text-accent-ink">Error 404</p>
        <h1 className="text-display mt-6 text-balance">
          This page <span className="serif-accent metal-text">moved</span> on.
        </h1>
        <p className="text-lede mt-8 max-w-lg text-muted">The link may be outdated, or the page may have been renamed. These might help:</p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {shortcuts.map((s) => (
            <li key={s.to}>
              <Link to={s.to} className="chip transition-colors hover:border-fg">
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
        <ButtonLink to="/" className="mt-10">
          Back to home
        </ButtonLink>
      </div>
      <div className="lg:col-span-5">
        <div className="theme-dark grid aspect-square place-items-center rounded-[1.75rem] bg-canvas">
          <Logo variant="mark" alt="" className="w-1/2 opacity-90" />
        </div>
      </div>
    </section>
  )
}

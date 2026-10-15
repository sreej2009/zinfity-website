import { Link } from 'react-router'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { site } from '@/config/site'
import { services, servicePath } from '@/content/services'
import { Logo } from '@/components/ui/Logo'
import { useScroll } from '@/lib/scroll'

const company = [
  { to: '/about', label: 'About' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/work', label: 'Work' },
  { to: '/blog', label: 'Blog' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
]

export function Footer() {
  const { scrollTo } = useScroll()
  const year = new Date().getFullYear()

  return (
    <footer className="theme-dark relative overflow-hidden bg-canvas pt-8 lg:pt-12">
      <div aria-hidden="true" className="pointer-events-none absolute -top-48 left-1/3 h-[30rem] w-[50rem] rounded-full bg-accent/10 blur-3xl" />
      <div className="container-x relative">
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link to="/" aria-label={`${site.name} — home`} className="inline-block">
              {/* The lockup carries the tagline, so the footer needs no separate tagline band. */}
              <Logo variant="lockupOnDark" className="h-auto w-56 sm:w-64" alt={`${site.name} — ${site.tagline}`} />
            </Link>
            {(site.contact.email || site.contact.phone || site.contact.location) && (
              <address className="mt-8 space-y-2 text-[0.92rem] not-italic text-muted">
                {site.contact.email && (
                  <a href={`mailto:${site.contact.email}`} className="link-draw block w-fit text-fg">
                    {site.contact.email}
                  </a>
                )}
                {site.contact.phone && (
                  <a href={`tel:${site.contact.phone.replace(/[^\d+]/g, '')}`} className="link-draw block w-fit text-fg">
                    {site.contact.phone}
                  </a>
                )}
                {site.contact.location && <p>{site.contact.location}</p>}
              </address>
            )}
          </div>

          <nav aria-label="Company" className="lg:col-span-2 lg:col-start-6">
            <p className="eyebrow mb-6 text-subtle">Company</p>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="link-draw text-fg/85 hover:text-fg">
                  Home
                </Link>
              </li>
              {company.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="link-draw text-fg/85 hover:text-fg">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services" className="lg:col-span-3">
            <p className="eyebrow mb-6 text-subtle">Services</p>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.id}>
                  <Link to={servicePath(s)} className="link-draw text-fg/85 hover:text-fg">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {site.socials.length > 0 && (
            <div className="lg:col-span-2">
              <p className="eyebrow mb-6 text-subtle">Follow</p>
              <ul className="space-y-3">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-fg/85 hover:text-fg">
                      <span className="link-draw">{s.label}</span>
                      <ArrowUpRight size={14} aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-6 border-t border-line py-8 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => scrollTo('top')}
            className="group inline-flex items-center gap-3 self-start text-muted transition-colors hover:text-fg sm:self-auto"
          >
            Back to top
            <span className="grid h-9 w-9 place-items-center rounded-full border border-line-strong transition-colors group-hover:border-fg">
              <ArrowUp size={14} aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-0.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}

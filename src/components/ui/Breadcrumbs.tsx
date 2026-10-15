import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { site } from '@/config/site'

export type Crumb = { label: string; to?: string }

/** Visual breadcrumbs plus BreadcrumbList structured data. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: 'Home', to: '/' }, ...items]
  const base = site.url?.replace(/\/+$/, '')
  const jsonLd = base
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: all.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.label,
          ...(c.to ? { item: `${base}${c.to}` } : {}),
        })),
      }
    : null

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.82rem] text-muted">
        {all.map((c, i) => {
          const last = i === all.length - 1
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.to && !last ? (
                <Link to={c.to} className="link-draw hover:text-fg">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={last ? 'text-fg' : undefined}>
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight size={13} aria-hidden="true" className="text-subtle" />}
            </li>
          )
        })}
      </ol>
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </nav>
  )
}

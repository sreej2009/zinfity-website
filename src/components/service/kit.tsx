import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Plus } from 'lucide-react'
import { Seo } from '@/components/Seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ProjectArt } from '@/visuals/ProjectArt'
import { serviceById, servicePath, services } from '@/content/services'
import { serviceDetails } from '@/content/service-details'
import { projectById, projectPath } from '@/content/work'
import { contactHref } from '@/lib/enquiry'
import { useReveal } from '@/hooks/useReveal'
import { useHeadlineReveal } from '@/hooks/useHeadlineReveal'

/**
 * Small building blocks shared by the eight service pages. Each page composes
 * its own layout and interactive demonstration; only these primitives are shared.
 */

const pad = (n: number) => String(n).padStart(2, '0')

export function useServicePage(id: string) {
  const service = serviceById(id)!
  const detail = serviceDetails[id]
  const index = services.indexOf(service)
  const enquire = contactHref({ service: service.title })
  const project = detail.relatedProject ? projectById(detail.relatedProject) : undefined
  const root = useRef<HTMLDivElement>(null)
  const head = useRef<HTMLHeadingElement>(null)
  useReveal(root, [id])
  useHeadlineReveal(head, { deps: [id] })
  return { service, detail, index, enquire, project, root, head }
}

export function ServiceSeo({ id }: { id: string }) {
  const s = serviceById(id)!
  const d = serviceDetails[id]
  return <Seo title={s.title} description={d.intro.length > 158 ? d.intro.slice(0, 155).replace(/\s+\S*$/, '') + '…' : d.intro} />
}

/** Breadcrumbs + "Service 0X / 08" label. */
export function ServiceMeta({ id }: { id: string }) {
  const s = serviceById(id)!
  return (
    <>
      <Breadcrumbs items={[{ label: 'Services', to: '/services' }, { label: s.title }]} />
      <p className="eyebrow text-muted">
        <span className="text-accent-ink">Service {pad(services.indexOf(s) + 1)}</span> / {pad(services.length)} · {s.short}
      </p>
    </>
  )
}

/** Headline with the accent word set in the serif. */
export function Headline({ parts }: { parts: [string, string, string] }) {
  return (
    <>
      {parts[0]} <span className="serif-accent metal-text">{parts[1]}</span> {parts[2]}
    </>
  )
}

export function Faq({ items, className = '' }: { items: { q: string; a: string }[]; className?: string }) {
  return (
    <div className={className}>
      {items.map((f) => (
        <details key={f.q} className="group border-t border-line py-6 last:border-b">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-medium tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
            {f.q}
            <Plus size={18} aria-hidden="true" className="mt-1 shrink-0 text-accent-ink transition-transform duration-500 group-open:rotate-45" />
          </summary>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  )
}

export function TechList({ groups, className = '' }: { groups: { label: string; items: string[] }[]; className?: string }) {
  return (
    <div className={className}>
      <dl className="space-y-5">
        {groups.map((g) => (
          <div key={g.label} className="grid gap-2 sm:grid-cols-[9rem_1fr]">
            <dt className="eyebrow pt-1 text-subtle">{g.label}</dt>
            <dd className="flex flex-wrap gap-x-4 gap-y-1">
              {g.items.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-[0.85rem] text-subtle">Typical tools — the final stack is chosen per project.</p>
    </div>
  )
}

/** Compact project teaser with dark artwork. */
export function ProjectTeaser({ id, label = 'Related concept study' }: { id?: string; label?: string }) {
  const p = id ? projectById(id) : undefined
  if (!p) return null
  return (
    <Link to={projectPath(p)} className="group grid items-center gap-6 sm:grid-cols-[minmax(0,15rem)_1fr]" data-reveal>
      <div className="@container theme-dark relative aspect-[16/10] overflow-hidden rounded-xl bg-canvas">
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105">
          <ProjectArt art={p.art} />
        </div>
      </div>
      <div>
        <p className="eyebrow text-subtle">{label}</p>
        <p className="mt-2 text-xl font-medium tracking-[-0.02em]">
          <span className="link-draw">{p.title}</span> →
        </p>
        <p className="mt-1 text-[0.92rem] text-muted">{p.category}</p>
      </div>
    </Link>
  )
}

export function RelatedServices({ ids }: { ids: string[] }) {
  return (
    <p className="text-[0.98rem] text-muted">
      Often combined with{' '}
      {ids.map((id, i) => {
        const s = serviceById(id)!
        return (
          <span key={id}>
            <Link to={servicePath(s)} className="link-draw text-fg">
              {s.title}
            </Link>
            {i < ids.length - 2 ? ', ' : i === ids.length - 2 ? ' and ' : '.'}
          </span>
        )
      })}
    </p>
  )
}

/** Section wrapper with a small label column, used sparingly with different layouts. */
export function Block({ label, title, children, className = '', id }: { label: string; title?: ReactNode; children: ReactNode; className?: string; id?: string }) {
  return (
    <section aria-label={typeof title === 'string' ? title : label} id={id} className={`py-20 lg:py-28 ${className}`}>
      <div className="container-x">
        <p className="eyebrow text-muted">{label}</p>
        {title && <h2 className="mt-4 max-w-3xl text-[clamp(1.9rem,3.4vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.04em]">{title}</h2>}
        <div className={title ? 'mt-12' : 'mt-8'}>{children}</div>
      </div>
    </section>
  )
}

export { pad }

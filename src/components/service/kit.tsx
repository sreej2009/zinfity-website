import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight, CalendarDays, Layers, Plus, Repeat, Target, Wrench, type LucideIcon } from 'lucide-react'
import { Seo } from '@/components/Seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ProjectArt } from '@/visuals/ProjectArt'
import { serviceById, servicePath, services } from '@/content/services'
import { serviceDetails } from '@/content/service-details'
import { projectById, projectPath } from '@/content/work'
import { contactHref } from '@/lib/enquiry'
import { firstSteps } from '@/content/service-extras'
import { useReveal } from '@/hooks/useReveal'
import { useHeadlineReveal } from '@/hooks/useHeadlineReveal'

/**
 * Small building blocks shared by the service pages. Each page composes
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
    <div className={`rounded-3xl border border-line bg-surface p-6 sm:p-7 ${className}`}>
      <p className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-accent-ink">
        <Wrench size={13} aria-hidden="true" /> Toolbox
      </p>
      <dl className="mt-5 divide-y divide-line">
        {groups.map((g) => (
          <div key={g.label} className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[8.5rem_1fr] sm:items-start">
            <dt className="eyebrow pt-1.5 text-subtle">{g.label}</dt>
            <dd className="flex flex-wrap gap-2">
              {g.items.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-canvas px-3 py-1 text-[0.88rem] transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent-ink"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {t}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 border-t border-line pt-4 text-[0.82rem] text-subtle">Typical tools — the final stack is chosen per project.</p>
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

const engagementModels: { name: string; body: string; icon: LucideIcon }[] = [
  { name: 'Defined project', body: 'Scope, budget and plan agreed up front.', icon: Target },
  { name: 'Phased product build', body: 'Delivered in stages, adjusted as you learn.', icon: Layers },
  { name: 'Ongoing partnership', body: 'A continuing team for improvements and support.', icon: Repeat },
]

/** "How we'd start": the first step for this service, then the ways to continue. */
export function HowWeStart({ id, tone = 'light' }: { id: string; tone?: 'light' | 'alt' }) {
  const s = serviceById(id)!
  const step = firstSteps[id]
  return (
    <section aria-labelledby={`${id}-start`} className={`border-t border-line py-20 lg:py-24 ${tone === 'alt' ? 'bg-canvas-alt' : ''}`}>
      <div className="container-x grid gap-8 lg:grid-cols-12 lg:items-stretch">
        <div className="relative overflow-hidden rounded-3xl bg-[#14161b] p-7 text-[#ede9e3] sm:p-9 lg:col-span-5" data-reveal>
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgb(199_155_105/0.35),transparent)]" />
          <p className="eyebrow text-accent">How we’d start</p>
          <h2 id={`${id}-start`} className="mt-4 text-[clamp(1.6rem,2.6vw,2.3rem)] font-medium leading-tight tracking-[-0.03em]">
            {step.title}
          </h2>
          <p className="mt-3 max-w-md leading-relaxed text-[#ede9e3]/70">{step.body}</p>
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#ede9e3]/20 px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent">
            <CalendarDays size={13} aria-hidden="true" /> {step.duration}
          </p>
          <div aria-hidden="true" className="mt-6 flex items-end gap-1.5">
            {Array.from({ length: 10 }, (_, k) => (
              <span key={k} className="h-2 flex-1 rounded-full" style={{ background: k < 2 ? 'linear-gradient(90deg,#e8cfae,#c79b69)' : 'rgb(237 233 227 / 0.12)' }} />
            ))}
          </div>
        </div>
        <div className="flex flex-col lg:col-span-7" data-reveal>
          <p className="text-[0.92rem] text-muted">Then continue in the way that suits you:</p>
          <ul className="mt-4 grid flex-1 gap-3 sm:grid-cols-3">
            {engagementModels.map((m, i) => (
              <li key={m.name}>
                <Link
                  to={contactHref({ service: s.title, engagement: m.name })}
                  className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-5 transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-fg hover:shadow-[0_30px_50px_-36px_rgb(58_42_29/0.6)] sm:p-6"
                >
                  <span className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-canvas-alt text-accent-ink transition-colors duration-500 group-hover:bg-fg group-hover:text-accent">
                      <m.icon size={17} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[0.68rem] text-subtle">0{i + 1}</span>
                  </span>
                  <span className="mt-8 text-[1.08rem] font-medium tracking-[-0.015em]">{m.name}</span>
                  <span className="mt-1.5 text-[0.9rem] leading-relaxed text-muted">{m.body}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.85rem] text-accent-ink">
                    Start here <ArrowRight size={13} aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

type Pair = { title: string; body: string }

/** Benefits in one of several layouts, so pages don’t repeat the same composition. */
export function Benefits({
  items,
  variant = 'columns',
  title = 'What changes for your business',
  icons = [],
}: {
  items: Pair[]
  variant?: 'columns' | 'numbered' | 'rail' | 'icons' | 'spotlight'
  title?: string
  icons?: LucideIcon[]
}) {
  return (
    <section aria-label="Business benefits" className={variant === 'spotlight' ? 'theme-dark bg-canvas py-20 lg:py-28' : 'container-x py-20 lg:py-24'}>
      <div className={variant === 'spotlight' ? 'container-x' : ''}>
      <p className={`eyebrow ${variant === 'spotlight' ? 'text-accent' : 'text-muted'}`}>Business benefits</p>
      <h2 className="mt-4 max-w-2xl text-[clamp(1.8rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">{title}</h2>
      {variant === 'spotlight' && (
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((b, i) => {
            const Icon = icons[i]
            return (
              <li key={b.title} data-reveal className="group relative overflow-hidden rounded-3xl border border-line bg-[#1a1c21] p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-accent/50 sm:p-8">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,rgb(199_155_105/0.18),transparent)] transition-transform duration-700 group-hover:scale-125" />
                <span className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-accent/40 bg-accent/10 text-accent">
                    {Icon && <Icon size={20} strokeWidth={1.5} aria-hidden="true" />}
                  </span>
                  <span aria-hidden="true" className="font-serif text-5xl italic leading-none text-accent/40">{i + 1}</span>
                </span>
                <h3 className="mt-10 text-xl font-medium tracking-[-0.02em]">{b.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{b.body}</p>
              </li>
            )
          })}
        </ul>
      )}
      {variant === 'icons' && (
        <ul className="mt-10 grid gap-5 md:grid-cols-3" style={{ perspective: '1200px' }}>
          {items.map((b, i) => {
            const Icon = icons[i]
            return (
              <li
                key={b.title}
                data-reveal
                className="group rounded-2xl border border-line bg-surface p-7 transition-[transform,box-shadow,border-color] duration-700 ease-[var(--ease-out-expo)] hover:border-accent/60 hover:shadow-[0_30px_50px_-30px_rgb(140_94_52/0.45)] hover:[transform:translateY(-6px)_rotateX(4deg)] sm:p-8"
              >
                <span className="relative grid h-16 w-16 place-items-center" aria-hidden="true">
                  <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full -rotate-90">
                    <circle cx="32" cy="32" r="30" fill="none" stroke="var(--color-line)" strokeWidth="1.5" />
                    <circle cx="32" cy="32" r="30" fill="none" stroke="var(--color-accent-ink)" strokeWidth="1.5" pathLength={1} className="draw" style={{ ['--d' as string]: i * 3 }} />
                  </svg>
                  {Icon && <Icon size={24} strokeWidth={1.4} className="text-fg transition-transform duration-700 group-hover:scale-110" />}
                </span>
                <h3 className="mt-7 text-lg font-medium tracking-[-0.015em]">{b.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{b.body}</p>
              </li>
            )
          })}
        </ul>
      )}
      {variant === 'columns' && (
        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {items.map((b, i) => (
            <li key={b.title} data-reveal className="bg-canvas p-7 sm:p-8">
              <p className="metal-text text-3xl font-medium tracking-[-0.04em]">{pad(i + 1)}</p>
              <h3 className="mt-8 text-lg font-medium tracking-[-0.015em]">{b.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{b.body}</p>
            </li>
          ))}
        </ul>
      )}
      {variant === 'numbered' && (
        <ol className="mt-10 grid gap-10 md:grid-cols-3">
          {items.map((b, i) => (
            <li key={b.title} data-reveal className="border-t-2 border-fg pt-5">
              <span className="font-serif text-5xl italic leading-none text-accent-ink">{i + 1}</span>
              <h3 className="mt-5 text-lg font-medium">{b.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{b.body}</p>
            </li>
          ))}
        </ol>
      )}
      {variant === 'rail' && (
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {items.map((b) => (
            <li key={b.title} data-reveal className="grid gap-2 py-6 md:grid-cols-12 md:items-baseline">
              <h3 className="text-xl font-medium tracking-[-0.02em] md:col-span-4">{b.title}</h3>
              <p className="leading-relaxed text-muted md:col-span-8">{b.body}</p>
            </li>
          ))}
        </ul>
      )}
      </div>
    </section>
  )
}

/** Capability groups, laid out as columns or as a compact matrix. */
export function Capabilities({ groups, variant = 'columns', title = 'What we deliver' }: { groups: { group: string; items: string[] }[]; variant?: 'columns' | 'matrix'; title?: string }) {
  return (
    <section aria-label="Capabilities" className="container-x py-20 lg:py-24">
      <p className="eyebrow text-muted">Capabilities</p>
      <h2 className="mt-4 max-w-2xl text-[clamp(1.8rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">{title}</h2>
      {variant === 'columns' ? (
        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          {groups.map((c) => (
            <div key={c.group} data-reveal>
              <h3 className="eyebrow text-accent-ink">{c.group}</h3>
              <ul className="mt-4 border-t border-line">
                {c.items.map((x) => (
                  <li key={x} className="border-b border-line py-3">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <dl className="mt-10 grid border-t border-fg">
          {groups.map((c) => (
            <div key={c.group} data-reveal className="grid gap-3 border-b border-line py-5 md:grid-cols-12 md:items-baseline">
              <dt className="text-lg font-medium md:col-span-3">{c.group}</dt>
              <dd className="flex flex-wrap gap-2 md:col-span-9">
                {c.items.map((x) => (
                  <span key={x} className="chip">
                    {x}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}

export { pad }

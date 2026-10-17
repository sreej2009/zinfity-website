import { useRef } from 'react'
import { Link, useParams } from 'react-router'
import { AlertTriangle } from 'lucide-react'
import { Seo } from '@/components/Seo'
import { jobMeta } from '@/content/seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ButtonAnchor } from '@/components/ui/Button'
import { ApplicationForm } from '@/components/forms/ApplicationForm'
import { jobBySlug } from '@/content/careers'
import { useReveal } from '@/hooks/useReveal'
import NotFound from './NotFound'

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div data-reveal>
      <h2 className="text-title">{title}</h2>
      <ul className="mt-8 space-y-4">
        {items.map((it) => (
          <li key={it} className="flex gap-4 border-b border-line pb-4 leading-relaxed">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function JobPage() {
  const { slug = '' } = useParams()
  const job = jobBySlug(slug)
  const root = useRef<HTMLDivElement>(null)
  useReveal(root, [slug])
  if (!job)
    return (
      <div ref={root}>
        <NotFound />
      </div>
    )

  const facts = [
    { label: 'Department', value: job.department },
    { label: 'Employment type', value: job.employmentType ?? 'To be confirmed' },
    { label: 'Location', value: job.location ?? 'To be confirmed' },
  ]

  return (
    <div ref={root}>
      <Seo {...jobMeta(job)} />
      <header className="container-x pb-16 pt-[calc(var(--header-h)+3rem)] lg:pt-36">
        <Breadcrumbs items={[{ label: 'Careers', to: '/careers' }, { label: job.title }]} />
        <p className="eyebrow text-muted">Careers · {job.department}</p>
        <h1 className="mt-5 max-w-4xl text-[clamp(2.4rem,5vw,4.8rem)] font-medium leading-[0.98] tracking-[-0.045em]">{job.title}</h1>
        <p className="text-lede mt-6 max-w-2xl text-muted">{job.about}</p>
        <div className="mt-10">
        {job.sample ? (
          <div role="note" className="flex max-w-2xl gap-3 rounded-xl border border-dashed border-accent-ink/70 bg-surface p-5 text-[0.94rem]">
            <AlertTriangle size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-accent-ink" />
            <p>
              <strong className="font-medium">Sample listing.</strong> This role is not currently open and applications for it are not accepted. You can still{' '}
              <Link to="/careers#apply" className="underline underline-offset-4">
                send a general application
              </Link>
              .
            </p>
          </div>
        ) : (
          <ButtonAnchor href="#apply">Apply for this role</ButtonAnchor>
        )}
        </div>
      </header>

      <section aria-label="Role details" className="border-t border-line py-24 lg:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <dl className="divide-y divide-line border-y border-line lg:sticky lg:top-32">
              {facts.map((f) => (
                <div key={f.label} className="flex justify-between gap-4 py-5">
                  <dt className="eyebrow pt-1 text-subtle">{f.label}</dt>
                  <dd className="text-right">{f.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
          <div className="space-y-20 lg:col-span-7 lg:col-start-6">
            <List title="What you’ll do" items={job.responsibilities} />
            <List title="What you’ll bring" items={job.skills} />
            {job.niceToHave && <List title="Nice to have" items={job.niceToHave} />}
          </div>
        </div>
      </section>

      <section id="apply" aria-labelledby="apply-title" className="border-t border-line bg-canvas-alt py-24 lg:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-muted">Apply</p>
            <h2 id="apply-title" className="text-title mt-5">
              {job.sample ? 'Applications closed' : `Apply for ${job.title}`}
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              {job.sample
                ? 'This is a sample listing, so the form below is disabled. Use the general application on the careers page instead.'
                : 'Share a few details and your CV. We read every application.'}
            </p>
            {job.sample && (
              <Link to="/careers#apply" className="link-draw mt-6 inline-block text-accent-ink">
                Go to general application
              </Link>
            )}
          </div>
          <div className="rounded-2xl border border-line bg-canvas p-6 sm:p-10 lg:col-span-8">
            <ApplicationForm role={job.title} disabled={job.sample} />
          </div>
        </div>
      </section>
    </div>
  )
}

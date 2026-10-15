import { useRef } from 'react'
import { useSearchParams } from 'react-router'
import { Seo } from '@/components/Seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ButtonAnchor } from '@/components/ui/Button'
import { JobRow } from '@/components/blocks/JobRow'
import { ApplicationForm } from '@/components/forms/ApplicationForm'
import { jobDepartments, openJobs, sampleJobs, type Job } from '@/content/careers'
import { useReveal } from '@/hooks/useReveal'

const culture = [
  { title: 'Craft over shortcuts', body: 'We care about the details people notice and the ones they don’t — accessible interfaces, readable code, honest copy.' },
  { title: 'Learn across disciplines', body: 'Designers, engineers and marketers work on the same problems, so everyone understands the whole picture.' },
  { title: 'Ownership', body: 'You are trusted with real responsibility for the work you deliver, and supported when you need help.' },
  { title: 'Straight communication', body: 'With each other and with clients: clear expectations, written decisions and no surprises.' },
]

function Filters({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div role="group" aria-label="Filter by department" className="flex flex-wrap gap-2">
      {jobDepartments.map((d) => (
        <button
          key={d}
          type="button"
          aria-pressed={d === value}
          onClick={() => onChange(d)}
          className={`rounded-full border px-4 py-2 text-[0.88rem] transition-colors duration-300 ${
            d === value ? 'border-fg bg-fg text-canvas' : 'border-line-strong hover:border-fg'
          }`}
        >
          {d}
        </button>
      ))}
    </div>
  )
}

const byDept = (list: Job[], d: string) => (d === 'All' ? list : list.filter((j) => j.department === d))

export default function CareersPage() {
  const root = useRef<HTMLDivElement>(null)
  const [params, setParams] = useSearchParams()
  const raw = params.get('department') ?? 'All'
  const dept = jobDepartments.includes(raw) ? raw : 'All'
  useReveal(root, [dept])

  const setDept = (d: string) => {
    const next = new URLSearchParams(params)
    if (d === 'All') next.delete('department')
    else next.set('department', d)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const open = byDept(openJobs, dept)
  const samples = byDept(sampleJobs, dept)

  return (
    <div ref={root}>
      <Seo title="Careers" description="Careers at Zinfity Technologies — how we work, open positions and how to apply." />
      {/* Status-first opening */}
      <header className="container-x pb-16 pt-[calc(var(--header-h)+3rem)] lg:pb-24 lg:pt-36">
        <Breadcrumbs items={[{ label: 'Careers' }]} />
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h1 className="text-[clamp(2.6rem,5.6vw,5.6rem)] font-medium leading-[0.96] tracking-[-0.05em]">
              Build what <span className="serif-accent metal-text">matters</span> with us.
            </h1>
            <p className="text-lede mt-6 max-w-xl text-muted">
              Designers, engineers and marketers working on the same problems. If you care about doing good work with good people, we’d like to hear from you.
            </p>
          </div>
          <div className="rounded-2xl border border-line-strong bg-surface p-6 lg:col-span-5" role="status">
            <p className="eyebrow text-subtle">Vacancy status</p>
            <p className="mt-4 flex items-center gap-3 text-2xl font-medium tracking-[-0.02em]">
              <span className={`relative flex h-3 w-3`} aria-hidden="true">
                <span className={`absolute inset-0 rounded-full ${openJobs.length ? 'bg-success' : 'bg-subtle'}`} />
              </span>
              {openJobs.length ? `${openJobs.length} open ${openJobs.length === 1 ? 'role' : 'roles'}` : 'No open roles right now'}
            </p>
            <p className="mt-3 text-[0.94rem] text-muted">General applications are always welcome.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {openJobs.length > 0 && (
                <ButtonAnchor href="#positions" size="sm">
                  See open roles
                </ButtonAnchor>
              )}
              <ButtonAnchor href="#apply" size="sm" variant={openJobs.length ? 'ghost' : 'primary'}>
                Apply generally
              </ButtonAnchor>
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="culture" className="border-t border-line py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <h2 id="culture" className="text-[clamp(1.9rem,3.2vw,3rem)] font-medium leading-[1.02] tracking-[-0.04em] lg:col-span-4">
            How we work together
          </h2>
          <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8">
            {culture.map((c, i) => (
              <li key={c.title} data-reveal className="border-t border-fg pt-5">
                <p className="font-mono text-[0.75rem] text-subtle">0{i + 1}</p>
                <h3 className="mt-3 text-xl font-medium tracking-[-0.02em]">{c.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{c.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="positions" aria-labelledby="positions-title" className="border-t border-line bg-canvas-alt py-24 lg:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow text-muted">Open positions</p>
              <h2 id="positions-title" className="text-headline mt-5">
                Current openings
              </h2>
            </div>
            <Filters value={dept} onChange={setDept} />
          </div>

          {open.length > 0 ? (
            <ul className="mt-12 border-t border-line">
              {open.map((j) => (
                <JobRow key={j.slug} job={j} />
              ))}
            </ul>
          ) : (
            <div className="mt-12 rounded-2xl border border-dashed border-line-strong bg-canvas p-10 sm:p-14">
              <p className="text-2xl font-medium tracking-[-0.02em]">
                {openJobs.length === 0 ? 'There are no open positions right now.' : 'No open positions in this department.'}
              </p>
              <p className="mt-3 max-w-xl leading-relaxed text-muted">
                We still welcome general applications. Tell us about yourself and the kind of work you enjoy, and we’ll keep your details on file.
              </p>
              <a href="#apply" className="link-draw mt-6 inline-block text-accent-ink">
                Send a general application
              </a>
            </div>
          )}

          {samples.length > 0 && (
            <div className="mt-20">
              <div className="flex flex-wrap items-center gap-4">
                <h3 className="eyebrow text-muted">Example role listings</h3>
                <span className="badge-sample">Samples — not open vacancies</span>
              </div>
              <p className="mt-4 max-w-2xl text-[0.94rem] leading-relaxed text-muted">
                These listings show how roles are presented on this page. They are not currently open and do not describe confirmed terms.
              </p>
              <ul className="mt-8 border-t border-line">
                {samples.map((j) => (
                  <JobRow key={j.slug} job={j} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section id="apply" aria-labelledby="apply-title" className="py-24 lg:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-muted">General application</p>
            <h2 id="apply-title" className="text-title mt-5">
              Introduce yourself
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              Don’t see the right role? Send us a short note and your CV. We read every application and will contact you if there is a suitable fit.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6 sm:p-10 lg:col-span-8">
            <ApplicationForm role="General application" />
          </div>
        </div>
      </section>
    </div>
  )
}

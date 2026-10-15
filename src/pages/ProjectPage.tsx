import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Info } from 'lucide-react'
import { Seo } from '@/components/Seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ButtonLink } from '@/components/ui/Button'
import { ProjectArt } from '@/visuals/ProjectArt'
import { projectBySlug, projectPath, projects } from '@/content/work'
import { serviceById, servicePath } from '@/content/services'
import { contactHref } from '@/lib/enquiry'
import { useHeadlineReveal } from '@/hooks/useHeadlineReveal'
import { useReveal } from '@/hooks/useReveal'
import { ScrollTrigger, useGSAP } from '@/lib/gsap'
import NotFound from './NotFound'

const pad = (n: number) => String(n).padStart(2, '0')

export default function ProjectPage() {
  const { slug = '' } = useParams()
  const project = projectBySlug(slug)
  const root = useRef<HTMLDivElement>(null)
  const head = useRef<HTMLHeadingElement>(null)
  const [chapter, setChapter] = useState(0)
  useHeadlineReveal(head, { deps: [slug] })
  useReveal(root, [slug])

  useGSAP(
    () => {
      trackChapters(root.current, setChapter)
    },
    { scope: root, dependencies: [slug], revertOnUpdate: true },
  )

  if (!project)
    return (
      <div ref={root}>
        <NotFound />
      </div>
    )

  const i = projects.indexOf(project)
  const next = projects[(i + 1) % projects.length]
  const enquire = contactHref({ service: project.relatedService, project: project.title })
  const concept = project.status === 'concept'
  const { side, focus } = project.presentation
  const f = focus[chapter]

  const chapters = [
    { label: 'The situation', body: <p className="text-[clamp(1.25rem,1.7vw,1.55rem)] leading-snug tracking-[-0.015em]">{project.problem}</p> },
    {
      label: 'Approach',
      body: (
        <ol className="space-y-3">
          {project.approach.map((a, n) => (
            <li key={a} className="grid grid-cols-[2rem_1fr] gap-2 leading-relaxed">
              <span className="font-mono text-[0.75rem] text-subtle">{pad(n + 1)}</span>
              {a}
            </li>
          ))}
        </ol>
      ),
    },
    { label: 'The solution', body: <p className="text-lg leading-relaxed text-muted">{project.solution}</p> },
    {
      label: 'Deliverables',
      body: (
        <ul className="flex flex-wrap gap-2">
          {project.deliverables.map((d) => (
            <li key={d} className="chip">
              {d}
            </li>
          ))}
        </ul>
      ),
    },
  ]

  return (
    <div ref={root}>
      <Seo title={`${project.title}${concept ? ' (concept study)' : ''}`} description={project.description} />

      <header className="container-x pb-14 pt-[calc(var(--header-h)+3rem)] lg:pb-20 lg:pt-36">
        <Breadcrumbs items={[{ label: 'Work', to: '/work' }, { label: project.title }]} />
        <div className="flex flex-wrap items-center gap-3">
          {concept && <span className="badge-sample">Concept study</span>}
          <span className="eyebrow text-muted">{project.category}</span>
        </div>
        <h1 ref={head} className="mt-6 max-w-5xl text-[clamp(2.8rem,7vw,7rem)] font-medium leading-[0.92] tracking-[-0.055em]">
          {project.title}
        </h1>
        <p className="text-lede mt-8 max-w-2xl text-muted">{project.overview}</p>
      </header>

      {/* Story: a sticky dark canvas that refocuses on each chapter */}
      <section aria-label="Case study" className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Mobile: the grid item itself sticks (its parent is the tall section). Desktop: the inner block sticks. */}
        <div className={`z-10 max-lg:sticky max-lg:top-2 max-lg:self-start lg:col-span-7 ${side === 'left' ? 'lg:order-1' : 'lg:order-2'}`}>
          <div className="lg:sticky lg:top-[14vh]">
            <div className="@container theme-dark relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-canvas shadow-[0_40px_80px_-40px_rgb(17_18_22/0.6)]">
              <div
                className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-in-out-quart)] motion-reduce:transition-none"
                style={{ transformOrigin: `${f.x}% ${f.y}%`, transform: `scale(${f.zoom})` }}
              >
                <ProjectArt art={project.art} />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-canvas/80 to-transparent p-4 pt-12">
                <span className="eyebrow text-fg" aria-live="polite">
                  {f.caption}
                </span>
                <span className="flex gap-1.5" aria-hidden="true">
                  {focus.map((_, n) => (
                    <span key={n} className={`h-1 rounded-full transition-all duration-500 ${n === chapter ? 'w-6 bg-accent' : 'w-1.5 bg-fg/30'}`} />
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>

        <ol className={`lg:col-span-5 ${side === 'left' ? 'lg:order-2' : 'lg:order-1'}`}>
          {chapters.map((c, n) => (
            <li key={c.label} data-chapter className="flex min-h-[55vh] flex-col justify-center border-t border-line py-14 first:border-t-0 lg:min-h-[78vh]">
              <p className="eyebrow text-accent-ink">
                {pad(n + 1)} — {c.label}
              </p>
              <div className="mt-6">{c.body}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* Facts strip */}
      <section aria-label="Project facts" className="mt-16 border-y border-line bg-canvas-alt">
        <dl className="container-x grid gap-8 py-12 sm:grid-cols-3">
          <div data-reveal>
            <dt className="eyebrow text-subtle">Services</dt>
            <dd className="mt-3 space-y-1">
              {project.services.map((id) => {
                const s = serviceById(id)!
                return (
                  <Link key={id} to={servicePath(s)} className="link-draw block w-fit">
                    {s.title}
                  </Link>
                )
              })}
            </dd>
          </div>
          <div data-reveal>
            <dt className="eyebrow text-subtle">Technology</dt>
            <dd className="mt-3">{project.technologies.join(', ')}</dd>
          </div>
          <div data-reveal>
            <dt className="eyebrow text-subtle">Results</dt>
            <dd className="mt-3 flex gap-2 text-muted">
              {project.results?.length ? (
                <ul className="space-y-1 text-fg">
                  {project.results.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              ) : (
                <>
                  <Info size={16} aria-hidden="true" className="mt-1 shrink-0 text-accent-ink" />
                  Concept study — no client results are reported.
                </>
              )}
            </dd>
          </div>
        </dl>
      </section>

      {/* Contextual enquiry + next study */}
      <section aria-label="Next" className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:items-center lg:py-28">
        <div className="lg:col-span-5">
          <p className="text-[clamp(1.6rem,2.6vw,2.3rem)] font-medium leading-[1.1] tracking-[-0.03em]">Planning something similar?</p>
          <p className="mt-3 text-muted">We’ll start from this study as context.</p>
          <ButtonLink to={enquire} className="mt-8">
            Discuss a similar project
          </ButtonLink>
        </div>
        <Link to={projectPath(next)} className="group lg:col-span-6 lg:col-start-7">
          <span className="eyebrow text-subtle">Next study</span>
          <div className="@container theme-dark relative mt-4 aspect-[16/9] overflow-hidden rounded-[1.25rem] bg-canvas">
            <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105">
              <ProjectArt art={next.art} />
            </div>
          </div>
          <span className="mt-4 block text-2xl font-medium tracking-[-0.03em]">
            <span className="link-draw">{next.title}</span> →
          </span>
        </Link>
      </section>
    </div>
  )
}

/** Sets the active chapter as each one crosses the middle of the viewport. */
function trackChapters(scope: HTMLElement | null, set: (n: number) => void) {
  if (!scope) return
  scope.querySelectorAll<HTMLElement>('[data-chapter]').forEach((el, n) =>
    ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => self.isActive && set(n) }),
  )
}

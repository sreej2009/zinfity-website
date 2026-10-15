import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Seo } from '@/components/Seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ProjectArt } from '@/visuals/ProjectArt'
import { projectGroups, projects, projectPath, type Project } from '@/content/work'
import { useHeadlineReveal } from '@/hooks/useHeadlineReveal'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

const pad = (n: number) => String(n).padStart(2, '0')

/** Edge-to-edge project canvas with a pointer-following label on desktop. */
function Canvas({ project, index }: { project: Project; index: number }) {
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null)
  return (
    <article data-project aria-labelledby={`w-${project.id}`} className="group relative">
      <Link
        to={projectPath(project)}
        aria-labelledby={`w-${project.id}`}
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return
          const r = e.currentTarget.getBoundingClientRect()
          setHover({ x: e.clientX - r.left, y: e.clientY - r.top })
        }}
        onPointerLeave={() => setHover(null)}
        className="block cursor-none max-lg:cursor-pointer"
      >
        <div
          data-canvas
          className="@container theme-dark relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-canvas sm:aspect-[16/9] lg:aspect-[21/9]"
          style={{ clipPath: 'inset(0% 0% 0% 0% round 1.25rem)' }}
        >
          <div data-art className="absolute inset-0 transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]">
            <ProjectArt art={project.art} />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 bg-gradient-to-t from-canvas/85 to-transparent p-5 pt-24 sm:p-8">
            <h2 id={`w-${project.id}`} className="text-[clamp(1.6rem,3.6vw,3.4rem)] font-medium leading-none tracking-[-0.045em]">
              {project.title}
            </h2>
            <span className="font-mono text-[0.75rem] text-muted">{pad(index + 1)}</span>
          </div>
          <span className="eyebrow pointer-events-none absolute left-5 top-5 rounded-full border border-fg/20 bg-canvas/60 px-3 py-1.5 text-[0.6rem] text-fg/80 backdrop-blur sm:left-8 sm:top-8">
            Concept study
          </span>
          {hover && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute z-10 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#ede9e3] text-center text-[0.78rem] font-medium leading-tight text-[#171717] transition-transform duration-200"
              style={{ left: hover.x, top: hover.y }}
            >
              View
              <br />
              case
            </span>
          )}
        </div>
      </Link>
      <div className="mt-5 grid gap-3 sm:grid-cols-12">
        <p className="eyebrow text-accent-ink sm:col-span-3">{project.category}</p>
        <p className="leading-relaxed text-muted sm:col-span-6">{project.description}</p>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-subtle sm:col-span-3 sm:text-right">{project.technologies.join(' · ')}</p>
      </div>
    </article>
  )
}

export default function WorkPage() {
  const root = useRef<HTMLDivElement>(null)
  const head = useRef<HTMLHeadingElement>(null)
  const [params, setParams] = useSearchParams()
  const raw = params.get('category') ?? 'All'
  const category = (projectGroups as readonly string[]).includes(raw) ? raw : 'All'
  const list = category === 'All' ? projects : projects.filter((p) => p.group === category)
  useHeadlineReveal(head)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.utils.toArray<HTMLElement>('[data-project]').forEach((el) => {
          const canvas = el.querySelector('[data-canvas]')
          const art = el.querySelector('[data-art]')
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
            .fromTo(canvas, { clipPath: 'inset(10% 6% 10% 6% round 1.25rem)' }, { clipPath: 'inset(0% 0% 0% 0% round 1.25rem)', duration: 1.6, ease: 'expo.inOut' })
            .fromTo(art, { scale: 1.2 }, { scale: 1, duration: 1.8, ease: 'expo.out', clearProps: 'transform' }, 0.1)
        })
      })
    },
    { scope: root, dependencies: [category], revertOnUpdate: true },
  )

  const select = (g: string) => {
    const next = new URLSearchParams(params)
    if (g === 'All') next.delete('category')
    else next.set('category', g)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <div ref={root}>
      <Seo
        title="Work"
        description="Concept studies showing how Zinfity approaches platforms, commerce, mobile apps and automation — from problem and approach to solution and technology."
      />
      <header className="container-x pb-10 pt-[calc(var(--header-h)+3rem)] lg:pt-36">
        <Breadcrumbs items={[{ label: 'Work' }]} />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h1 ref={head} className="text-[clamp(3.4rem,10vw,10rem)] font-medium leading-[0.86] tracking-[-0.06em]">
            Work<span className="serif-accent metal-text">.</span>
          </h1>
          <p className="max-w-md leading-relaxed text-muted lg:pb-4">
            {pad(projects.length)} concept studies showing how we approach real problems. They name no clients and claim no results; detailed client work is shared on request.
          </p>
        </div>
      </header>

      <div className="sticky top-0 z-30 border-y border-line bg-canvas/85 backdrop-blur-xl">
        <div role="group" aria-label="Filter by category" className="container-x flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {projectGroups.map((g) => {
            const count = g === 'All' ? projects.length : projects.filter((p) => p.group === g).length
            const on = g === category
            return (
              <button
                key={g}
                type="button"
                aria-pressed={on}
                onClick={() => select(g)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-[0.86rem] transition-colors duration-300 ${
                  on ? 'border-fg bg-fg text-canvas' : 'border-line-strong hover:border-fg'
                }`}
              >
                {g}
                <span className={`font-mono text-[0.68rem] ${on ? 'text-canvas/70' : 'text-subtle'}`}>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <section aria-label="Projects" className="container-x space-y-20 py-14 lg:space-y-28 lg:py-20">
        <p className="sr-only" aria-live="polite">
          Showing {list.length} {list.length === 1 ? 'project' : 'projects'}
        </p>
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line-strong p-12 text-center">
            <p className="text-xl font-medium">No projects in this category yet.</p>
            <button type="button" onClick={() => select('All')} className="link-draw mt-4 text-accent-ink">
              Show all projects
            </button>
          </div>
        ) : (
          list.map((p) => <Canvas key={p.id} project={p} index={projects.indexOf(p)} />)
        )}
      </section>
    </div>
  )
}

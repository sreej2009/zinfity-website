import { useRef } from 'react'
import { Link } from 'react-router'
import { projects, projectPath } from '@/content/work'
import { ProjectArt } from '@/visuals/ProjectArt'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

/** Home: one curated project whose canvas opens to full bleed as it scrolls in. */
export function FeaturedProject() {
  const root = useRef<HTMLElement>(null)
  const project = projects[0]

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        const scrub = { trigger: root.current, start: 'top 85%', end: 'center 55%', scrub: 0.8 }
        gsap.fromTo(
          '[data-canvas]',
          { clipPath: 'inset(8% 14% 8% 14% round 1.75rem)' },
          { clipPath: 'inset(0% 0% 0% 0% round 0rem)', ease: 'none', scrollTrigger: scrub },
        )
        gsap.fromTo('[data-art]', { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: scrub })
        gsap.fromTo('[data-caption]', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: 'none', scrollTrigger: { ...scrub, start: 'top 45%', end: 'top 15%' } })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="featured-title" className="relative">
      <Link to={projectPath(project)} className="group block" aria-labelledby="featured-title">
        <div data-canvas className="@container theme-dark relative h-[78svh] min-h-[28rem] overflow-hidden bg-canvas" style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
          <div data-art className="absolute inset-0 will-change-transform">
            <div className="absolute inset-0 transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]">
              <ProjectArt art={project.art} />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-canvas/90 to-transparent" aria-hidden="true" />
          <div data-caption className="container-x absolute inset-x-0 bottom-0 pb-8 lg:pb-12">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow flex flex-wrap items-center gap-3 text-muted">
                  <span className="rounded-full border border-fg/20 px-2.5 py-1 text-[0.6rem]">Concept study</span>
                  {project.category}
                </p>
                <h2 id="featured-title" className="mt-4 text-[clamp(2rem,5vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.045em]">
                  {project.title}
                </h2>
              </div>
              <span className="inline-flex items-center gap-3 text-[0.95rem] text-fg">
                <span className="link-draw">Read the case study</span>
                <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full border border-fg/30 transition-colors group-hover:bg-fg group-hover:text-canvas">
                  →
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  )
}

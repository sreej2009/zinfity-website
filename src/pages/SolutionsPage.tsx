import { useRef, useState } from 'react'
import { Seo } from '@/components/Seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { SystemsMap } from '@/sections/SystemsMap'
import { solutions } from '@/content/solutions'
import { DisciplinesSystem, FrictionDiagnostic, LayerExplorer, RoutePanel } from '@/sections/solutions/SolutionsSections'
import { useReveal } from '@/hooks/useReveal'
import { useHeadlineReveal } from '@/hooks/useHeadlineReveal'

export default function SolutionsPage() {
  const root = useRef<HTMLDivElement>(null)
  const head = useRef<HTMLHeadingElement>(null)
  const [active, setActive] = useState(0)
  useReveal(root)
  useHeadlineReveal(head)
  const current = solutions[active]

  return (
    <div ref={root}>
      <Seo
        title="Solutions"
        description="How interfaces, applications, integrations, data and business operations connect — and the solution architectures Zinfity designs across them."
      />

      {/* The map is the page: compact title, then straight into the architecture */}
      <section aria-labelledby="sol-title" className="container-x pb-16 pt-[calc(var(--header-h)+3rem)] lg:pt-36">
        <Breadcrumbs items={[{ label: 'Solutions' }]} />
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h1 ref={head} id="sol-title" className="text-[clamp(2.4rem,4.8vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.045em] lg:col-span-7">
            One business. <span className="serif-accent metal-text">Five layers.</span> Every layer connected.
          </h1>
          <p className="text-lede text-muted lg:col-span-5">
            Problems rarely live in one tool. Choose a scenario to see the route it takes — from the screens people use down to the work itself.
          </p>
        </div>
        <div className="mt-12">
          <SystemsMap active={active} onChange={setActive} />
        </div>

        <RoutePanel current={current} />
      </section>

      {/* Layer by layer: an assembling, explorable stack */}
      <section aria-labelledby="layers-title" className="py-20 lg:py-28">
        <div className="container-x">
          <p className="eyebrow text-muted">Architecture</p>
          <h2 id="layers-title" className="mt-4 mb-12 max-w-3xl text-[clamp(1.9rem,3.4vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            What we design at each layer
          </h2>
          <LayerExplorer />
        </div>
      </section>

      {/* Disciplines: four identities around one shared plan */}
      <section aria-labelledby="disc-title" className="theme-dark bg-canvas py-20 lg:py-28">
        <div className="container-x">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 id="disc-title" className="text-[clamp(1.9rem,3.4vw,3.2rem)] font-medium leading-[1.05] tracking-[-0.035em]">
              Four disciplines, <span className="serif-accent metal-text">one</span> plan.
            </h2>
            <p className="mt-5 leading-relaxed text-muted">Projects stall when these are handled by separate teams who rarely talk. We plan them together from the first conversation.</p>
          </div>
          <DisciplinesSystem />
        </div>
      </section>

      {/* Closing: start from the layer that hurts */}
      <section aria-labelledby="friction" className="container-x py-20 lg:py-28">
        <p className="eyebrow text-muted">Diagnose</p>
        <h2 id="friction" className="mt-4 mb-12 max-w-2xl text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">
          Which layer is causing the most friction?
        </h2>
        <FrictionDiagnostic />
      </section>
    </div>
  )
}

import { ButtonLink } from '@/components/ui/Button'
import { DesignCanvasDemo } from '@/components/demos/DesignCanvasDemo'
import { Faq, Headline, HowWeStart, ProjectTeaser, RelatedServices, ServiceMeta, ServiceSeo, TechList, useServicePage } from '@/components/service/kit'
import { DesignBoard } from '@/components/demos/DesignBoard'
import { ArtefactSequence, CapabilitySpecimens } from '@/components/service/visuals/uiux'
import { DesignCompare } from '@/components/service/visuals/upgrades'
import { StepFlow } from '@/components/service/visuals/process'
import { Component, MousePointerClick, Network, Users } from 'lucide-react'

/** UI/UX: the design canvas leads; artefacts are presented like a portfolio index. */
export default function UiUxDesign() {
  const { detail: d, enquire, root, head } = useServicePage('uiux')
  const art = d.signature.kind === 'artifacts' ? d.signature : null

  return (
    <div ref={root}>
      <ServiceSeo id="uiux" />
      {/* Hero: headline beside a light design canvas */}
      <header className="relative pb-16 pt-[calc(var(--header-h)+3rem)] lg:pb-24 lg:pt-32">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <ServiceMeta id="uiux" />
            <h1 ref={head} className="mt-6 text-[clamp(2.6rem,4.8vw,5rem)] font-medium leading-[0.93] tracking-[-0.055em]">
              <Headline parts={d.headline} />
            </h1>
            <p className="mt-6 max-w-md leading-relaxed text-muted">{d.intro}</p>
            <ButtonLink to={enquire} className="mt-8">
              Book a design conversation
            </ButtonLink>
          </div>
          <div className="lg:col-span-7">
            <DesignBoard />
          </div>
        </div>
      </header>

      <section aria-label="Fidelity" className="container-x">
        <DesignCanvasDemo tone="light" />
      </section>

      {art && (
        <section aria-labelledby="artefacts" className="container-x py-20 lg:py-28">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 id="artefacts" className="text-[clamp(2rem,3.6vw,3.4rem)] font-medium tracking-[-0.04em]">
              {art.title}
            </h2>
            <p className="max-w-sm text-muted">{art.intro}</p>
          </div>
          <ArtefactSequence items={art.items} />
        </section>
      )}

      <section aria-label="Why design matters" className="border-y border-line bg-canvas-alt py-20 lg:py-28">
        <div className="container-x">
          <h2 className="mb-12 max-w-2xl text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">Why design matters</h2>
          <DesignCompare problems={d.problems} benefits={d.benefits} />
        </div>
      </section>

      <CapabilitySpecimens groups={d.capabilities} title="Research, design and systems" />

      <section aria-label="Method and tools" className="container-x grid gap-14 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          <p className="eyebrow text-muted">Method</p>
          <h2 className="mt-4 mb-10 text-[clamp(1.8rem,2.8vw,2.6rem)] font-medium tracking-[-0.03em]">From research to a design system</h2>
          <div>
            <StepFlow steps={d.process} icons={[Users, Network, MousePointerClick, Component]} variant="phases" columns={2} />
          </div>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <TechList groups={d.tech} />
          <Faq items={d.faq} className="mt-10" />
        </div>
      </section>

      <HowWeStart id="uiux" tone="alt" />

      <section aria-label="Next step" className="container-x border-t border-line py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[clamp(1.6rem,2.6vw,2.3rem)] font-medium tracking-[-0.03em]">{d.ctaLine}</p>
            <ButtonLink to={enquire} className="mt-6">
              Book a design conversation
            </ButtonLink>
            <div className="mt-6">
              <RelatedServices ids={d.related} />
            </div>
          </div>
          <ProjectTeaser id={d.relatedProject} />
        </div>
      </section>
    </div>
  )
}

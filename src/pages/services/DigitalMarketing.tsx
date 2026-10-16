import { ButtonLink } from '@/components/ui/Button'
import { CampaignDemo } from '@/components/demos/CampaignDemo'
import { Faq, Headline, HowWeStart, RelatedServices, ServiceMeta, ServiceSeo, TechList, useServicePage } from '@/components/service/kit'
import { CampaignStudio } from '@/components/demos/CampaignStudio'
import { marketingDeliverables } from '@/content/service-extras'
import { DeliverableShowcase, GrowthBenefits, ImprovementCycle } from '@/components/service/visuals/marketing'
import { ChannelShowcase } from '@/components/service/visuals/upgrades'
import { SeoSection } from '@/components/service/visuals/seo'
import { StepFlow } from '@/components/service/visuals/process'
import { Map, Rocket, Search, SlidersHorizontal } from 'lucide-react'

/** Digital marketing: campaign-studio hero, deliverables, journey demo, improvement cycle, benefits and capabilities. */
export default function DigitalMarketing() {
  const { detail: d, enquire, root, head } = useServicePage('marketing')

  return (
    <div ref={root}>
      <ServiceSeo id="marketing" />
      {/* Hero: campaign studio — assets across channels feeding one report */}
      <header className="relative overflow-hidden pb-16 pt-[calc(var(--header-h)+3rem)] lg:pb-24 lg:pt-32">
        <div aria-hidden="true" className="pointer-events-none absolute left-[-10%] top-0 -z-10 h-[40rem] w-[60rem] rounded-full bg-[radial-gradient(closest-side,rgb(199_155_105/0.14),transparent)]" />
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <ServiceMeta id="marketing" />
            <h1 ref={head} className="mt-6 text-[clamp(2.5rem,4.6vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.05em]">
              <Headline parts={d.headline} />
            </h1>
            <p className="mt-6 max-w-md leading-relaxed text-muted">{d.intro}</p>
            <ButtonLink to={enquire} className="mt-8">
              Plan your growth
            </ButtonLink>
          </div>
          <div className="lg:col-span-7">
            <CampaignStudio />
            <p className="mt-4 text-[0.8rem] text-subtle">Illustrative assets — every campaign is created for your brand and audience.</p>
          </div>
        </div>
      </header>

      {/* Deliverables */}
      <section aria-labelledby="deliverables" className="border-y border-line bg-canvas-alt py-20 lg:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="deliverables" className="text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">
              What you receive
            </h2>
            <p className="mt-4 max-w-sm text-muted">Concrete outputs, agreed in the plan before any budget is spent.</p>
          </div>
          <div className="lg:col-span-8">
            <DeliverableShowcase items={marketingDeliverables} />
          </div>
        </div>
      </section>

      <SeoSection />

      <section aria-label="Customer journey" className="container-x pt-20 lg:pt-28">
        <CampaignDemo />
      </section>

      {/* The improvement loop */}
      <section aria-labelledby="loop" className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:items-center lg:py-28">
        <div className="lg:col-span-5">
          <h2 id="loop" className="text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">
            The campaign improvement cycle
          </h2>
          <p className="mt-4 leading-relaxed text-muted">Every campaign feeds the next one. We review what the data shows and adjust — on a regular rhythm agreed with you.</p>
          <ul className="mt-8 space-y-4">
            {d.problems.map((p) => (
              <li key={p.title} data-reveal className="border-t border-line pt-4">
                <p className="font-medium">{p.title}</p>
                <p className="mt-1 text-[0.94rem] text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ImprovementCycle steps={d.process} />
        </div>
      </section>
      <section aria-label="Each step of the cycle" className="container-x pb-20 lg:pb-28">
        <StepFlow steps={d.process} icons={[Search, Map, Rocket, SlidersHorizontal]} variant="loop" loopLabel="Each cycle starts again from the evidence" />
      </section>

      <GrowthBenefits items={d.benefits} title="Marketing that earns its budget" />

      <section aria-labelledby="matrix" className="border-y border-line bg-canvas-alt py-20 lg:py-28">
        <div className="container-x">
          <h2 id="matrix" className="eyebrow text-muted">
            Capabilities
          </h2>
          <p className="mt-4 mb-10 max-w-2xl text-[clamp(1.6rem,2.4vw,2.2rem)] font-medium leading-[1.1] tracking-[-0.03em]">Visibility, acquisition and insight — planned as one system.</p>
          <ChannelShowcase groups={d.capabilities} />
        </div>
      </section>

      <HowWeStart id="marketing" />

      <section aria-label="Tools, questions and next step" className="container-x grid gap-14 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-5">
          <TechList groups={d.tech} />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Faq items={d.faq} />
          <p className="mt-12 text-2xl font-medium tracking-[-0.025em]">{d.ctaLine}</p>
          <ButtonLink to={enquire} className="mt-5">
            Plan your growth
          </ButtonLink>
          <div className="mt-8">
            <RelatedServices ids={d.related} />
          </div>
        </div>
      </section>
    </div>
  )
}

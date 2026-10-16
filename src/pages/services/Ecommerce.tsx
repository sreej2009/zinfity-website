import { ButtonLink } from '@/components/ui/Button'
import { StorefrontDemo } from '@/components/demos/StorefrontDemo'
import { Faq, Headline, HowWeStart, ProjectTeaser, RelatedServices, ServiceMeta, ServiceSeo, TechList, useServicePage } from '@/components/service/kit'
import { OrderFlow } from '@/components/demos/OrderFlow'
import { commerceOperations } from '@/content/service-extras'
import { JourneyPath } from '@/components/service/visuals/commerce'
import { CommerceLayers } from '@/components/service/visuals/upgrades'
import { OpsShowcase, StoreBenefits, StoreLeaks } from '@/components/service/visuals/commerce-extra'
import { StepFlow } from '@/components/service/visuals/process'
import { ClipboardList, PenTool, Plug, Rocket } from 'lucide-react'

/** E-commerce: product presentation first; then the full buyer and operator journey. */
export default function Ecommerce() {
  const { detail: d, enquire, root, head } = useServicePage('commerce')
  const journey = d.signature.kind === 'journey' ? d.signature : null

  return (
    <div ref={root}>
      <ServiceSeo id="commerce" />
      <header className="container-x grid gap-12 pb-16 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:items-center lg:pt-32">
        <div className="lg:col-span-5">
          <ServiceMeta id="commerce" />
          <h1 ref={head} className="mt-6 text-[clamp(2.6rem,5vw,5.2rem)] font-medium leading-[0.96] tracking-[-0.05em]">
            <Headline parts={d.headline} />
          </h1>
          <p className="mt-6 leading-relaxed text-muted">{d.intro}</p>
          <ButtonLink to={enquire} className="mt-8">
            Plan your store
          </ButtonLink>
        </div>
        <div className="lg:col-span-7">
          <StorefrontDemo />
        </div>
      </header>

      {journey && (
        <section aria-labelledby="journey" className="theme-dark bg-canvas py-20 lg:py-28">
          <div className="container-x">
            <h2 id="journey" className="max-w-3xl text-[clamp(2rem,3.6vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.04em]">
              {journey.title}
            </h2>
            <p className="mt-4 max-w-xl text-muted">{journey.intro}</p>
            <JourneyPath steps={journey.steps} />
          </div>
        </section>
      )}

      {/* Storefront + back office */}
      <section aria-labelledby="order-flow" className="container-x py-20 lg:py-28">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="order-flow" className="max-w-2xl text-[clamp(1.9rem,3.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em]">
            One purchase, every system updated
          </h2>
          <p className="max-w-sm text-muted">The shopper sees a smooth checkout. Behind it, orders, stock, payments and invoices update without re-typing.</p>
        </div>
        <div className="mt-10">
          <OrderFlow />
        </div>
        <div className="mt-10">
          <OpsShowcase items={commerceOperations} />
        </div>
      </section>

      <section aria-label="Common problems" className="container-x py-20 lg:py-28">
        <p className="eyebrow text-muted">Common problems</p>
        <h2 className="mt-4 mb-12 max-w-2xl text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">Where stores lose customers — and time</h2>
        <StoreLeaks items={d.problems} />
      </section>

      <section aria-label="Capabilities" className="border-y border-line bg-canvas-alt py-20 lg:py-28">
        <div className="container-x">
          <h2 className="mb-12 max-w-2xl text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">From storefront to back office</h2>
          <CommerceLayers groups={d.capabilities} />
          <div className="mt-16 border-t border-line pt-10">
            <TechList groups={d.tech} />
          </div>
        </div>
      </section>

      <StoreBenefits items={d.benefits} title="What a better store changes" />

      {/* Process */}
      <section aria-labelledby="commerce-process" className="border-t border-line py-20 lg:py-24">
        <div className="container-x">
          <h2 id="commerce-process" className="text-[clamp(1.8rem,2.8vw,2.6rem)] font-medium tracking-[-0.03em]">
            How a store project runs
          </h2>
          <div className="mt-10">
            <StepFlow steps={d.process} icons={[ClipboardList, PenTool, Plug, Rocket]} variant="grow" />
          </div>
        </div>
      </section>

      <HowWeStart id="commerce" tone="alt" />

      <section aria-label="Questions and next step" className="container-x grid gap-14 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-6">
          <Faq items={d.faq} />
        </div>
        <div className="space-y-8 lg:col-span-5 lg:col-start-8">
          <ProjectTeaser id={d.relatedProject} />
          <p className="text-2xl font-medium tracking-[-0.025em]">{d.ctaLine}</p>
          <ButtonLink to={enquire}>Start your store project</ButtonLink>
          <RelatedServices ids={d.related} />
        </div>
      </section>
    </div>
  )
}

import { ButtonLink } from '@/components/ui/Button'
import { ErpDemo } from '@/components/demos/ErpDemo'
import { ModuleNetwork, PhaseTrack } from '@/components/service/visuals/erp'
import { ErpBeforeAfter } from '@/components/service/visuals/upgrades'
import { RolloutJourney } from '@/components/service/visuals/erp-extra'
import { Faq, Headline, HowWeStart, ProjectTeaser, RelatedServices, ServiceMeta, ServiceSeo, TechList, useServicePage } from '@/components/service/kit'

/** ERP & CRM: operational — a live order simulation, module map and before/after view. */
export default function ErpCrm() {
  const { detail: d, enquire, root, head } = useServicePage('erp')
  const mod = d.signature.kind === 'modules' ? d.signature : null

  return (
    <div ref={root}>
      <ServiceSeo id="erp" />
      <header className="container-x pb-12 pt-[calc(var(--header-h)+3rem)] lg:pt-36">
        <ServiceMeta id="erp" />
        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h1 ref={head} className="max-w-4xl text-[clamp(2.6rem,6vw,6.2rem)] font-medium leading-[0.95] tracking-[-0.05em]">
            <Headline parts={d.headline} />
          </h1>
          {mod && (
            <p className="shrink-0 text-right">
              <span className="metal-text block text-[clamp(4rem,8vw,7rem)] font-medium leading-none tracking-[-0.06em]">{mod.modules.length}</span>
              <span className="eyebrow text-muted">core modules, one record</span>
            </p>
          )}
        </div>
        <p className="text-lede mt-8 max-w-2xl text-muted">{d.intro}</p>
      </header>

      <div className="container-x">
        <ErpDemo />
      </div>

      {/* Before / after: problems mapped to outcomes */}
      <section aria-labelledby="ba" className="container-x py-20 lg:py-28">
        <h2 id="ba" className="text-[clamp(1.9rem,3vw,2.8rem)] font-medium tracking-[-0.035em]">
          Before and after a connected system
        </h2>
        <div className="mt-10">
          <ErpBeforeAfter problems={d.problems} benefits={d.benefits} />
        </div>
      </section>

      {mod && (
        <section aria-labelledby="modules" className="border-y border-line py-20 lg:py-28">
          <div className="container-x">
            <h2 id="modules" className="eyebrow text-muted">
              {mod.title}
            </h2>
            <p className="mt-4 max-w-xl text-[clamp(1.6rem,2.4vw,2.2rem)] font-medium leading-[1.1] tracking-[-0.03em]">Follow one order as it moves through the business.</p>
            <div className="mt-12">
              <ModuleNetwork modules={mod.modules} integrations={mod.integrations} />
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="erp-capabilities" className="container-x py-20 lg:py-28">
        <p className="eyebrow text-muted">Capabilities</p>
        <h2 id="erp-capabilities" className="mt-4 mb-14 text-[clamp(1.8rem,3vw,2.8rem)] font-medium tracking-[-0.035em]">
          From fit analysis to adoption
        </h2>
        <PhaseTrack groups={d.capabilities} />
      </section>

      <section aria-label="Rollout" className="py-20 lg:py-28">
        <div className="container-x">
          <p className="eyebrow text-muted">Rollout</p>
          <h2 className="mt-4 mb-4 text-[clamp(1.9rem,3vw,2.8rem)] font-medium tracking-[-0.035em]">A careful rollout</h2>
          <p className="mb-12 max-w-xl text-muted">Four stages from first analysis to go-live — each one tested before the next begins.</p>
          <RolloutJourney steps={d.process} />
          <div className="mt-20 grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="eyebrow text-muted">Platforms & tools</h2>
              <TechList groups={d.tech} className="mt-6" />
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <h2 className="eyebrow text-muted">Questions</h2>
              <Faq items={d.faq} className="mt-6" />
            </div>
          </div>
        </div>
      </section>

      <HowWeStart id="erp" tone="alt" />

      <section aria-label="Next step" className="container-x grid gap-10 border-t border-line py-16 lg:grid-cols-2 lg:items-center">
        <ProjectTeaser id={d.relatedProject} />
        <div className="lg:text-right">
          <p className="text-2xl font-medium tracking-[-0.025em]">{d.ctaLine}</p>
          <ButtonLink to={enquire} className="mt-5">
            Map your operations with us
          </ButtonLink>
          <div className="mt-6">
            <RelatedServices ids={d.related} />
          </div>
        </div>
      </section>
    </div>
  )
}

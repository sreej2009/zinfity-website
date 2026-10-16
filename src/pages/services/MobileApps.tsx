import { ButtonLink } from '@/components/ui/Button'
import { PhoneDemo } from '@/components/demos/PhoneDemo'
import { Faq, Headline, HowWeStart, ProjectTeaser, RelatedServices, ServiceMeta, ServiceSeo, TechList, useServicePage } from '@/components/service/kit'
import { PhonePanels, ReleaseJourney } from '@/components/service/visuals/mobile'
import { CapabilityPhone } from '@/components/service/visuals/upgrades'
import { BenefitPhones, PlatformPicker, WhyTeams } from '@/components/service/visuals/mobile-extra'

/** Mobile: light phone hero, platform decision, release journey, benefits, process. */
export default function MobileApps() {
  const { detail: d, enquire, root, head } = useServicePage('mobile')
  const compare = d.signature.kind === 'compare' ? d.signature : null

  return (
    <div ref={root}>
      <ServiceSeo id="mobile" />
      <header className="container-x grid gap-12 pb-20 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:items-center lg:pt-32">
        <div className="lg:col-span-6">
          <ServiceMeta id="mobile" />
          <h1 ref={head} className="mt-6 text-[clamp(2.6rem,5.2vw,5.4rem)] font-medium leading-[0.96] tracking-[-0.05em]">
            <Headline parts={d.headline} />
          </h1>
          <p className="text-lede mt-6 max-w-lg text-muted">{d.intro}</p>
          <ButtonLink to={enquire} className="mt-8">
            Talk about your app
          </ButtonLink>
        </div>
        <div className="lg:col-span-6">
          <PhonePanels>
            <PhoneDemo tone="light" />
          </PhonePanels>
        </div>
      </header>

      {compare && (
        <section aria-labelledby="compare" className="border-y border-line bg-canvas-alt py-20 lg:py-28">
          <div className="container-x">
            <h2 id="compare" className="max-w-2xl text-[clamp(2rem,3.6vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.04em]">
              {compare.title}
            </h2>
            <p className="mt-4 max-w-xl text-muted">{compare.intro}</p>
            <div className="mt-12">
              <PlatformPicker options={compare.options} />
            </div>
          </div>
        </section>
      )}

      {/* Release journey (illustrative stages) */}
      <section aria-labelledby="release" className="container-x py-20 lg:py-28">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="release" className="max-w-2xl text-[clamp(1.9rem,3.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em]">
            From first launch to the app store
          </h2>
          <p className="max-w-sm text-[0.92rem] text-muted">Illustrative screens. Store listings are prepared for your own developer accounts — nothing here is a live listing.</p>
        </div>
        <div className="mt-14">
          <ReleaseJourney />
        </div>
      </section>

      <BenefitPhones items={d.benefits} title="Why it pays to build it properly" />

      <WhyTeams items={d.problems} />

      <section aria-label="Build and release" className="border-t border-line py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-[clamp(1.8rem,2.8vw,2.6rem)] font-medium tracking-[-0.035em]">From prototype to store</h2>
            <ol className="mt-8 border-l border-line-strong">
              {d.process.map((p) => (
                <li key={p.name} data-reveal className="relative pb-8 pl-6 last:pb-0">
                  <span aria-hidden="true" className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
                  <h3 className="font-medium">{p.name}</h3>
                  <p className="mt-1 text-muted">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="eyebrow text-muted">Capabilities</h2>
            <div className="mt-6">
              <CapabilityPhone groups={d.capabilities} />
            </div>
            <h2 className="eyebrow mt-14 text-muted">Technology</h2>
            <TechList groups={d.tech} className="mt-6" />
          </div>
        </div>
      </section>

      <HowWeStart id="mobile" />

      <section aria-label="Questions and next step" className="border-t border-line bg-canvas-alt py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Faq items={d.faq} />
          </div>
          <div className="space-y-10 lg:col-span-4 lg:col-start-9">
            <ProjectTeaser id={d.relatedProject} />
            <p className="text-xl font-medium tracking-[-0.02em]">{d.ctaLine}</p>
            <ButtonLink to={enquire}>Start your app project</ButtonLink>
            <RelatedServices ids={d.related} />
          </div>
        </div>
      </section>
    </div>
  )
}

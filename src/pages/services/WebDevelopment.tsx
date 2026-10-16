import { ButtonLink } from '@/components/ui/Button'
import { ResponsiveDemo } from '@/components/demos/ResponsiveDemo'
import { Benefits, Faq, Headline, HowWeStart, ProjectTeaser, RelatedServices, ServiceMeta, ServiceSeo, TechList, useServicePage } from '@/components/service/kit'
import { FloatingDevices, LayerStack, SiteGallery } from '@/components/service/visuals/web'
import { WebAudit } from '@/components/service/visuals/upgrades'
import { ProcessTrack, SymptomFixer } from '@/components/service/visuals/web-extra'
import { Gauge, PenLine, Sprout } from 'lucide-react'

/** Web: live browser hero; site types, benefits, checklist, capabilities, symptoms, process, tech, first step. */
export default function WebDevelopment() {
  const { detail: d, enquire, root, head } = useServicePage('web')
  const checklist = d.signature.kind === 'checklist' ? d.signature : null

  return (
    <div ref={root}>
      <ServiceSeo id="web" />
      {/* Hero: headline beside a live browser that reflows as you scroll */}
      <header className="relative overflow-hidden pb-16 pt-[calc(var(--header-h)+3rem)] lg:pb-24 lg:pt-32">
        <div aria-hidden="true" className="pointer-events-none absolute right-[-10%] top-0 -z-10 h-[40rem] w-[60rem] rounded-full bg-[radial-gradient(closest-side,rgb(199_155_105/0.16),transparent)]" />
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <ServiceMeta id="web" />
            <h1 ref={head} className="mt-6 text-[clamp(2.5rem,4.4vw,4.6rem)] font-medium leading-[0.96] tracking-[-0.05em]">
              <Headline parts={d.headline} />
            </h1>
            <p className="mt-6 max-w-md leading-relaxed text-muted">{d.intro}</p>
            <ButtonLink to={enquire} className="mt-8">
              Plan your website
            </ButtonLink>
          </div>
          <div className="lg:col-span-7">
            <FloatingDevices>
              <ResponsiveDemo tone="light" compact />
            </FloatingDevices>
            <p className="mt-4 text-[0.8rem] text-subtle">Choose a device to see the layout adapt.</p>
          </div>
        </div>
      </header>

      {/* Website types: interactive layered gallery */}
      <section aria-labelledby="site-types" className="border-y border-line bg-canvas-alt py-20 lg:py-28">
        <div className="container-x">
          <h2 id="site-types" className="mb-12 text-[clamp(1.9rem,3vw,2.8rem)] font-medium tracking-[-0.035em]">
            Websites we build
          </h2>
          <SiteGallery />
        </div>
      </section>

      <Benefits items={d.benefits} variant="icons" icons={[PenLine, Gauge, Sprout]} />

      {checklist && (
        <section aria-labelledby="includes" className="container-x py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 id="includes" className="text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">
                {checklist.title}
              </h2>
              <p className="mt-4 text-muted">{checklist.intro}</p>
            </div>
            <div className="lg:col-span-12">
              <WebAudit items={checklist.items} />
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="web-capabilities" className="container-x py-20 lg:py-28">
        <p className="eyebrow text-muted">Capabilities</p>
        <h2 id="web-capabilities" className="mt-4 mb-12 max-w-2xl text-[clamp(1.8rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">
          Everything a website project needs
        </h2>
        <LayerStack groups={d.capabilities} />
      </section>

      <section aria-labelledby="symptoms" className="border-y border-line bg-canvas-alt py-20 lg:py-28">
        <div className="container-x">
          <h2 id="symptoms" className="text-[clamp(1.9rem,3vw,2.8rem)] font-medium tracking-[-0.035em]">
            Symptoms we fix
          </h2>
          <p className="mt-4 max-w-xl text-muted">Pick a symptom to see what it looks like today — and what changes once it is fixed.</p>
          <div className="mt-12">
            <SymptomFixer items={d.problems} />
          </div>
        </div>
      </section>

      <section aria-labelledby="process" className="container-x py-20 lg:py-28">
        <p className="eyebrow text-muted">Process</p>
        <h2 id="process" className="mt-4 mb-14 text-[clamp(1.9rem,3vw,2.8rem)] font-medium tracking-[-0.035em]">
          How a website project runs
        </h2>
        <ProcessTrack steps={d.process} />
      </section>

      <section aria-label="Technology and questions" className="border-t border-line py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="eyebrow text-muted">Technology</h2>
            <TechList groups={d.tech} className="mt-6" />
            <div className="mt-12">
              <ProjectTeaser id={d.relatedProject} />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="eyebrow text-muted">Questions</h2>
            <Faq items={d.faq} className="mt-6" />
          </div>
        </div>
      </section>

      <HowWeStart id="web" />

      <section aria-label="Next step" className="container-x border-t border-line py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[clamp(1.5rem,2.4vw,2.1rem)] font-medium tracking-[-0.03em]">{d.ctaLine}</p>
          <ButtonLink to={enquire}>Start your website project</ButtonLink>
        </div>
        <div className="mt-8">
          <RelatedServices ids={d.related} />
        </div>
      </section>
    </div>
  )
}

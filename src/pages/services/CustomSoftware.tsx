import { ButtonLink } from '@/components/ui/Button'
import { ArchitectureDemo } from '@/components/demos/ArchitectureDemo'
import { BlueprintLayers, ModuleMap } from '@/components/service/visuals/software'
import { DeliveryRoadmap, SituationCards } from '@/components/service/visuals/software-extra'
import { Faq, Headline, HowWeStart, ProjectTeaser, RelatedServices, ServiceMeta, ServiceSeo, TechList, useServicePage } from '@/components/service/kit'

/** Custom software: architecture first — a layered platform you can explore. */
export default function CustomSoftware() {
  const { detail: d, enquire, root, head } = useServicePage('software')
  const layers = d.signature.kind === 'layers' ? d.signature : null

  return (
    <div ref={root}>
      <ServiceSeo id="software" />
      {/* Hero: blueprint grid with the architecture in the first viewport */}
      <header className="relative overflow-hidden pb-14 pt-[calc(var(--header-h)+3rem)] lg:pb-20 lg:pt-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              'linear-gradient(rgb(140 94 52 / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(140 94 52 / 0.07) 1px, transparent 1px), linear-gradient(rgb(140 94 52 / 0.035) 1px, transparent 1px), linear-gradient(90deg, rgb(140 94 52 / 0.035) 1px, transparent 1px)',
            backgroundSize: '96px 96px, 96px 96px, 24px 24px, 24px 24px',
            maskImage: 'linear-gradient(180deg, #000 55%, transparent)',
          }}
        />
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <ServiceMeta id="software" />
            <h1 ref={head} className="mt-6 text-[clamp(2.5rem,4.4vw,4.6rem)] font-medium leading-[0.96] tracking-[-0.05em]">
              <Headline parts={d.headline} />
            </h1>
            <p className="mt-6 max-w-md leading-relaxed text-muted">{d.intro}</p>
            <ButtonLink to={enquire} className="mt-8">
              Discuss your platform
            </ButtonLink>
            <p className="mt-10 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-subtle">Drawing ZT-03 · Platform layers · Illustrative</p>
          </div>
          <div className="lg:col-span-7">
            <ArchitectureDemo tone="light" blueprint />
          </div>
        </div>
      </header>

      <section aria-label="Platform layers" className="container-x">
        {layers && (
          <div className="mt-14 lg:mt-20">
            <p className="eyebrow text-muted">{layers.title}</p>
            <h2 className="mt-4 mb-10 max-w-xl text-[clamp(1.7rem,2.6vw,2.4rem)] font-medium leading-[1.08] tracking-[-0.03em]">{layers.intro}</h2>
            <BlueprintLayers layers={layers.layers} />
          </div>
        )}
      </section>

      <section aria-labelledby="situations" className="mt-24 border-y border-line bg-canvas-alt py-20 lg:py-28">
        <div className="container-x">
          <p className="eyebrow text-muted">Situations we are asked to fix</p>
          <h2 id="situations" className="mt-4 mb-4 max-w-2xl text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">
            Sound familiar?
          </h2>
          <p className="mb-12 max-w-xl text-muted">Hover or tap a situation to see what changes once it is fixed.</p>
          <SituationCards items={d.problems} />
        </div>
      </section>

      <section aria-label="What we build" className="container-x py-20 lg:py-28">
        <h2 className="mb-12 text-center text-[clamp(1.8rem,3vw,2.8rem)] font-medium tracking-[-0.035em]">What we build</h2>
        <ModuleMap groups={d.capabilities} />
        <div className="mt-16 grid gap-6 border-t border-fg pt-8 md:grid-cols-3">
          {d.benefits.map((b) => (
            <div key={b.title} data-reveal>
              <h3 className="font-medium">{b.title}</h3>
              <p className="mt-1 text-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Delivery" className="border-t border-line py-20 lg:py-28">
        <div className="container-x">
          <p className="eyebrow text-muted">Delivery</p>
          <h2 className="mt-4 mb-12 text-[clamp(1.9rem,3vw,2.8rem)] font-medium tracking-[-0.035em]">How delivery runs</h2>
          <DeliveryRoadmap steps={d.process} />
          <div className="mt-20 grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <TechList groups={d.tech} />
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <Faq items={d.faq} />
            </div>
          </div>
        </div>
      </section>

      <HowWeStart id="software" tone="alt" />

      <section aria-label="Next step" className="theme-dark bg-canvas py-16 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium tracking-[-0.03em]">{d.ctaLine}</p>
            <ButtonLink to={enquire} className="mt-6">
              Start the conversation
            </ButtonLink>
          </div>
          <div className="space-y-6 lg:col-span-6 lg:col-start-7">
            <ProjectTeaser id={d.relatedProject} />
            <RelatedServices ids={d.related} />
          </div>
        </div>
      </section>
    </div>
  )
}

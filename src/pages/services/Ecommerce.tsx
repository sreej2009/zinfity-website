import { ButtonLink } from '@/components/ui/Button'
import { StorefrontDemo } from '@/components/demos/StorefrontDemo'
import { Faq, Headline, ProjectTeaser, RelatedServices, ServiceMeta, ServiceSeo, TechList, pad, useServicePage } from '@/components/service/kit'

/** E-commerce: product presentation first; then the full buyer and operator journey. */
export default function Ecommerce() {
  const { detail: d, enquire, root, head } = useServicePage('commerce')
  const journey = d.signature.kind === 'journey' ? d.signature : null

  return (
    <div ref={root}>
      <ServiceSeo id="commerce" />
      <header className="container-x grid gap-12 pb-16 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:items-center lg:pt-32">
        <div className="lg:col-span-7 lg:order-2">
          <StorefrontDemo />
        </div>
        <div className="lg:col-span-5 lg:order-1">
          <ServiceMeta id="commerce" />
          <h1 ref={head} className="mt-6 text-[clamp(2.6rem,5vw,5.2rem)] font-medium leading-[0.96] tracking-[-0.05em]">
            <Headline parts={d.headline} />
          </h1>
          <p className="mt-6 leading-relaxed text-muted">{d.intro}</p>
          <ButtonLink to={enquire} className="mt-8">
            Plan your store
          </ButtonLink>
        </div>
      </header>

      {journey && (
        <section aria-labelledby="journey" className="theme-dark bg-canvas py-20 lg:py-28">
          <div className="container-x">
            <h2 id="journey" className="max-w-3xl text-[clamp(2rem,3.6vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.04em]">
              {journey.title}
            </h2>
            <p className="mt-4 max-w-xl text-muted">{journey.intro}</p>
            <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-5">
              {journey.steps.map((s, i) => (
                <li key={s.name} data-reveal className="bg-canvas p-6">
                  <p className="font-mono text-[0.72rem] text-accent">{pad(i + 1)}</p>
                  <h3 className="mt-8 text-xl font-medium">{s.name}</h3>
                  <p className="mt-2 text-[0.94rem] leading-relaxed text-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section aria-label="Common problems" className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <h2 className="text-[clamp(1.8rem,2.8vw,2.6rem)] font-medium leading-[1.05] tracking-[-0.035em] lg:col-span-4">Where stores lose customers — and time</h2>
        <ul className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
          {d.problems.map((p) => (
            <li key={p.title} data-reveal className="border-t-2 border-fg pt-5">
              <h3 className="font-medium">{p.title}</h3>
              <p className="mt-2 text-[0.94rem] text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Capabilities" className="border-y border-line bg-canvas-alt py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            {d.capabilities.map((c) => (
              <div key={c.group} data-reveal>
                <h3 className="eyebrow text-accent-ink">{c.group}</h3>
                <ul className="mt-4 space-y-2">
                  {c.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="lg:col-span-4">
            <TechList groups={d.tech} />
          </div>
        </div>
      </section>

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

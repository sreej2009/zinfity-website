import { ButtonLink } from '@/components/ui/Button'
import { ArchitectureDemo } from '@/components/demos/ArchitectureDemo'
import { Faq, Headline, ProjectTeaser, RelatedServices, ServiceMeta, ServiceSeo, TechList, pad, useServicePage } from '@/components/service/kit'

/** Custom software: architecture first — a layered platform you can explore. */
export default function CustomSoftware() {
  const { detail: d, enquire, root, head } = useServicePage('software')
  const layers = d.signature.kind === 'layers' ? d.signature : null

  return (
    <div ref={root}>
      <ServiceSeo id="software" />
      <header className="container-x pb-14 pt-[calc(var(--header-h)+3rem)] lg:pt-36">
        <ServiceMeta id="software" />
        <h1 ref={head} className="mt-6 max-w-6xl text-[clamp(2.6rem,6.4vw,6.6rem)] font-medium leading-[0.94] tracking-[-0.055em]">
          <Headline parts={d.headline} />
        </h1>
        <div className="mt-10 grid gap-8 border-t border-line pt-8 lg:grid-cols-12">
          <p className="text-lede text-muted lg:col-span-7">{d.intro}</p>
          <div className="lg:col-span-4 lg:col-start-9 lg:text-right">
            <ButtonLink to={enquire}>Discuss your platform</ButtonLink>
          </div>
        </div>
      </header>

      <section aria-label="Platform architecture" className="container-x">
        <ArchitectureDemo />
        {layers && (
          <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {layers.layers.map((l, i) => (
              <div key={l.name} data-reveal>
                <dt className="flex items-baseline gap-3">
                  <span className="font-mono text-[0.75rem] text-accent-ink">L{i + 1}</span>
                  <span className="font-medium">{l.name}</span>
                </dt>
                <dd className="mt-2 text-[0.94rem] leading-relaxed text-muted">{l.body}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <section aria-labelledby="situations" className="mt-24 border-y border-line bg-canvas-alt py-20 lg:py-28">
        <div className="container-x">
          <h2 id="situations" className="eyebrow text-muted">
            Situations we are asked to fix
          </h2>
          <div className="mt-10 grid gap-x-14 gap-y-12 md:grid-cols-2">
            {d.problems.map((p, i) => (
              <blockquote key={p.title} data-reveal className="border-l-2 border-accent pl-6">
                <p className="font-serif text-[clamp(1.5rem,2.2vw,2rem)] italic leading-snug">“{p.title}.”</p>
                <footer className="mt-3 flex gap-3 text-muted">
                  <span className="font-mono text-[0.75rem] text-subtle">{pad(i + 1)}</span>
                  {p.body}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="What we build" className="container-x py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-3">
          {d.capabilities.map((c) => (
            <div key={c.group} data-reveal>
              <h2 className="text-2xl font-medium tracking-[-0.025em]">{c.group}</h2>
              <ul className="mt-5 border-t border-line">
                {c.items.map((x) => (
                  <li key={x} className="border-b border-line py-3">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <ol className="lg:col-span-6">
            {d.process.map((p, i) => (
              <li key={p.name} data-reveal className="flex gap-6 border-b border-line py-6 first:pt-0">
                <span className="text-4xl font-medium tracking-[-0.05em] text-accent-ink">{i + 1}</span>
                <div>
                  <h3 className="text-lg font-medium">{p.name}</h3>
                  <p className="mt-1 text-muted">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="lg:col-span-5 lg:col-start-8">
            <TechList groups={d.tech} />
            <Faq items={d.faq} className="mt-12" />
          </div>
        </div>
      </section>

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

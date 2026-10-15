import { ButtonLink } from '@/components/ui/Button'
import { DesignCanvasDemo } from '@/components/demos/DesignCanvasDemo'
import { Faq, Headline, ProjectTeaser, RelatedServices, ServiceMeta, ServiceSeo, TechList, pad, useServicePage } from '@/components/service/kit'

/** UI/UX: the design canvas leads; artefacts are presented like a portfolio index. */
export default function UiUxDesign() {
  const { detail: d, enquire, root, head } = useServicePage('uiux')
  const art = d.signature.kind === 'artifacts' ? d.signature : null

  return (
    <div ref={root}>
      <ServiceSeo id="uiux" />
      <header className="container-x grid gap-10 pb-12 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:pt-36">
        <div className="lg:col-span-12">
          <ServiceMeta id="uiux" />
        </div>
        <h1 ref={head} className="text-[clamp(2.8rem,7vw,7.4rem)] font-medium leading-[0.9] tracking-[-0.06em] lg:col-span-9">
          <Headline parts={d.headline} />
        </h1>
        <p className="leading-relaxed text-muted lg:col-span-3 lg:self-end">{d.intro}</p>
      </header>

      <div className="container-x">
        <DesignCanvasDemo />
      </div>

      {art && (
        <section aria-labelledby="artefacts" className="container-x py-20 lg:py-28">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 id="artefacts" className="text-[clamp(2rem,3.6vw,3.4rem)] font-medium tracking-[-0.04em]">
              {art.title}
            </h2>
            <p className="max-w-sm text-muted">{art.intro}</p>
          </div>
          <ol className="mt-12 grid gap-x-10 border-t border-fg sm:grid-cols-2 lg:grid-cols-3">
            {art.items.map((a, i) => (
              <li key={a.name} data-reveal className="border-b border-line py-8">
                <p className="font-serif text-6xl italic leading-none text-accent-ink">{pad(i + 1)}</p>
                <h3 className="mt-6 text-xl font-medium tracking-[-0.02em]">{a.name}</h3>
                <p className="mt-2 leading-relaxed text-muted">{a.body}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section aria-label="Why design matters" className="border-y border-line bg-canvas-alt py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="eyebrow text-muted">Without it</h2>
            <ul className="mt-6 space-y-6">
              {d.problems.map((p) => (
                <li key={p.title} data-reveal>
                  <p className="text-xl font-medium tracking-[-0.02em]">{p.title}</p>
                  <p className="mt-1 text-muted">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-accent-ink">With it</h2>
            <ul className="mt-6 space-y-6">
              {d.benefits.map((b) => (
                <li key={b.title} data-reveal>
                  <p className="text-xl font-medium tracking-[-0.02em]">{b.title}</p>
                  <p className="mt-1 text-muted">{b.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-label="Method and tools" className="container-x grid gap-14 py-20 lg:grid-cols-12 lg:py-28">
        <ol className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
          {d.process.map((p, i) => (
            <li key={p.name} data-reveal className="rounded-2xl border border-line p-6">
              <p className="font-mono text-[0.72rem] text-subtle">Phase {i + 1}</p>
              <h3 className="mt-3 text-xl font-medium">{p.name}</h3>
              <p className="mt-2 text-muted">{p.body}</p>
            </li>
          ))}
        </ol>
        <div className="lg:col-span-4 lg:col-start-9">
          <TechList groups={d.tech} />
          <Faq items={d.faq} className="mt-10" />
        </div>
      </section>

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

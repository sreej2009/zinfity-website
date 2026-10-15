import { ButtonLink } from '@/components/ui/Button'
import { ResponsiveDemo } from '@/components/demos/ResponsiveDemo'
import { Faq, Headline, ProjectTeaser, RelatedServices, ServiceMeta, ServiceSeo, TechList, pad, useServicePage } from '@/components/service/kit'

/** Web: the responsive browser demo leads; checklist, symptoms, process and tech follow. */
export default function WebDevelopment() {
  const { detail: d, enquire, root, head } = useServicePage('web')
  const checklist = d.signature.kind === 'checklist' ? d.signature : null

  return (
    <div ref={root}>
      <ServiceSeo id="web" />
      <header className="container-x pb-12 pt-[calc(var(--header-h)+3rem)] lg:pt-36">
        <ServiceMeta id="web" />
        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h1 ref={head} className="text-[clamp(2.6rem,5.8vw,6rem)] font-medium leading-[0.95] tracking-[-0.05em] lg:col-span-8">
            <Headline parts={d.headline} />
          </h1>
          <div className="lg:col-span-4">
            <p className="leading-relaxed text-muted">{d.intro}</p>
            <ButtonLink to={enquire} className="mt-6">
              Plan your website
            </ButtonLink>
          </div>
        </div>
      </header>

      <div className="container-x">
        <ResponsiveDemo />
      </div>

      {checklist && (
        <section aria-labelledby="includes" className="container-x py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 id="includes" className="text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">
                {checklist.title}
              </h2>
              <p className="mt-4 text-muted">{checklist.intro}</p>
            </div>
            <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
              {checklist.items.map((it, i) => (
                <li key={it.title} data-reveal className="grid grid-cols-[2.5rem_1fr] border-t border-line py-6">
                  <span className="font-mono text-[0.78rem] text-accent-ink">{pad(i + 1)}</span>
                  <div>
                    <h3 className="text-lg font-medium tracking-[-0.015em]">{it.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-muted">{it.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section aria-labelledby="symptoms" className="border-y border-line bg-canvas-alt py-20 lg:py-28">
        <div className="container-x">
          <h2 id="symptoms" className="text-[clamp(1.9rem,3vw,2.8rem)] font-medium tracking-[-0.035em]">
            Symptoms we fix
          </h2>
          <table className="mt-10 w-full border-collapse text-left">
            <thead className="sr-only">
              <tr>
                <th scope="col">Symptom</th>
                <th scope="col">What it means</th>
              </tr>
            </thead>
            <tbody>
              {d.problems.map((p) => (
                <tr key={p.title} data-reveal className="border-t border-fg/80 align-top max-md:flex max-md:flex-col">
                  <th scope="row" className="w-1/2 py-6 pr-8 text-xl font-medium tracking-[-0.02em] max-md:w-full max-md:pb-2">
                    {p.title}
                  </th>
                  <td className="py-6 leading-relaxed text-muted max-md:pt-0">{p.body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="process" className="container-x py-20 lg:py-28">
        <h2 id="process" className="eyebrow text-muted">
          How a website project runs
        </h2>
        <ol className="relative mt-10 grid gap-8 md:grid-cols-4">
          <span aria-hidden="true" className="absolute left-0 right-0 top-[0.45rem] hidden h-px bg-line-strong md:block" />
          {d.process.map((p, i) => (
            <li key={p.name} data-reveal className="relative">
              <span aria-hidden="true" className="relative block h-[0.95rem] w-[0.95rem] rounded-full border-2 border-canvas bg-accent-ink ring-1 ring-accent-ink" />
              <p className="eyebrow mt-5 text-subtle">Step {i + 1}</p>
              <h3 className="mt-2 text-xl font-medium tracking-[-0.02em]">{p.name}</h3>
              <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </ol>
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

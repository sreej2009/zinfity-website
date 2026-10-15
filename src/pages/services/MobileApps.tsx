import { ButtonLink } from '@/components/ui/Button'
import { PhoneDemo } from '@/components/demos/PhoneDemo'
import { Faq, Headline, ProjectTeaser, RelatedServices, ServiceMeta, ServiceSeo, TechList, useServicePage } from '@/components/service/kit'

/** Mobile: hero split with the phone demo; the platform decision is the centrepiece. */
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
          <PhoneDemo />
        </div>
      </header>

      {compare && (
        <section aria-labelledby="compare" className="border-y border-line bg-canvas-alt py-20 lg:py-28">
          <div className="container-x">
            <h2 id="compare" className="max-w-2xl text-[clamp(2rem,3.6vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.04em]">
              {compare.title}
            </h2>
            <p className="mt-4 max-w-xl text-muted">{compare.intro}</p>
            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[42rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-fg">
                    <th scope="col" className="sr-only">
                      Criteria
                    </th>
                    {compare.options.map((o, i) => (
                      <th key={o.name} scope="col" className="py-4 pr-6 text-xl font-medium tracking-[-0.02em]">
                        {o.name}
                        {i === 0 && <span className="eyebrow ml-3 align-middle text-[0.58rem] text-accent-ink">Usual start</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(['bestFor', 'consider'] as const).map((row) => (
                    <tr key={row} className="border-b border-line align-top">
                      <th scope="row" className="eyebrow w-28 py-6 pr-4 font-normal text-subtle">
                        {row === 'bestFor' ? 'Best for' : 'Consider'}
                      </th>
                      {compare.options.map((o) => (
                        <td key={o.name} className={`py-6 pr-6 leading-relaxed ${row === 'consider' ? 'text-muted' : ''}`}>
                          {o[row]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="why" className="container-x py-20 lg:py-28">
        <h2 id="why" className="eyebrow text-muted">
          Why teams come to us
        </h2>
        <ol className="mt-10 grid gap-12 md:grid-cols-3">
          {d.problems.map((p, i) => (
            <li key={p.title} data-reveal>
              <span className="metal-text text-[clamp(4rem,7vw,6.5rem)] font-medium leading-none tracking-[-0.06em]">{i + 1}</span>
              <h3 className="mt-4 text-xl font-medium tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

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
            <div className="mt-6 grid gap-8 sm:grid-cols-3">
              {d.capabilities.map((c) => (
                <div key={c.group}>
                  <h3 className="font-medium">{c.group}</h3>
                  <ul className="mt-3 space-y-1.5 text-[0.94rem] text-muted">
                    {c.items.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <h2 className="eyebrow mt-14 text-muted">Technology</h2>
            <TechList groups={d.tech} className="mt-6" />
          </div>
        </div>
      </section>

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

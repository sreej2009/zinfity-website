import { ButtonLink } from '@/components/ui/Button'
import { ErpDemo } from '@/components/demos/ErpDemo'
import { Faq, Headline, ProjectTeaser, RelatedServices, ServiceMeta, ServiceSeo, TechList, useServicePage } from '@/components/service/kit'

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
        <div className="mt-10 grid overflow-hidden rounded-2xl border border-line md:grid-cols-2">
          <div className="bg-canvas-alt p-8">
            <p className="eyebrow text-subtle">Before</p>
            <ul className="mt-6 space-y-6">
              {d.problems.map((p) => (
                <li key={p.title} data-reveal>
                  <p className="font-medium">{p.title}</p>
                  <p className="mt-1 text-muted">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface p-8">
            <p className="eyebrow text-accent-ink">After</p>
            <ul className="mt-6 space-y-6">
              {d.benefits.map((b) => (
                <li key={b.title} data-reveal>
                  <p className="font-medium">{b.title}</p>
                  <p className="mt-1 text-muted">{b.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {mod && (
        <section aria-labelledby="modules" className="border-y border-line py-20 lg:py-28">
          <div className="container-x">
            <h2 id="modules" className="eyebrow text-muted">
              {mod.title}
            </h2>
            <table className="mt-8 w-full border-collapse text-left">
              <thead className="sr-only">
                <tr>
                  <th scope="col">Module</th>
                  <th scope="col">What it does</th>
                </tr>
              </thead>
              <tbody>
                {mod.modules.map((m) => (
                  <tr key={m.name} className="border-b border-line">
                    <th scope="row" className="w-1/3 py-5 pr-6 text-lg font-medium">
                      {m.name}
                    </th>
                    <td className="py-5 text-muted">{m.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-8 text-[0.94rem] text-muted">
              <span className="eyebrow mr-3 text-accent-ink">Integrates with</span>
              {mod.integrations.join(' · ')}
            </p>
          </div>
        </section>
      )}

      <section aria-label="Rollout" className="py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-[clamp(1.8rem,2.6vw,2.4rem)] font-medium tracking-[-0.03em]">A careful rollout</h2>
            <ol className="mt-8 space-y-5">
              {d.process.map((p, i) => (
                <li key={p.name} data-reveal className="grid grid-cols-[2rem_1fr] gap-2">
                  <span className="font-mono text-[0.78rem] text-accent-ink">{i + 1}.</span>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-[0.94rem] text-muted">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-4">
            <h2 className="eyebrow text-muted">Platforms & tools</h2>
            <TechList groups={d.tech} className="mt-6" />
          </div>
          <div className="lg:col-span-4">
            <h2 className="eyebrow text-muted">Questions</h2>
            <Faq items={d.faq} className="mt-6" />
          </div>
        </div>
      </section>

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

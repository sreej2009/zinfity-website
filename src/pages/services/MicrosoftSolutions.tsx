import { ArrowRight, Check } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Faq, Headline, HowWeStart, RelatedServices, ServiceMeta, ServiceSeo, TechList, useServicePage } from '@/components/service/kit'
import { MsEcosystem, MsExtraVisual, MsHeroStack, MsImplementation, MsScenarios, msIcons, msShort } from '@/components/service/visuals/microsoft'
import { productVisuals } from '@/components/service/visuals/microsoft-products'
import { msExtras, msProducts } from '@/content/microsoft'
import { useScroll } from '@/lib/scroll'

/** Microsoft Solutions: one page covering the Microsoft products we plan, configure and connect. */
export default function MicrosoftSolutions() {
  const { detail: d, enquire, root, head } = useServicePage('microsoft')
  const { scrollTo } = useScroll()

  return (
    <div ref={root}>
      <ServiceSeo id="microsoft" />

      {/* Hero */}
      <header className="relative overflow-hidden pb-16 pt-[calc(var(--header-h)+3rem)] lg:pb-24 lg:pt-32">
        <div aria-hidden="true" className="pointer-events-none absolute right-[-15%] top-0 -z-10 h-[44rem] w-[64rem] rounded-full bg-[radial-gradient(closest-side,rgb(199_155_105/0.16),transparent)]" />
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <ServiceMeta id="microsoft" />
            <h1 ref={head} className="mt-6 text-[clamp(2.5rem,4.6vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.05em]">
              <Headline parts={d.headline} />
            </h1>
            <p className="mt-6 max-w-md leading-relaxed text-muted">{d.intro}</p>
            <ButtonLink to={enquire} className="mt-8">
              Discuss your Microsoft requirements
            </ButtonLink>
          </div>
          <div className="lg:col-span-7">
            <MsHeroStack />
          </div>
        </div>

        {/* On this page: jump to a product */}
        <nav aria-label="Microsoft products on this page" className="container-x mt-14">
          <ul className="flex flex-wrap gap-2">
            {msProducts.map((p) => {
              const I = msIcons[p.id]
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(`ms-${p.id}`)}
                    className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-[0.88rem] transition-colors hover:border-fg"
                  >
                    <I size={14} className="text-accent-ink" aria-hidden="true" />
                    {msShort[p.id]}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>

      {/* Ecosystem */}
      <section aria-labelledby="ms-ecosystem" className="theme-dark bg-canvas py-20 lg:py-28">
        <div className="container-x">
          <div className="mb-14 max-w-2xl">
            <p className="eyebrow text-accent">The ecosystem</p>
            <h2 id="ms-ecosystem" className="mt-4 text-[clamp(1.9rem,3.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em]">
              Six products, connected around your business
            </h2>
            <p className="mt-4 text-muted">Select a product to see its role and the products it most often works with. Connections show typical patterns, not a fixed design.</p>
          </div>
          <MsEcosystem />
        </div>
      </section>

      {/* Before → after */}
      <section aria-labelledby="ms-change" className="container-x py-20 lg:py-28">
        <h2 id="ms-change" className="max-w-2xl text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">
          From disconnected tools to one working system
        </h2>
        <ol className="mt-12 space-y-4">
          {d.problems.map((p, i) => {
            const b = d.benefits[i]
            return (
              <li key={p.title} data-reveal className="group grid overflow-hidden rounded-2xl border border-line md:grid-cols-[1fr_auto_1fr]">
                <div className="bg-canvas-alt p-6">
                  <p className="eyebrow text-[0.62rem] text-subtle">Today</p>
                  <h3 className="mt-2 font-medium">{p.title}</h3>
                  <p className="mt-1 text-[0.94rem] text-muted">{p.body}</p>
                </div>
                <span aria-hidden="true" className="grid place-items-center bg-canvas-alt px-4 md:bg-gradient-to-r md:from-canvas-alt md:to-surface">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-line-strong bg-canvas transition-transform duration-500 group-hover:translate-x-1 max-md:rotate-90">
                    <ArrowRight size={16} className="text-accent-ink" />
                  </span>
                </span>
                <div className="bg-surface p-6">
                  <p className="eyebrow text-[0.62rem] text-accent-ink">With a connected solution</p>
                  <h3 className="mt-2 font-medium">{b.title}</h3>
                  <p className="mt-1 text-[0.94rem] text-muted">{b.body}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      {/* Products */}
      {msProducts.map((p, i) => {
        const I = msIcons[p.id]
        const Visual = productVisuals[p.id]
        const flip = i % 2 === 1
        return (
          <section key={p.id} id={`ms-${p.id}`} aria-labelledby={`ms-${p.id}-title`} className={`scroll-mt-24 border-t border-line py-20 lg:py-28 ${flip ? 'bg-canvas-alt' : ''}`}>
            <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className={`lg:col-span-5 ${flip ? 'lg:order-2 lg:col-start-8' : ''}`}>
                <p className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-accent-ink">
                  <I size={14} aria-hidden="true" /> {String(i + 1).padStart(2, '0')} · {p.role}
                </p>
                <h2 id={`ms-${p.id}-title`} className="mt-4 text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">
                  {p.name}
                </h2>
                <p className="mt-4 leading-relaxed text-muted">{p.purpose}</p>
                <h3 className="eyebrow mt-8 text-subtle">Key capabilities</h3>
                <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {p.capabilities.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-[0.94rem]">
                      <Check size={14} className="mt-1 shrink-0 text-accent-ink" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
                <h3 className="eyebrow mt-8 text-subtle">Where it helps</h3>
                <ul className="mt-3 space-y-1.5 text-[0.94rem] text-muted">
                  {p.useCases.map((u) => (
                    <li key={u}>— {u}</li>
                  ))}
                </ul>
                <p className="mt-8 border-l-2 border-accent pl-4 text-[0.94rem] leading-relaxed">{p.fit}</p>
              </div>
              <div className={`lg:col-span-7 ${flip ? 'lg:order-1 lg:col-start-1' : ''}`}>
                <Visual />
              </div>
            </div>
          </section>
        )
      })}

      {/* Microsoft 365 */}
      <section aria-labelledby="ms-365" className="border-t border-line py-20 lg:py-28">
        <div className="container-x">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h2 id="ms-365" className="text-[clamp(1.8rem,2.8vw,2.6rem)] font-medium leading-[1.05] tracking-[-0.03em] lg:col-span-6">
              Across Microsoft 365, where it fits
            </h2>
            <p className="text-muted lg:col-span-5 lg:col-start-8">We bring apps, reports and AI into the tools your teams already use — as part of a wider project rather than as separate products.</p>
          </div>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {msExtras.map((x, i) => (
              <li key={x.name} data-reveal className="group rounded-2xl border border-line bg-surface p-3 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-line-strong">
                <div aria-hidden="true" className="h-36 overflow-hidden rounded-xl bg-canvas-alt">
                  <MsExtraVisual i={i} />
                </div>
                <div className="px-2 pb-2 pt-5">
                  <h3 className="text-lg font-medium">{x.name}</h3>
                  <p className="mt-1.5 text-[0.94rem] leading-relaxed text-muted">{x.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Use cases */}
      <section aria-labelledby="ms-cases" className="border-t border-line bg-canvas-alt py-20 lg:py-28">
        <div className="container-x">
          <p className="eyebrow text-muted">Business use cases</p>
          <h2 id="ms-cases" className="mt-4 mb-12 max-w-2xl text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">
            Which products work together for what
          </h2>
          <MsScenarios />
        </div>
      </section>

      {/* Implementation */}
      <section aria-labelledby="ms-process" className="py-20 lg:py-28">
        <div className="container-x">
          <h2 id="ms-process" className="mb-14 max-w-2xl text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">
            How a Microsoft project runs
          </h2>
          <MsImplementation steps={d.process} />
        </div>
      </section>

      <section aria-label="Tools and questions" className="container-x grid gap-14 border-t border-line py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-4">
          <TechList groups={d.tech} />
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Faq items={d.faq} />
        </div>
      </section>

      <HowWeStart id="microsoft" tone="alt" />

      <section aria-label="Next step" className="theme-dark bg-canvas py-16 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium tracking-[-0.03em]">{d.ctaLine}</p>
            <ButtonLink to={enquire} className="mt-6">
              Discuss your Microsoft requirements
            </ButtonLink>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <RelatedServices ids={d.related} />
          </div>
        </div>
        <p className="container-x mt-12 text-[0.75rem] leading-relaxed text-subtle">
          Microsoft, Dynamics 365, Business Central, Power Apps, Power BI, Power Automate, Azure, Microsoft 365, SharePoint, Teams and Copilot are trademarks of the Microsoft group of companies.
          Zinfity Technologies is an independent company; this page does not imply a Microsoft partnership, certification or endorsement. Dashboards and workflows shown are illustrative.
        </p>
      </section>
    </div>
  )
}

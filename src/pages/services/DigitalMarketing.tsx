import { Link } from 'react-router'
import { ButtonLink } from '@/components/ui/Button'
import { CampaignDemo } from '@/components/demos/CampaignDemo'
import { Faq, Headline, RelatedServices, ServiceMeta, ServiceSeo, TechList, useServicePage } from '@/components/service/kit'

/** Digital marketing: the campaign journey, a continuous improvement loop and a capability matrix. */
export default function DigitalMarketing() {
  const { detail: d, enquire, root, head } = useServicePage('marketing')
  const r = 38

  return (
    <div ref={root}>
      <ServiceSeo id="marketing" />
      <header className="container-x pb-14 pt-[calc(var(--header-h)+3rem)] text-center lg:pt-36">
        <div className="flex justify-center">
          <div className="text-left">
            <ServiceMeta id="marketing" />
          </div>
        </div>
        <h1 ref={head} className="mx-auto mt-6 max-w-5xl text-[clamp(2.6rem,6.4vw,6.6rem)] font-medium leading-[0.94] tracking-[-0.055em]">
          <Headline parts={d.headline} />
        </h1>
        <p className="text-lede mx-auto mt-8 max-w-2xl text-muted">{d.intro}</p>
      </header>

      <div className="container-x">
        <CampaignDemo />
      </div>

      {/* The improvement loop */}
      <section aria-labelledby="loop" className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:items-center lg:py-28">
        <div className="lg:col-span-5">
          <h2 id="loop" className="text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">
            Marketing as a loop, not a launch
          </h2>
          <p className="mt-4 leading-relaxed text-muted">Every campaign feeds the next one. We review what the data shows and adjust — on a regular rhythm agreed with you.</p>
          <ul className="mt-8 space-y-4">
            {d.problems.map((p) => (
              <li key={p.title} data-reveal className="border-t border-line pt-4">
                <p className="font-medium">{p.title}</p>
                <p className="mt-1 text-[0.94rem] text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[min(28rem,calc(100vw-5rem))] lg:col-span-6 lg:col-start-7" aria-label="Audit, plan, launch, optimise — repeated" role="img">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle cx="50" cy="50" r={r} fill="none" stroke="#c9c2b6" strokeWidth="0.3" />
            <circle cx="50" cy="50" r={r} fill="none" stroke="#8c5e34" strokeWidth="0.6" pathLength={1} className="draw" style={{ animationDuration: '2.4s' }} />
          </svg>
          {d.process.map((p, i) => {
            const a = ((-90 + i * 90) * Math.PI) / 180
            return (
              <div
                key={p.name}
                className="absolute w-24 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line-strong bg-surface p-2 text-center text-[0.85rem] sm:w-36 sm:p-3 sm:text-base"
                style={{ left: `${50 + Math.cos(a) * r}%`, top: `${50 + Math.sin(a) * r}%` }}
              >
                <p className="font-mono text-[0.68rem] text-accent-ink">0{i + 1}</p>
                <p className="font-medium">{p.name}</p>
              </div>
            )
          })}
          <p className="absolute left-1/2 top-1/2 w-28 -translate-x-1/2 sm:w-40 -translate-y-1/2 text-center text-[0.85rem] text-muted">Each cycle starts from the last one’s evidence.</p>
        </div>
      </section>

      <section aria-labelledby="matrix" className="border-y border-line bg-canvas-alt py-20 lg:py-28">
        <div className="container-x">
          <h2 id="matrix" className="eyebrow text-muted">
            Capabilities
          </h2>
          <div className="mt-8 grid border-t border-fg md:grid-cols-3">
            {d.capabilities.map((c, i) => (
              <div key={c.group} data-reveal className={`py-8 md:px-8 ${i ? 'border-t border-line md:border-l md:border-t-0' : 'md:pl-0'}`}>
                <h3 className="text-2xl font-medium tracking-[-0.025em]">{c.group}</h3>
                <ul className="mt-5 space-y-2 text-muted">
                  {c.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Tools, questions and next step" className="container-x grid gap-14 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-5">
          <TechList groups={d.tech} />
          <p className="mt-10 text-[0.98rem] text-muted">
            Related reading in{' '}
            <Link to="/blog?category=Strategy" className="link-draw text-fg">
              the Journal
            </Link>
            .
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Faq items={d.faq} />
          <p className="mt-12 text-2xl font-medium tracking-[-0.025em]">{d.ctaLine}</p>
          <ButtonLink to={enquire} className="mt-5">
            Plan your growth
          </ButtonLink>
          <div className="mt-8">
            <RelatedServices ids={d.related} />
          </div>
        </div>
      </section>
    </div>
  )
}

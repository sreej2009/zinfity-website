import { ArrowRight, Eye, Lock, UserCheck } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { AutomationDemo } from '@/components/demos/AutomationDemo'
import { Faq, Headline, ProjectTeaser, RelatedServices, ServiceMeta, ServiceSeo, TechList, useServicePage } from '@/components/service/kit'

const responsible = [
  { icon: UserCheck, title: 'People stay in the loop', body: 'Automation prepares the work; a person approves decisions with financial, legal or customer impact.' },
  { icon: Lock, title: 'Data handled deliberately', body: 'Providers and settings are chosen around your data policies, and only what is needed is shared.' },
  { icon: Eye, title: 'Every step is visible', body: 'Automated actions are logged, so the process stays transparent and auditable.' },
]

/** AI & automation: manual vs. automated, then real before/after patterns and safeguards. */
export default function AiAutomation() {
  const { detail: d, enquire, root, head } = useServicePage('ai')
  const wf = d.signature.kind === 'workflows' ? d.signature : null

  return (
    <div ref={root}>
      <ServiceSeo id="ai" />
      <header className="container-x pb-14 pt-[calc(var(--header-h)+3rem)] lg:pt-36">
        <ServiceMeta id="ai" />
        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h1 ref={head} className="text-[clamp(2.6rem,6vw,6.2rem)] font-medium leading-[0.94] tracking-[-0.055em] lg:col-span-8">
            <Headline parts={d.headline} />
          </h1>
          <p className="leading-relaxed text-muted lg:col-span-4">{d.intro}</p>
        </div>
      </header>

      <section aria-label="Manual versus automated" className="container-x">
        <AutomationDemo />
      </section>

      {wf && (
        <section aria-labelledby="patterns" className="container-x py-20 lg:py-28">
          <h2 id="patterns" className="text-[clamp(1.9rem,3vw,2.8rem)] font-medium tracking-[-0.035em]">
            {wf.title}
          </h2>
          <p className="mt-3 max-w-2xl text-muted">{wf.intro}</p>
          <ul className="mt-10 border-t border-fg">
            {wf.examples.map((ex) => (
              <li key={ex.area} data-reveal className="grid gap-4 border-b border-line py-7 lg:grid-cols-12 lg:items-center">
                <h3 className="text-lg font-medium lg:col-span-2">{ex.area}</h3>
                <p className="text-muted line-through decoration-line-strong lg:col-span-4">{ex.before}</p>
                <ArrowRight size={18} aria-hidden="true" className="hidden text-accent-ink lg:col-span-1 lg:block lg:justify-self-center" />
                <p className="lg:col-span-5">
                  <span className="sr-only">After: </span>
                  {ex.after}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="responsible" className="theme-dark bg-canvas py-20 lg:py-28">
        <div className="container-x">
          <h2 id="responsible" className="max-w-2xl text-[clamp(1.9rem,3.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em]">
            Responsible by design
          </h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-3">
            {responsible.map((r) => (
              <li key={r.title} data-reveal>
                <r.icon size={22} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-medium">{r.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Getting started" className="container-x grid gap-14 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-5">
          <h2 className="text-[clamp(1.8rem,2.6vw,2.4rem)] font-medium tracking-[-0.03em]">Start small, prove it, then scale</h2>
          <ol className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-line">
            {d.process.map((p, i) => (
              <li key={p.name} data-reveal className="bg-canvas p-5">
                <p className="font-mono text-[0.7rem] text-accent-ink">0{i + 1}</p>
                <p className="mt-2 font-medium">{p.name}</p>
                <p className="mt-1 text-[0.9rem] text-muted">{p.body}</p>
              </li>
            ))}
          </ol>
          <ul className="mt-10 space-y-3">
            {d.problems.map((p) => (
              <li key={p.title} className="text-[0.94rem] text-muted">
                <span className="font-medium text-fg">{p.title}.</span> {p.body}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <TechList groups={d.tech} />
          <Faq items={d.faq} className="mt-10" />
        </div>
      </section>

      <section aria-label="Next step" className="container-x grid gap-10 border-t border-line py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-[clamp(1.6rem,2.6vw,2.3rem)] font-medium tracking-[-0.03em]">{d.ctaLine}</p>
          <ButtonLink to={enquire} className="mt-6">
            Find your first automation
          </ButtonLink>
          <div className="mt-6">
            <RelatedServices ids={d.related} />
          </div>
        </div>
        <ProjectTeaser id={d.relatedProject} />
      </section>
    </div>
  )
}

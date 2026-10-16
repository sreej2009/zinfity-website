import { Eye, ListChecks, Lock, ShieldCheck, UserCheck, Zap } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { AutomationDemo } from '@/components/demos/AutomationDemo'
import { Benefits, Faq, Headline, HowWeStart, ProjectTeaser, RelatedServices, ServiceMeta, ServiceSeo, TechList, useServicePage } from '@/components/service/kit'
import { WorkflowStrip } from '@/components/demos/WorkflowStrip'
import { SafeguardRings } from '@/components/service/visuals/ai'
import { FlipPatterns } from '@/components/service/visuals/upgrades'
import { NodeColumns, StepFlow } from '@/components/service/visuals/process'
import { Bot, Database, FlaskConical, Plug, Search, TrendingUp, Workflow } from 'lucide-react'

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
      <header className="container-x pb-12 pt-[calc(var(--header-h)+3rem)] lg:pt-36">
        <ServiceMeta id="ai" />
        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h1 ref={head} className="text-[clamp(2.6rem,6vw,6.2rem)] font-medium leading-[0.94] tracking-[-0.055em] lg:col-span-8">
            <Headline parts={d.headline} />
          </h1>
          <div className="lg:col-span-4">
            <p className="leading-relaxed text-muted">{d.intro}</p>
            <ButtonLink to={enquire} className="mt-6">
              Find your first automation
            </ButtonLink>
          </div>
        </div>
        {/* Problems, visible near the top */}
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3" aria-label="Problems this service solves">
          {d.problems.map((p, i) => (
            <li key={p.title} className="bg-canvas p-6">
              <p className="font-mono text-[0.7rem] text-accent-ink">Problem 0{i + 1}</p>
              <h2 className="mt-3 text-lg font-medium leading-snug">{p.title}</h2>
              <p className="mt-1.5 text-[0.92rem] leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </header>

      <section aria-label="Manual versus automated" className="container-x">
        <AutomationDemo />
      </section>

      {/* Before → after workflow with a human checkpoint */}
      <section aria-labelledby="ai-flow" className="py-20 lg:py-28">
        <div className="container-x">
          <h2 id="ai-flow" className="max-w-2xl text-[clamp(1.9rem,3.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em]">
            From messy inputs to routed, reviewed work
          </h2>
          <p className="mt-3 max-w-xl text-muted">An illustrative workflow — each automation is designed around your own systems and approval rules.</p>
          <WorkflowStrip />
        </div>
      </section>

      <Benefits items={d.benefits} variant="spotlight" icons={[ListChecks, Zap, ShieldCheck]} title="What automation gives back" />

      {wf && (
        <section aria-labelledby="patterns" className="container-x py-20 lg:py-28">
          <h2 id="patterns" className="text-[clamp(1.9rem,3vw,2.8rem)] font-medium tracking-[-0.035em]">
            {wf.title}
          </h2>
          <p className="mt-3 max-w-2xl text-muted">{wf.intro}</p>
          <div className="mt-10">
            <FlipPatterns examples={wf.examples} />
          </div>
        </section>
      )}

      <section aria-labelledby="responsible" className="theme-dark bg-canvas py-20 lg:py-28">
        <div className="container-x">
          <h2 id="responsible" className="max-w-2xl text-[clamp(1.9rem,3.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em]">
            Responsible by design
          </h2>
          <p className="mt-4 max-w-xl text-muted">Three safeguards wrap every automation we build — and they stay in place after launch.</p>
          <div className="mt-14">
            <SafeguardRings items={responsible} />
          </div>
        </div>
      </section>

      <section aria-labelledby="ai-capabilities" className="container-x py-20 lg:py-28">
        <p className="eyebrow text-muted">Capabilities</p>
        <h2 id="ai-capabilities" className="mt-4 mb-12 max-w-2xl text-[clamp(1.8rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">
          Automation, AI and the data behind it
        </h2>
        <NodeColumns groups={d.capabilities} icons={[Workflow, Bot, Database]} />
      </section>

      <section aria-label="Getting started" className="container-x grid gap-14 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-5">
          <h2 className="text-[clamp(1.8rem,2.6vw,2.4rem)] font-medium tracking-[-0.03em]">Start small, prove it, then scale</h2>
          <div className="mt-8">
            <StepFlow steps={d.process} icons={[Search, FlaskConical, Plug, TrendingUp]} variant="grow" columns={2} />
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <TechList groups={d.tech} />
          <Faq items={d.faq} className="mt-10" />
        </div>
      </section>

      <HowWeStart id="ai" tone="alt" />

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

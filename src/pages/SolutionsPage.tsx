import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { Seo } from '@/components/Seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { SystemsMap } from '@/sections/SystemsMap'
import { disciplines, layers, solutions } from '@/content/solutions'
import { serviceById, servicePath } from '@/content/services'
import { contactHref } from '@/lib/enquiry'
import { useReveal } from '@/hooks/useReveal'
import { useHeadlineReveal } from '@/hooks/useHeadlineReveal'

export default function SolutionsPage() {
  const root = useRef<HTMLDivElement>(null)
  const head = useRef<HTMLHeadingElement>(null)
  const [active, setActive] = useState(0)
  useReveal(root)
  useHeadlineReveal(head)
  const current = solutions[active]

  return (
    <div ref={root}>
      <Seo
        title="Solutions"
        description="How interfaces, applications, integrations, data and business operations connect — and the solution architectures Zinfity designs across them."
      />

      {/* The map is the page: compact title, then straight into the architecture */}
      <section aria-labelledby="sol-title" className="container-x pb-16 pt-[calc(var(--header-h)+3rem)] lg:pt-36">
        <Breadcrumbs items={[{ label: 'Solutions' }]} />
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h1 ref={head} id="sol-title" className="text-[clamp(2.4rem,4.8vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.045em] lg:col-span-7">
            One business. <span className="serif-accent metal-text">Five layers.</span> Every layer connected.
          </h1>
          <p className="text-lede text-muted lg:col-span-5">
            Problems rarely live in one tool. Choose a scenario to see the route it takes — from the screens people use down to the work itself.
          </p>
        </div>
        <div className="mt-12">
          <SystemsMap active={active} onChange={setActive} />
        </div>

        <div id="sol-panel" role="tabpanel" aria-labelledby={`sol-tab-${current.id}`} aria-live="polite" className="mt-10 grid gap-8 border-b border-line pb-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-accent-ink">Route · {current.path.join(' → ')}</p>
            <h2 className="text-title mt-4">{current.title}</h2>
          </div>
          <p className="leading-relaxed text-muted lg:col-span-4">{current.description}</p>
          <div className="lg:col-span-3">
            <p className="eyebrow text-subtle">Typical signs</p>
            <ul className="mt-3 space-y-2 text-[0.94rem]">
              {current.appliesTo.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Layer by layer: what each layer is for */}
      <section aria-labelledby="layers-title" className="py-20 lg:py-28">
        <div className="container-x">
          <h2 id="layers-title" className="max-w-3xl text-[clamp(1.9rem,3.4vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            What we design at each layer
          </h2>
          <ol className="mt-12">
            {layers.map((l, i) => (
              <li key={l.id} data-reveal className="grid gap-4 border-t border-line py-7 lg:grid-cols-12 lg:items-baseline">
                <span className="font-serif text-4xl italic leading-none text-accent-ink lg:col-span-1">{i + 1}</span>
                <h3 className="text-xl font-medium tracking-[-0.02em] lg:col-span-3">{l.name}</h3>
                <p className="leading-relaxed text-muted lg:col-span-5">{l.role}</p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[0.9rem] lg:col-span-3 lg:justify-end">
                  {l.services.map((id) => {
                    const s = serviceById(id)!
                    return (
                      <li key={id}>
                        <Link to={servicePath(s)} className="link-draw">
                          {s.short}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Disciplines as a dark band — how the team covers the layers */}
      <section aria-labelledby="disc-title" className="theme-dark bg-canvas py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="disc-title" className="text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">
              Four disciplines, <span className="serif-accent metal-text">one</span> plan.
            </h2>
            <p className="mt-5 leading-relaxed text-muted">Projects stall when these are handled by separate teams who rarely talk. We plan them together from the first conversation.</p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2 lg:col-span-8">
            {disciplines.map((d, i) => (
              <li key={d.id} data-reveal className="bg-canvas p-8">
                <p className="eyebrow text-subtle">0{i + 1}</p>
                <p className="mt-8 text-2xl font-medium tracking-[-0.02em]">{d.label}</p>
                <p className="mt-2 text-muted">{d.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing: start from the layer that hurts */}
      <section aria-labelledby="friction" className="container-x py-20 lg:py-28">
        <h2 id="friction" className="text-[clamp(1.6rem,2.8vw,2.4rem)] font-medium tracking-[-0.03em]">
          Which layer is causing the most friction?
        </h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {layers.map((l) => (
            <li key={l.id}>
              <Link
                to={contactHref({ service: serviceById(l.services[0])!.title })}
                className="inline-flex items-center gap-3 rounded-full border border-line-strong px-5 py-3 transition-colors hover:border-fg hover:bg-fg hover:text-canvas"
              >
                {l.name}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

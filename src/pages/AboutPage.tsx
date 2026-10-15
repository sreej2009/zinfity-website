import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Check } from 'lucide-react'
import { Seo } from '@/components/Seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Logo } from '@/components/ui/Logo'
import { ApproachTimeline } from '@/sections/Approach'
import { commitments, principles } from '@/content/about'
import { useReveal } from '@/hooks/useReveal'
import { useHeadlineReveal } from '@/hooks/useHeadlineReveal'

const workingModel = [
  { title: 'One accountable team', body: 'Strategy, design and engineering are handled together, without hand-offs between separate suppliers.' },
  { title: 'Visible progress', body: 'Short iterations, regular demos and shared boards — you always know where things stand.' },
  { title: 'Decisions in writing', body: 'Scope, trade-offs and changes are documented so nothing depends on memory.' },
  { title: 'Built to hand over', body: 'Documentation and clean code mean your team — or ours — can keep improving it.' },
]

function Chapter({ numeral, title, id, children, tone = 'light' }: { numeral: string; title: string; id: string; children: ReactNode; tone?: 'light' | 'alt' }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`border-t border-line py-20 lg:py-32 ${tone === 'alt' ? 'bg-canvas-alt' : ''}`}>
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-32">
            <p aria-hidden="true" className="font-serif text-[clamp(3.5rem,6vw,6rem)] italic leading-none text-accent-ink">
              {numeral}
            </p>
            <h2 id={`${id}-title`} className="eyebrow mt-4 text-muted">
              {title}
            </h2>
          </div>
        </div>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  const root = useRef<HTMLDivElement>(null)
  const head = useRef<HTMLHeadingElement>(null)
  useReveal(root)
  useHeadlineReveal(head)

  return (
    <div ref={root}>
      <Seo
        title="About"
        description="Zinfity Technologies is a design and engineering company. How we think, the principles we hold, and how we deliver projects."
      />

      {/* Manifesto */}
      <header className="container-x pb-20 pt-[calc(var(--header-h)+3rem)] lg:pb-28 lg:pt-40">
        <Breadcrumbs items={[{ label: 'About' }]} />
        <h1 ref={head} className="text-[clamp(2.4rem,6.4vw,6.8rem)] font-medium leading-[0.98] tracking-[-0.05em]">
          We are a design and engineering company. We build technology that <span className="serif-accent metal-text">works</span> — for people, for
          teams, for business.
        </h1>
      </header>

      <Chapter numeral="I" title="Position" id="position">
        <div className="grid gap-10 text-[1.1rem] leading-[1.75] text-[#3b3935] md:grid-cols-2" data-reveal>
          <p>
            Zinfity Technologies helps organisations turn ideas and everyday friction into digital products and connected systems. Our work spans
            websites and apps, custom software, ERP and CRM, digital marketing and automation — but the disciplines are a means, not the point.
          </p>
          <p>
            The point is usefulness. We start from how a business actually works: the people involved, the information they need and the steps that slow
            them down. Then we design and engineer what genuinely helps, and we stay to improve it once it is live.
          </p>
        </div>
      </Chapter>

      <Chapter numeral="II" title="Philosophy" id="philosophy" tone="alt">
        <p className="max-w-3xl text-[clamp(1.6rem,2.8vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.03em]" data-reveal>
          Good-looking software that is hard to maintain fails eventually. So does well-built software that nobody enjoys using. We hold both to one
          standard.
        </p>
        <ol className="mt-14 border-t border-fg">
          {principles.map((p, i) => (
            <li key={p.title} data-reveal className="group grid gap-4 border-b border-line py-8 md:grid-cols-12 md:items-baseline">
              <span className="font-mono text-[0.78rem] text-subtle md:col-span-1">0{i + 1}</span>
              <h3 className="text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-none tracking-[-0.04em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-2 md:col-span-5">
                {p.title}
              </h3>
              <p className="leading-relaxed text-muted md:col-span-6">{p.body}</p>
            </li>
          ))}
        </ol>
      </Chapter>

      <section id="approach" aria-labelledby="approach-title" className="border-t border-line py-20 lg:py-32">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <p aria-hidden="true" className="font-serif text-[clamp(3.5rem,6vw,6rem)] italic leading-none text-accent-ink">
                III
              </p>
              <h2 id="approach-title" className="eyebrow mt-4 text-muted">
                Method
              </h2>
            </div>
            <p className="text-lede text-muted lg:col-span-6">
              Five stages, each with a clear purpose and a visible output — so you always know where the work stands and what comes next.
            </p>
          </div>
          <div className="mt-16">
            <ApproachTimeline />
          </div>
        </div>
      </section>

      <Chapter numeral="IV" title="Working together" id="together" tone="alt">
        <dl className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          {workingModel.map((w) => (
            <div key={w.title} data-reveal className="border-t border-fg pt-5">
              <dt className="text-xl font-medium tracking-[-0.02em]">{w.title}</dt>
              <dd className="mt-2 leading-relaxed text-muted">{w.body}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-16 grid gap-x-10 sm:grid-cols-2" aria-label="What to expect">
          {commitments.map((c) => (
            <li key={c} data-reveal className="flex items-center gap-4 border-b border-line py-4">
              <Check size={16} aria-hidden="true" className="shrink-0 text-accent-ink" />
              {c}
            </li>
          ))}
        </ul>
      </Chapter>

      {/* Signature closing */}
      <section aria-label="Closing" className="container-x flex flex-col items-start gap-10 py-24 lg:flex-row lg:items-end lg:justify-between lg:py-32">
        <Logo variant="lockupOnLight" className="h-auto w-[min(100%,26rem)]" alt="Zinfity Technologies — Technology That Works Together." />
        <Link to="/contact" className="group inline-flex items-center gap-4 text-[clamp(1.3rem,2vw,1.8rem)] font-medium tracking-[-0.02em]">
          <span className="link-draw">Start a conversation</span>
          <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-full bg-fg text-canvas transition-transform duration-500 group-hover:rotate-[-45deg]">
            →
          </span>
        </Link>
      </section>
    </div>
  )
}

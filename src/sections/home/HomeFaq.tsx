import { useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Plus } from 'lucide-react'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: 'What services does Zinfity Technologies provide?',
    a: (
      <>
        Nine connected disciplines: website design and development, mobile apps, custom software, ERP and CRM, digital marketing, UI/UX design, e-commerce,
        AI and business automation, and Microsoft solutions. You can see each one on the{' '}
        <Link to="/services" className="link-draw text-fg">
          Services page
        </Link>
        .
      </>
    ),
  },
  {
    q: 'Can you build custom websites and mobile applications?',
    a: 'Yes. We design and build websites — from corporate sites to CMS-driven and multilingual builds — and iOS and Android apps, usually cross-platform unless a project needs native development.',
  },
  {
    q: 'Do you develop ERP, CRM and custom business software?',
    a: 'Yes. We implement and customise ERP and CRM platforms, and build custom portals, platforms and internal tools when off-the-shelf software doesn’t fit how a business works.',
  },
  {
    q: 'Can you implement Microsoft solutions such as Power BI, Dynamics 365, Business Central and Power Apps?',
    a: (
      <>
        Yes — we plan, configure and connect Dynamics 365, Business Central, Power Apps, Power BI, Power Automate and Azure. Which products fit depends on your
        processes and existing licences, which we confirm during discovery. Zinfity is an independent company, not a Microsoft partner. More on the{' '}
        <Link to="/services/microsoft-solutions" className="link-draw text-fg">
          Microsoft Solutions page
        </Link>
        .
      </>
    ),
  },
  {
    q: 'How does your project engagement process work?',
    a: 'Most projects start with a short discovery to understand goals, users and systems. We then agree scope and approach, design and build in short iterations with regular reviews, and launch with testing and handover. You can work with us on a defined project, a phased build or an ongoing partnership.',
  },
  {
    q: 'Can you work with an existing website or business application?',
    a: 'Yes. We often improve, extend or integrate existing systems rather than replacing them. We review what is there first, then recommend whether to refine, rebuild or connect it.',
  },
  {
    q: 'How can I request a project estimate?',
    a: (
      <>
        Tell us about your project through the{' '}
        <Link to="/contact" className="link-draw text-fg">
          contact page
        </Link>
        . Estimates depend on scope, so we usually ask a few questions or hold a short call before proposing costs and timelines.
      </>
    ),
  },
  {
    q: 'Do you provide ongoing maintenance and support?',
    a: 'Yes, where it is part of the agreement. Support can cover fixes, updates, monitoring and continued improvements; what is included is defined per project.',
  },
]

/** Home FAQ: numbered editorial accordion (one open at a time). */
export function HomeFaq() {
  const [open, setOpen] = useState<number | null>(0)
  const root = useRef<HTMLElement>(null)
  const uid = useId()

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.from('[data-faq-row]', { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="home-faq-title" className="border-t border-line py-24 lg:py-36">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow text-accent-ink">FAQ</p>
            <h2 id="home-faq-title" className="mt-5 text-[clamp(2.2rem,4vw,3.8rem)] font-medium leading-[1] tracking-[-0.045em]">
              Questions, <span className="serif-accent metal-text">answered.</span>
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-muted">
              The things businesses most often ask before starting a project with us. Something else on your mind?
            </p>
            <Link to="/contact" className="link-draw mt-4 inline-block text-fg">
              Ask us directly
            </Link>
          </div>
        </div>

        <ol className="border-t border-fg lg:col-span-8">
          {faqs.map((f, i) => {
            const isOpen = open === i
            const btn = `${uid}-q${i}`
            const panel = `${uid}-a${i}`
            return (
              <li key={f.q} data-faq-row className="border-b border-line">
                <h3>
                  <button
                    id={btn}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panel}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group grid w-full grid-cols-[2.75rem_1fr_auto] items-start gap-2 py-6 text-left sm:grid-cols-[4rem_1fr_auto]"
                  >
                    <span className={`pt-1 font-mono text-[0.78rem] transition-colors ${isOpen ? 'text-accent-ink' : 'text-subtle'}`}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={`text-[clamp(1.08rem,1.6vw,1.35rem)] font-medium leading-snug tracking-[-0.02em] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1`}>
                      {f.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid h-9 w-9 place-items-center rounded-full border transition-[background,border-color,color,transform] duration-500 ${
                        isOpen ? 'rotate-45 border-fg bg-fg text-canvas' : 'border-line-strong text-fg group-hover:border-fg'
                      }`}
                    >
                      <Plus size={16} />
                    </span>
                  </button>
                </h3>
                <div
                  id={panel}
                  role="region"
                  aria-labelledby={btn}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-7 pl-[2.75rem] pr-12 leading-relaxed text-muted sm:pl-[4rem]">{f.a}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { Seo } from '@/components/Seo'
import { pageMeta } from '@/content/seo'
import { ServicesHero } from '@/sections/services/ServicesHero'
import { EngagementModels } from '@/sections/services/EngagementModels'
import { ServiceStage } from '@/components/blocks/ServiceStage'
import { ArrowLink } from '@/components/blocks/ArrowLink'
import { services, servicePath, type Service } from '@/content/services'
import { notSureService } from '@/content/enquiry'
import { contactHref } from '@/lib/enquiry'
import { useReveal } from '@/hooks/useReveal'
import { ScrollTrigger, useGSAP } from '@/lib/gsap'

const pad = (n: number) => String(n).padStart(2, '0')

/** Mounts the illustration when the chapter scrolls into view so its drawing plays there. */
function ChapterStage({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { rootMargin: '0px 0px -20% 0px' })
    io.observe(ref.current!)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref}>
      {seen ? (
        <ServiceStage visual={service.visual} glowShift={index} aspect="aspect-[4/3]" bottomLeft={service.short} />
      ) : (
        <div className="aspect-[4/3] rounded-2xl bg-panel" />
      )}
    </div>
  )
}

export default function ServicesPage() {
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  useReveal(root)

  useGSAP(
    () => {
      services.forEach((s, i) =>
        ScrollTrigger.create({
          trigger: `#${s.slug}`,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => self.isActive && setActive(i),
        }),
      )
    },
    { scope: root },
  )

  return (
    <div ref={root}>
      <Seo {...pageMeta.services} />

      <ServicesHero />

      {/* Chapters with a sticky numbered rail */}
      <div className="container-x grid gap-x-12 pb-24 lg:grid-cols-12 lg:pb-36">
        <aside aria-hidden="true" className="hidden lg:col-span-2 lg:block">
          <div className="sticky top-32">
            <p className="font-medium leading-none tracking-[-0.06em] text-[clamp(4rem,7vw,7rem)]">
              <span className="metal-text">{pad(active + 1)}</span>
            </p>
            <ol className="mt-8 space-y-2">
              {services.map((s, i) => (
                <li key={s.id} className="flex items-center gap-3">
                  <span className={`h-px transition-all duration-700 ease-[var(--ease-out-expo)] ${i === active ? 'w-8 bg-accent-ink' : 'w-3 bg-line-strong'}`} />
                  <span className={`text-[0.8rem] transition-colors duration-500 ${i === active ? 'text-fg' : 'text-subtle'}`}>{s.short}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className="lg:col-span-10">
          {services.map((s, i) => (
            <article key={s.id} id={s.slug} aria-labelledby={`${s.slug}-title`} className="border-t border-line py-16 lg:py-24">
              <div className={`grid items-center gap-10 lg:grid-cols-10 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <div className="lg:col-span-5" data-reveal>
                  <ChapterStage service={s} index={i} />
                </div>
                <div className="lg:col-span-5" data-reveal>
                  <p className="eyebrow text-accent-ink lg:hidden">{pad(i + 1)}</p>
                  <h2 id={`${s.slug}-title`} className="text-title mt-3 lg:mt-0">
                    <Link to={servicePath(s)} className="link-draw">
                      {s.title}
                    </Link>
                  </h2>
                  <p className="mt-5 leading-relaxed text-muted">{s.description}</p>
                  <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-[0.92rem]" aria-label={`${s.title} includes`}>
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex items-center gap-2">
                        <span className="h-px w-3 bg-accent-ink" aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                    <ArrowLink to={servicePath(s)} label={`Explore ${s.title}`}>
                      Explore the service
                    </ArrowLink>
                    <Link
                      to={contactHref({ service: s.title })}
                      aria-label={`Enquire about ${s.title}`}
                      className="inline-flex items-center gap-1.5 text-[0.9rem] text-muted transition-colors hover:text-fg"
                    >
                      Enquire <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <EngagementModels />

      {/* Directory-specific closing */}
      <section aria-label="Not sure which service" className="container-x py-20 lg:py-28">
        <p className="max-w-4xl text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-[1.15] tracking-[-0.03em]">
          Not sure which chapter you need?{' '}
          <Link to={contactHref({ service: notSureService })} className="text-accent-ink underline decoration-1 underline-offset-[0.2em]">
            Describe the problem instead
          </Link>{' '}
          — we’ll suggest the right combination.
        </p>
      </section>
    </div>
  )
}

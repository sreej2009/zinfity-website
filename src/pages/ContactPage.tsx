import { Link } from 'react-router'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Seo } from '@/components/Seo'
import { pageMeta } from '@/content/seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { site } from '@/config/site'
import { SocialIcon } from '@/components/ui/SocialIcon'

const nextSteps = ['We read every enquiry in full', 'We reply with questions or a call invitation', 'You receive a clear scope and plan']

/** Contact: one job — turn interest into an enquiry. No marketing sections. */
export default function ContactPage() {
  const c = site.contact
  return (
    <div>
      <Seo {...pageMeta.contact} />
      <section aria-labelledby="contact-title" className="container-x pb-24 pt-[calc(var(--header-h)+3rem)] lg:pb-32 lg:pt-36">
        <Breadcrumbs items={[{ label: 'Contact' }]} />
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h1 id="contact-title" className="text-[clamp(2.2rem,4vw,3.8rem)] font-medium leading-[1] tracking-[-0.045em]">
              Tell us what you’re <span className="serif-accent metal-text">building.</span>
            </h1>
            <p className="mt-6 max-w-sm leading-relaxed text-muted">A few details are enough to start. We’ll come back with questions, thoughts and a sensible next step.</p>

            <ol className="mt-10 space-y-3 text-[0.94rem]" aria-label="What happens next">
              {nextSteps.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="font-mono text-[0.75rem] leading-6 text-accent-ink">0{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>

            {(c.email || c.phone || c.location) && (
              <address className="mt-10 space-y-3 border-t border-line pt-8 not-italic">
                {c.email && (
                  <a href={`mailto:${c.email}`} className="flex items-center gap-3">
                    <Mail size={16} className="text-accent-ink" aria-hidden="true" />
                    <span className="link-draw">{c.email}</span>
                  </a>
                )}
                {c.phone && (
                  <a href={`tel:${c.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3">
                    <Phone size={16} className="text-accent-ink" aria-hidden="true" />
                    <span className="link-draw">{c.phone}</span>
                  </a>
                )}
                {c.location && (
                  <p className="flex items-start gap-3 leading-relaxed text-muted">
                    <MapPin size={16} className="mt-1 shrink-0 text-accent-ink" aria-hidden="true" />
                    <span>
                      <span className="block font-medium text-fg">{site.name}</span>
                      {c.location}
                    </span>
                  </p>
                )}
                <ul className="flex gap-3 pt-4" aria-label="Chat and social media">
                  {[...(c.whatsapp ? [{ label: 'WhatsApp', href: `https://wa.me/${c.whatsapp}` }] : []), ...site.socials].map((so) => (
                    <li key={so.label}>
                      <a
                        href={so.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${so.label === 'WhatsApp' ? 'Chat on WhatsApp' : `Zinfity Technologies on ${so.label}`} (opens in a new tab)`}
                        title={so.label}
                        className="grid h-12 w-12 place-items-center rounded-full border border-line-strong bg-surface text-fg transition-[background,border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-fg hover:bg-fg hover:text-accent"
                      >
                        <SocialIcon label={so.label} size={20} />
                      </a>
                    </li>
                  ))}
                </ul>
              </address>
            )}
          </div>

          <div id="enquiry" className="lg:col-span-8 xl:col-span-7 xl:col-start-6">
            <div className="rounded-[1.5rem] border border-line bg-surface p-6 shadow-[0_40px_80px_-50px_rgb(23_23_23/0.35)] sm:p-10">
              <h2 className="eyebrow mb-8 text-muted">Project enquiry</h2>
              <EnquiryForm />
            </div>
            <p className="mt-5 text-[0.88rem] text-muted">
              Looking for a job instead?{' '}
              <Link to="/careers" className="link-draw text-fg">
                Visit careers
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

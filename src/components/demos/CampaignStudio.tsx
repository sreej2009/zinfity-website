import { useRef } from 'react'
import { Heart, Mail, MessageCircle, Search } from 'lucide-react'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

/**
 * Digital marketing hero: illustrative campaign assets across channels,
 * connected into one reporting view. Metric names only — no numbers or results.
 */
export function CampaignStudio() {
  const root = useRef<HTMLDivElement>(null)
  const bar = (w: string, o = 0.14) => <span className="block h-1.5 rounded-full bg-[#171717]" style={{ width: w, opacity: o }} />

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap
          .timeline({ delay: 0.4 })
          .from('[data-asset]', { autoAlpha: 0, y: 24, scale: 0.94, duration: 1, stagger: 0.12, ease: 'expo.out' })
          .fromTo('[data-wire]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: 0.1, ease: 'power2.inOut' }, 0.6)
          .from('[data-report]', { autoAlpha: 0, y: 20, duration: 1, ease: 'expo.out' }, 0.9)
          .from('[data-bar]', { scaleY: 0, transformOrigin: 'bottom', duration: 0.8, stagger: 0.05, ease: 'expo.out' }, 1.2)
        // Gentle depth on scroll
        gsap.to('[data-asset]', {
          y: (i: number) => [-18, -8, -24, -12][i] ?? -10,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 60%', end: 'bottom top', scrub: 0.8 },
        })
      })
    },
    { scope: root },
  )

  const card = 'rounded-xl border border-line bg-white p-3 shadow-[0_24px_40px_-26px_rgb(58_42_29/0.45)]'

  return (
    <div ref={root} className="relative aspect-[5/4] w-full" aria-label="Illustrative campaign assets connected to a reporting view" role="img">
      {/* Connectors into the report */}
      <svg viewBox="0 0 100 80" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {[
          'M24 18 C 40 18, 46 44, 54 50',
          'M76 14 C 74 30, 70 40, 66 48',
          'M22 52 C 34 52, 42 56, 50 58',
          'M80 46 C 78 52, 74 54, 70 56',
        ].map((d, i) => (
          <g key={i}>
            <path data-wire d={d} fill="none" stroke="#c79b69" strokeWidth="0.35" pathLength={1} strokeDasharray="1" vectorEffect="non-scaling-stroke" />
            {/* A signal travelling from each asset into the report */}
            <path d={d} fill="none" stroke="#8c5e34" strokeWidth="2.5" strokeLinecap="round" pathLength={1} className="flow-dash" vectorEffect="non-scaling-stroke" style={{ animationDelay: `-${i * 0.65}s` }} />
          </g>
        ))}
      </svg>

      {/* Search result */}
      <div data-asset className={`${card} absolute left-0 top-[4%] w-[44%]`} aria-hidden="true">
        <p className="flex items-center gap-1.5 text-[0.6rem] text-[#68645e]">
          <Search size={11} /> Search
        </p>
        <p className="mt-2 text-[0.55rem] text-[#2f7a4f]">yourbrand.com › services</p>
        <p className="text-[0.72rem] font-medium leading-tight text-[#1a3d8f]">Your service, explained clearly</p>
        <div className="mt-1.5 space-y-1">{bar('95%')}{bar('70%')}</div>
      </div>

      {/* Social post */}
      <div data-asset className={`${card} absolute right-0 top-0 w-[40%]`} aria-hidden="true">
        <div className="flex items-center gap-1.5">
          <span className="h-4 w-4 rounded-full bg-[linear-gradient(135deg,#e8cfae,#a8754c)]" />
          <span className="text-[0.6rem] text-[#68645e]">Social post</span>
        </div>
        <div className="mt-2 aspect-[16/10] rounded-md bg-[linear-gradient(135deg,#1c2433,#2a2018)]" />
        <div className="mt-2 flex gap-2 text-[#68645e]">
          <Heart size={11} />
          <MessageCircle size={11} />
        </div>
      </div>

      {/* Landing page */}
      <div data-asset className={`${card} absolute bottom-[14%] left-[2%] w-[38%]`} aria-hidden="true">
        <p className="text-[0.6rem] text-[#68645e]">Landing page</p>
        <div className="mt-2 rounded-md bg-[#f7f5f0] p-2">
          {bar('80%', 0.7)}
          <div className="mt-1">{bar('55%')}</div>
          <span className="mt-2 inline-block rounded-full bg-[#171717] px-2 py-0.5 text-[0.5rem] text-white">Book a call</span>
        </div>
      </div>

      {/* Email */}
      <div data-asset className={`${card} absolute right-[3%] top-[48%] w-[30%]`} aria-hidden="true">
        <p className="flex items-center gap-1.5 text-[0.6rem] text-[#68645e]">
          <Mail size={11} /> Email
        </p>
        <div className="mt-2 space-y-1">{bar('90%', 0.5)}{bar('100%')}{bar('65%')}</div>
      </div>

      {/* Report */}
      <div data-report className="theme-dark absolute bottom-0 left-[38%] w-[42%] rounded-xl bg-canvas p-3 shadow-[0_30px_50px_-24px_rgb(17_18_22/0.6)]" aria-hidden="true">
        <p className="flex items-center justify-between text-[0.6rem] text-muted">
          <span className="text-fg">Campaign report</span>
          <span className="eyebrow text-[0.5rem] text-accent">Illustrative</span>
        </p>
        <div className="mt-2 flex h-14 items-end gap-1">
          {[40, 55, 48, 66, 60, 74, 70, 82].map((h, i) => (
            <span key={i} data-bar className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 7 ? 'linear-gradient(#e8cfae,#a8754c)' : 'rgb(237 233 227 / 0.18)' }} />
          ))}
        </div>
        <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[0.55rem] text-muted">
          {['Reach', 'Engagement', 'Enquiries', 'Cost per lead'].map((m) => (
            <li key={m} className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

import { useRef, useState, type ReactNode } from 'react'
import { Bell, CloudUpload } from 'lucide-react'
import { releaseJourney } from '@/content/service-extras'
import { gsap, MOTION, ScrollTrigger, useGSAP } from '@/lib/gsap'

type Stage = (typeof releaseJourney)[number]['id']

/** Small illustrative phone screen for each release stage. */
export function MiniPhone({ stage }: { stage: Stage }) {
  const bar = (w: string, o = 0.15) => <span className="block h-1.5 rounded-full bg-[#171717]" style={{ width: w, opacity: o }} />
  return (
    <div aria-hidden="true" className="relative z-10 w-[7.5rem] rounded-[1.4rem] border border-line-strong bg-[#0c0d10] p-1.5 shadow-[0_24px_40px_-20px_rgb(0_0_0/0.5)]">
      <div className="flex h-[13.5rem] flex-col gap-2 overflow-hidden rounded-[1.05rem] bg-[#f7f5f0] p-2.5">
        <span className="mx-auto h-1.5 w-8 rounded-full bg-[#171717]/80" />
        {stage === 'onboarding' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <span className="h-12 w-12 rounded-2xl bg-[linear-gradient(135deg,#e8cfae,#a8754c)]" />
            {bar('80%', 0.6)}{bar('60%')}
            <div className="mt-1 flex gap-1">{[0, 1, 2].map((i) => <span key={i} className={`h-1 rounded-full ${i === 0 ? 'w-3 bg-[#171717]' : 'w-1 bg-[#171717]/25'}`} />)}</div>
            <span className="mt-auto w-full rounded-full bg-[#171717] py-1.5 text-[0.5rem] text-white">Get started</span>
          </div>
        )}
        {stage === 'task' && (
          <div className="flex flex-col gap-1.5">
            {bar('50%', 0.7)}
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`flex items-center gap-1.5 rounded-md border p-1.5 ${i === 0 ? 'border-[#c79b69] bg-[#c79b69]/15' : 'border-[#171717]/10'}`}>
                <span className={`h-2.5 w-2.5 rounded-[3px] border ${i < 2 ? 'border-[#8c5e34] bg-[#8c5e34]' : 'border-[#171717]/30'}`} />
                {bar('70%', 0.3)}
              </div>
            ))}
          </div>
        )}
        {stage === 'sync' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-dashed border-[#c79b69]">
              <span className="h-3 w-3 rounded-full bg-[#8c5e34]" />
            </span>
            {bar('70%', 0.5)}{bar('45%')}
            <span className="rounded-full bg-[#171717] px-2 py-1 text-[0.5rem] text-white">Synced</span>
          </div>
        )}
        {stage === 'store' && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-8 w-8 rounded-lg bg-[linear-gradient(135deg,#e8cfae,#a8754c)]" />
              <div className="flex-1 space-y-1">{bar('90%', 0.6)}{bar('60%')}</div>
            </div>
            <span className="w-full rounded-full bg-[#171717] py-1 text-center text-[0.5rem] text-white">Preview</span>
            <div className="grid grid-cols-3 gap-1">{[0, 1, 2].map((i) => <span key={i} className="h-14 rounded bg-[#171717]/10" />)}</div>
            {bar('85%')}{bar('70%')}
          </div>
        )}
      </div>
    </div>
  )
}


/* ------------------------------------------------------------------ */
/*  Release journey: scroll-driven phone (desktop), stacked (mobile)    */
/* ------------------------------------------------------------------ */
export function ReleaseJourney() {
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('[data-release-step]', root.current).forEach((el, i) =>
        ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => self.isActive && setActive(i) }),
      )
    },
    { scope: root },
  )

  const goTo = (i: number) => {
    setActive(i)
    root.current?.querySelectorAll<HTMLElement>('[data-release-step]')[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div ref={root}>
      {/* Desktop: pinned phone whose screen changes with each stage */}
      <div className="hidden gap-16 lg:grid lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="sticky top-[18vh] flex flex-col items-center">
            <div className="relative" style={{ perspective: '1200px' }}>
              <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-[130%] w-[160%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(199_155_105/0.22),transparent)]" />
              <div className="relative h-[23rem] w-[13rem]" style={{ transform: 'rotateY(-10deg) rotateX(4deg)', transformStyle: 'preserve-3d' }}>
                {releaseJourney.map((r, i) => (
                  <div
                    key={r.id}
                    className="absolute inset-0 origin-top-left transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]"
                    style={{ opacity: i === active ? 1 : 0, transform: `scale(1.7) translateY(${i === active ? 0 : i < active ? -8 : 8}px)` }}
                  >
                    <MiniPhone stage={r.id} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 flex gap-2" role="group" aria-label="Release stages">
              {releaseJourney.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-pressed={i === active}
                  aria-label={r.name}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-10 bg-accent-ink' : 'w-4 bg-line-strong hover:bg-subtle'}`}
                />
              ))}
            </div>
          </div>
        </div>
        <ol className="lg:col-span-7">
          {releaseJourney.map((r, i) => (
            <li
              key={r.id}
              data-release-step
              className={`flex min-h-[48vh] flex-col justify-center border-l-2 pl-10 transition-[border-color,opacity] duration-500 ${i === active ? 'border-accent-ink opacity-100' : 'border-line opacity-45'}`}
            >
              <p className="font-mono text-[0.75rem] text-accent-ink">Stage 0{i + 1}</p>
              <h3 className="mt-3 text-[clamp(1.8rem,2.6vw,2.4rem)] font-medium leading-tight tracking-[-0.03em]">{r.name}</h3>
              <p className="mt-3 max-w-md text-lg leading-relaxed text-muted">{r.body}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Mobile & tablet: a simple stacked sequence */}
      <ol className="grid gap-12 sm:grid-cols-2 lg:hidden">
        {releaseJourney.map((r, i) => (
          <li key={r.id} data-reveal className="flex flex-col items-center text-center">
            <MiniPhone stage={r.id} />
            <p className="mt-6 font-mono text-[0.72rem] text-accent-ink">0{i + 1}</p>
            <h3 className="mt-1 text-lg font-medium">{r.name}</h3>
            <p className="mt-2 max-w-[16rem] text-[0.92rem] leading-relaxed text-muted">{r.body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero: floating interface panels around the phone demo               */
/* ------------------------------------------------------------------ */
export function PhonePanels({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(`${MOTION} and (min-width: 1024px)`, () => {
        gsap.from('[data-panel]', { autoAlpha: 0, x: (i: number) => (i ? 30 : -30), duration: 1.2, stagger: 0.2, delay: 0.9, ease: 'expo.out' })
        const st = { trigger: root.current, start: 'top 30%', end: 'bottom top', scrub: 0.8 }
        gsap.to('[data-panel="a"]', { y: -50, ease: 'none', scrollTrigger: st })
        gsap.to('[data-panel="b"]', { y: -90, ease: 'none', scrollTrigger: st })
      })
    },
    { scope: root },
  )
  const panel = 'flex items-center gap-3 rounded-xl border border-white/80 bg-white/75 px-3.5 py-2.5 text-[0.75rem] shadow-[0_24px_40px_-24px_rgb(58_42_29/0.55)] backdrop-blur-md'
  return (
    <div ref={root} className="relative">
      {children}
      <div data-panel="a" aria-hidden="true" className={`${panel} absolute -left-8 top-[30%] z-10 hidden lg:flex`} style={{ transform: 'rotateY(12deg)' }}>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#171717] text-white">
          <Bell size={14} />
        </span>
        <span>
          <span className="block font-medium text-fg">New job assigned</span>
          <span className="text-muted">Air handling unit · today</span>
        </span>
      </div>
      <div data-panel="b" aria-hidden="true" className={`${panel} absolute -right-6 bottom-[22%] z-10 hidden lg:flex`} style={{ transform: 'rotateY(-12deg)' }}>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-[#171717]">
          <CloudUpload size={14} />
        </span>
        <span>
          <span className="block font-medium text-fg">2 updates saved offline</span>
          <span className="text-muted">Will sync automatically</span>
        </span>
      </div>
    </div>
  )
}

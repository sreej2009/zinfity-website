import { useRef, type ReactNode } from 'react'
import { siteTypes } from '@/content/service-extras'
import { useAutoCycle } from '@/hooks/useAutoCycle'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

type SiteKind = (typeof siteTypes)[number]['id']

/** Small illustrative wireframe for each website type. */
export function SiteWireframe({ kind }: { kind: SiteKind }) {
  const bar = (w: string, o = 0.12) => <span className="block h-1.5 rounded-full bg-[#171717]" style={{ width: w, opacity: o }} />
  return (
    <div aria-hidden="true" className="flex h-full flex-col gap-2 rounded-md bg-[#f7f5f0] p-3">
      <div className="flex items-center justify-between">
        <span className="h-2 w-8 rounded-sm bg-[#171717]/80" />
        <span className="flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-4 rounded-full bg-[#171717]/15" />)}</span>
      </div>
      {kind === 'corporate' && (
        <>
          <div className="grid flex-1 grid-cols-[1.3fr_1fr] gap-2">
            <div className="space-y-1.5 pt-2">{bar('90%', 0.7)}{bar('70%', 0.7)}{bar('80%')}<span className="mt-2 inline-block h-3 w-10 rounded-full bg-[#171717]" /></div>
            <div className="rounded bg-[linear-gradient(135deg,#e8cfae,#a8754c)]" />
          </div>
          <div className="grid grid-cols-3 gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-5 rounded border border-[#171717]/10" />)}</div>
        </>
      )}
      {kind === 'landing' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-1.5 text-center">
          {bar('70%', 0.75)}{bar('50%')}<span className="mt-1 h-4 w-16 rounded-full bg-[#c79b69]" />
          <div className="mt-2 flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#171717]/25" />)}</div>
        </div>
      )}
      {kind === 'cms' && (
        <div className="grid flex-1 grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-1 rounded border border-[#171717]/10 p-1.5">
              <span className="h-5 rounded-sm bg-[#171717]/10" />
              {bar('85%', 0.35)}{bar('60%')}
            </div>
          ))}
        </div>
      )}
      {kind === 'multilingual' && (
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex gap-1">{['EN', 'தமிழ்', 'हिं'].map((l, i) => <span key={l} className={`rounded px-1.5 py-0.5 text-[0.5rem] ${i === 0 ? 'bg-[#171717] text-white' : 'border border-[#171717]/15 text-[#171717]/60'}`}>{l}</span>)}</div>
          <div className="grid flex-1 grid-cols-2 gap-2">
            <div className="space-y-1.5 rounded border border-[#171717]/10 p-1.5">{bar('80%', 0.6)}{bar('90%')}{bar('70%')}</div>
            <div className="space-y-1.5 rounded border border-dashed border-[#c79b69] p-1.5">{bar('75%', 0.6)}{bar('85%')}{bar('65%')}</div>
          </div>
        </div>
      )}
    </div>
  )
}


/* ------------------------------------------------------------------ */
/*  Floating tablet + phone frames layered around the hero browser      */
/* ------------------------------------------------------------------ */
function MiniLayout({ phone }: { phone?: boolean }) {
  const bar = (w: string, o = 0.15) => <span className="block h-1 rounded-full bg-[#171717]" style={{ width: w, opacity: o }} />
  return (
    <div className="flex h-full flex-col gap-1.5 bg-[#f7f5f0] p-2">
      <div className="flex items-center justify-between">
        <span className="h-1.5 w-6 rounded-sm bg-[#171717]/80" />
        <span className="flex flex-col gap-0.5">
          <span className="h-px w-2.5 bg-[#171717]/60" />
          <span className="h-px w-2.5 bg-[#171717]/60" />
        </span>
      </div>
      {bar('85%', 0.7)}
      {bar('60%', 0.7)}
      <span className={`rounded bg-[linear-gradient(135deg,#e8cfae,#a8754c)] ${phone ? 'h-10' : 'h-12'}`} />
      <div className={`grid gap-1 ${phone ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {[0, 1].map((i) => (
          <span key={i} className="h-4 rounded border border-[#171717]/10" />
        ))}
      </div>
    </div>
  )
}

export function FloatingDevices({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(`${MOTION} and (min-width: 1024px)`, () => {
        gsap.from('[data-float]', { autoAlpha: 0, y: 40, duration: 1.4, stagger: 0.15, delay: 0.6, ease: 'expo.out' })
        const st = { trigger: root.current, start: 'top 40%', end: 'bottom top', scrub: 0.8 }
        gsap.to('[data-float=tablet]', { y: -60, ease: 'none', scrollTrigger: st })
        gsap.to('[data-float=phone]', { y: -110, ease: 'none', scrollTrigger: st })
      })
    },
    { scope: root },
  )
  return (
    <div ref={root} className="relative" style={{ perspective: '1400px' }}>
      {/* Tablet, behind the browser */}
      <div data-float="tablet" aria-hidden="true" className="absolute -left-12 top-[30%] z-20 hidden lg:block">
        <div
          className="w-[9.5rem] rounded-[1.1rem] border border-line-strong bg-[#0c0d10] p-1.5 shadow-[0_30px_50px_-25px_rgb(0_0_0/0.5)]"
          style={{ transform: 'rotateY(14deg) rotateZ(-3deg)' }}
        >
          <div className="aspect-[3/4] overflow-hidden rounded-[0.8rem]">
            <MiniLayout />
          </div>
        </div>
      </div>
      <div className="relative z-10">{children}</div>
      {/* Phone, in front of the browser */}
      <div data-float="phone" aria-hidden="true" className="absolute -right-8 top-[38%] z-20 hidden lg:block">
        <div
          className="w-[6.2rem] rounded-[1.2rem] border border-line-strong bg-[#0c0d10] p-1 shadow-[0_30px_50px_-20px_rgb(0_0_0/0.55)]"
          style={{ transform: 'rotateY(-12deg) rotateZ(4deg)' }}
        >
          <div className="aspect-[9/19] overflow-hidden rounded-[0.95rem]">
            <MiniLayout phone />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Website types: interactive gallery                                  */
/* ------------------------------------------------------------------ */
export function SiteGallery() {
  const root = useRef<HTMLDivElement>(null)
  const { index, select } = useAutoCycle(siteTypes.length, root, 3600)
  return (
    <div ref={root} className="grid gap-10 lg:grid-cols-12 lg:items-center">
      <div role="tablist" aria-label="Website types" className="space-y-2 lg:col-span-5">
        {siteTypes.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            id={`site-tab-${t.id}`}
            aria-selected={i === index}
            aria-controls="site-panel"
            onClick={() => select(i)}
            onMouseEnter={() => select(i)}
            className={`group relative block w-full overflow-hidden rounded-xl border px-5 py-4 text-left transition-colors duration-500 ${
              i === index ? 'border-fg bg-canvas' : 'border-line hover:border-line-strong'
            }`}
          >
            <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 origin-top bg-accent transition-transform duration-500 ${i === index ? 'scale-y-100' : 'scale-y-0'}`} />
            <span className="flex items-baseline gap-4">
              <span className="font-mono text-[0.72rem] text-accent-ink">0{i + 1}</span>
              <span className="text-lg font-medium tracking-[-0.015em]">{t.name}</span>
            </span>
            <span className={`grid transition-[grid-template-rows] duration-500 ${i === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <span className="overflow-hidden pl-9 text-[0.94rem] leading-relaxed text-muted">
                <span className="block pt-1.5">{t.body}</span>
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Layered preview: the active layout in front, the others stacked behind */}
      <div id="site-panel" role="tabpanel" aria-labelledby={`site-tab-${siteTypes[index].id}`} className="relative overflow-x-clip pt-10 lg:col-span-7 lg:overflow-x-visible lg:pt-0" style={{ perspective: '1600px' }}>
        <div className="relative aspect-[16/11] w-[calc(100%-3.5rem)] max-w-[40rem] sm:mx-auto sm:w-full">
          {siteTypes.map((t, i) => {
            const offset = (i - index + siteTypes.length) % siteTypes.length
            return (
              <div
                key={t.id}
                aria-hidden={offset !== 0}
                className="absolute inset-0 rounded-2xl border border-line bg-white p-3 shadow-[0_40px_60px_-40px_rgb(58_42_29/0.55)] transition-all duration-[900ms] ease-[var(--ease-out-expo)] motion-reduce:transition-none"
                style={{
                  transform: `translate3d(${offset * 22}px, ${-offset * 18}px, ${-offset * 90}px) rotateY(${-6 - offset * 2}deg)`,
                  opacity: offset === 0 ? 1 : Math.max(0, 0.55 - offset * 0.15),
                  zIndex: 10 - offset,
                  filter: offset ? 'saturate(0.6)' : 'none',
                }}
              >
                <div className="flex items-center gap-1.5 pb-2">
                  <span className="h-2 w-2 rounded-full bg-[#171717]/15" />
                  <span className="h-2 w-2 rounded-full bg-[#171717]/15" />
                  <span className="h-2 w-2 rounded-full bg-[#c79b69]" />
                  <span className="ml-2 h-2.5 flex-1 rounded bg-[#171717]/5" />
                </div>
                <div className="h-[calc(100%-1.4rem)]">
                  <SiteWireframe kind={t.id} />
                </div>
              </div>
            )
          })}
        </div>
        <p className="mt-6 text-center text-[0.8rem] text-subtle">Illustrative layouts — every site is designed around its own audience and content.</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Capabilities as a layered build stack                               */
/* ------------------------------------------------------------------ */
export function LayerStack({ groups }: { groups: { group: string; items: string[] }[] }) {
  const root = useRef<HTMLDivElement>(null)
  const { index, select } = useAutoCycle(groups.length, root, 3000)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.from('[data-plane]', { y: -60, autoAlpha: 0, duration: 1.1, stagger: 0.18, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
      })
    },
    { scope: root },
  )
  return (
    <div ref={root} className="grid items-center gap-12 lg:grid-cols-12">
      <div aria-hidden="true" className="relative mx-auto h-[17rem] w-full max-w-[26rem] max-sm:scale-[0.82] sm:h-[19rem] lg:col-span-5" style={{ perspective: '1200px' }}>
        <div className="absolute inset-0" style={{ transform: 'rotateX(58deg) rotateZ(-38deg)', transformStyle: 'preserve-3d' }}>
          {groups.map((g, i) => (
            <div key={g.group} data-plane className="absolute inset-x-[12%] top-[18%] h-[58%]" style={{ transform: `translateZ(${(groups.length - 1 - i) * 54 + (i === index ? 26 : 0)}px)`, transition: 'transform .7s cubic-bezier(.16,1,.3,1)' }}>
              <div
                className={`h-full w-full rounded-2xl border transition-[background,border-color,box-shadow] duration-700 ${
                  i === index ? 'border-accent-ink bg-[linear-gradient(135deg,#f0d9bd,#c79b69)] shadow-[0_30px_50px_-20px_rgb(140_94_52/0.55)]' : 'border-line-strong bg-white/85 shadow-[0_20px_30px_-20px_rgb(58_42_29/0.35)]'
                }`}
              >
                <span className="absolute left-4 top-3 font-mono text-[0.7rem] text-[#171717]/70">
                  0{i + 1} · {g.group}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ol className="space-y-3 lg:col-span-7">
        {groups.map((g, i) => (
          <li key={g.group}>
            <button
              type="button"
              aria-pressed={i === index}
              onClick={() => select(i)}
              onMouseEnter={() => select(i)}
              className={`w-full rounded-xl border p-5 text-left transition-colors duration-500 ${i === index ? 'border-fg bg-surface' : 'border-line hover:border-line-strong'}`}
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-[0.72rem] text-accent-ink">0{i + 1}</span>
                <span className="text-lg font-medium">{g.group}</span>
              </span>
              <span className="mt-3 flex flex-wrap gap-2">
                {g.items.map((x) => (
                  <span key={x} className="chip">
                    {x}
                  </span>
                ))}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

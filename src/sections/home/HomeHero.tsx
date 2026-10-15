import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { canRender3D } from '@/lib/device'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { gsap, MOTION, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap'
import type { SceneState } from '@/visuals/three/HeroScene'

const HeroScene = lazy(() => import('@/visuals/three/HeroScene'))

/** Labels revealed around the mark during the second scroll shot (order matches the scene's anchors). */
const HERO_LABELS = ['Design', 'Engineering', 'Systems', 'Growth']

/** Reports a failed 3D scene so the hero falls back to the static poster. */
function FailedScene({ onFail }: { onFail: () => void }) {
  useEffect(onFail, [onFail])
  return null
}

/** Static, image-based stand-in: shown first, kept when WebGL is not used. */
function Poster({ hidden }: { hidden: boolean }) {
  return (
    <div
      aria-hidden="true"
      data-poster
      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${hidden ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="relative w-[min(46vw,13rem)] sm:w-[min(34vw,17rem)] lg:w-[min(30vw,30rem)] lg:translate-x-[26vw]">
        <Logo variant="mark" priority alt="" className="relative z-10 block h-auto w-full drop-shadow-[0_40px_40px_rgb(58_42_29/0.28)]" />
        <div
          className="-scale-y-100 opacity-[0.14] blur-[1.5px]"
          style={{ maskImage: 'linear-gradient(0deg, #000, transparent 45%)', WebkitMaskImage: 'linear-gradient(0deg, #000, transparent 45%)' }}
        >
          <Logo variant="mark" priority alt="" className="block h-auto w-full" />
        </div>
        <div className="absolute bottom-[46%] left-1/2 h-6 w-[85%] -translate-x-1/2 rounded-[50%] bg-[#3a2a1d]/25 blur-xl" />
      </div>
    </div>
  )
}

/**
 * Home hero. A tall scroll section with a sticky stage: scrolling drives the
 * 3D camera through three shots while the layered headline parts around the mark.
 */
export function HomeHero() {
  const root = useRef<HTMLElement>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [use3D, setUse3D] = useState(() => canRender3D())
  const [ready, setReady] = useState(false)

  const state = useMemo<SceneState>(
    () => ({
      progress: { current: 0 },
      pointer: { current: { x: 0, y: 0 } },
      intro: { current: 0 },
      sheen: { current: -0.6 },
      labels: { current: [] },
    }),
    [],
  )
  const onReady = useCallback(() => setReady(true), [])

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      // Scroll progress feeds the scene (also works without WebGL: drives the type).
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          state.progress.current = self.progress
          state.invalidate?.()
        },
      })

      mm.add(MOTION, () => {
        const split = SplitText.create(q('[data-line]'), { type: 'lines', mask: 'lines', linesClass: 'split-line' })
        // Cinematic first load: camera dolly + mark sheen + headline lines.
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        tl.to(state.intro, { current: 1, duration: 2.6, ease: 'power3.out', onUpdate: () => state.invalidate?.() }, 0)
          .from(split.lines, { yPercent: 115, duration: 1.5, stagger: 0.12 }, 0.35)
          .from(q('[data-back-word]'), { autoAlpha: 0, scale: 0.92, duration: 2.2 }, 0.2)
          .to(state.sheen, { current: 1.6, duration: 2, ease: 'power2.inOut', onUpdate: () => state.invalidate?.() }, 1.2)
          .from(q('[data-fade]'), { autoAlpha: 0, y: 20, duration: 1.2, stagger: 0.08 }, 1)

        // Layered type parts around the mark as the camera moves.
        const scrub = { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 }
        gsap.timeline({ scrollTrigger: scrub })
          // Phase 1 (0–0.22): "Moves" drifts left and fades out fully, with the other lines.
          .to(q('[data-back-word]'), { xPercent: -35, autoAlpha: 0, ease: 'none', duration: 0.17 }, 0.02)
          .to(q('[data-front-top]'), { yPercent: -60, autoAlpha: 0, ease: 'none', duration: 0.2 }, 0.04)
          .to(q('[data-front-bottom]'), { yPercent: 40, autoAlpha: 0, ease: 'none', duration: 0.2 }, 0.04)
          .to(q('[data-statement]'), { autoAlpha: 0, y: -30, ease: 'none', duration: 0.15 }, 0.02)
          // Phase 2+ (scene): the mark glides to centre (0.2–0.42), then the camera shots.
          .fromTo(q('[data-shot2]'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, ease: 'none', duration: 0.12 }, 0.46)
          .to(q('[data-shot2]'), { autoAlpha: 0, y: -30, ease: 'none', duration: 0.1 }, 0.72)
          .fromTo(q('[data-shot3]'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, ease: 'none', duration: 0.1 }, 0.8)
          .to(q('[data-stage]'), { autoAlpha: 0.15, ease: 'none', duration: 0.1 }, 0.9)

        return () => split.revert()
      })

      mm.add(`${MOTION} and (pointer: fine)`, () => {
        const onMove = (e: PointerEvent) => {
          state.pointer.current.x = e.clientX / window.innerWidth - 0.5
          state.pointer.current.y = 0.5 - e.clientY / window.innerHeight
          state.invalidate?.()
        }
        window.addEventListener('pointermove', onMove, { passive: true })
        return () => window.removeEventListener('pointermove', onMove)
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative h-[230svh] motion-reduce:h-[100svh] lg:h-[260svh] lg:motion-reduce:h-[100svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Warm architectural light */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-30%] h-[90%] w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(199_155_105/0.18),transparent)]" />
        </div>

        <h1 id="hero-title" className="sr-only">
          Technology That Moves Business Forward.
        </h1>
        {/* Visual headline, layered around the mark (the sr-only h1 above carries the text). */}
        <div aria-hidden="true" className="contents">
          {/* Middle line: smaller serif "Moves" on the left; the mark sits to the right (desktop). */}
          <span className="container-x pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+4.6rem)] z-0 block sm:top-[calc(var(--header-h)+6.5rem)] lg:top-1/2 lg:-translate-y-[58%]">
            <span data-back-word className="serif-accent metal-text inline-block whitespace-nowrap pr-[0.08em] text-[clamp(4.2rem,16vw,16rem)] leading-none">
              Moves
            </span>
          </span>
          {/* Front layers */}
          <span
            data-front-top
            className="container-x absolute inset-x-0 top-[calc(var(--header-h)+1.5rem)] z-20 block lg:top-[17%]"
          >
            <span data-line className="block text-[clamp(2.6rem,7.4vw,8rem)] font-medium leading-[0.92] tracking-[-0.05em]">
              Technology That
            </span>
          </span>
          <span data-front-bottom className="container-x absolute inset-x-0 bottom-[13.5rem] z-20 block text-right sm:bottom-[22%] lg:bottom-[16%]">
            <span data-line className="block text-[clamp(2.6rem,7.4vw,8rem)] font-medium leading-[0.92] tracking-[-0.05em]">
              Business Forward.
            </span>
          </span>
        </div>

        {/* 3D stage */}
        <div data-stage className="absolute inset-0 z-10">
          <Poster hidden={use3D && ready} />
          {use3D && (
            // If the 3D chunk fails to load or WebGL errors, keep the static hero.
            <ErrorBoundary fallback={<FailedScene onFail={() => setUse3D(false)} />}>
            <Suspense fallback={null}>
              <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
                <HeroScene state={state} onReady={onReady} compact={!isDesktop} />
              </div>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                {HERO_LABELS.map((text, k) => (
                  <span
                    key={text}
                    ref={(el) => {
                      state.labels.current[k] = el
                    }}
                    className="eyebrow absolute left-0 top-0 whitespace-nowrap text-muted will-change-transform"
                    style={{ opacity: 0 }}
                  >
                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
                    {text}
                  </span>
                ))}
              </div>
            </Suspense>
            </ErrorBoundary>
          )}
        </div>

        {/* Statement + CTAs (shot 1) */}
        <div data-statement className="container-x absolute inset-x-0 bottom-6 z-30 flex flex-col gap-5 sm:bottom-8 lg:flex-row lg:items-end lg:justify-between">
          <p data-fade className="max-w-sm text-[0.95rem] leading-relaxed text-muted lg:text-[1.05rem]">
            We design and build digital experiences, intelligent software, and connected systems that help businesses move from ideas to impact.
          </p>
          <div data-fade className="flex flex-wrap gap-3">
            <ButtonLink to="/contact" size={isDesktop ? 'md' : 'sm'}>
              Start a Project
            </ButtonLink>
            <ButtonLink to="/work" variant="ghost" size={isDesktop ? 'md' : 'sm'}>
              Explore Our Work
            </ButtonLink>
          </div>
        </div>

        {/* Shot 2: the mark opens into its parts */}
        <p
          data-shot2
          className="container-x pointer-events-none invisible absolute inset-x-0 bottom-10 z-30 text-[clamp(1.3rem,2.4vw,2.2rem)] font-medium leading-tight tracking-[-0.03em] lg:bottom-16"
        >
          Design, engineering, systems and growth —<br className="hidden sm:block" /> <span className="text-muted">built as one piece.</span>
        </p>
        {/* Shot 3: settle */}
        <p
          data-shot3
          className="container-x pointer-events-none invisible absolute inset-x-0 bottom-10 z-30 text-right text-[clamp(1.3rem,2.4vw,2.2rem)] font-medium leading-tight tracking-[-0.03em] lg:bottom-16"
        >
          Technology that <span className="serif-accent metal-text">works</span> together.
        </p>

      </div>
    </section>
  )
}

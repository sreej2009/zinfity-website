import { useRef } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Layers, Link2, Sparkles } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ButtonLink } from '@/components/ui/Button'
import { ArrowLink } from '@/components/blocks/ArrowLink'
import { Logo } from '@/components/ui/Logo'
import { services, servicePath } from '@/content/services'
import { serviceIcons } from '@/content/serviceIcons'
import { contactHref } from '@/lib/enquiry'
import { gsap, MOTION, SplitText, useGSAP } from '@/lib/gsap'

const pad = (n: number) => String(n).padStart(2, '0')

/** Glass cards around the sculpture: service id, position (% of stage), tilt and depth. */
const CARDS = [
  { id: 'web', label: ['Web', 'Development'], x: 17, y: 16, ry: 18, z: 40 },
  { id: 'uiux', label: ['UI/UX', 'Design'], x: 11, y: 43, ry: 22, z: 70 },
  { id: 'marketing', label: ['Digital', 'Marketing'], x: 16, y: 71, ry: 18, z: 30 },
  { id: 'mobile', label: ['Mobile', 'Applications'], x: 83, y: 18, ry: -18, z: 50 },
  { id: 'erp', label: ['ERP & CRM', 'Solutions'], x: 88, y: 46, ry: -22, z: 80 },
  { id: 'ai', label: ['AI &', 'Automation'], x: 83, y: 73, ry: -18, z: 30 },
]

const facts = [
  { icon: Layers, big: pad(services.length), text: 'Core disciplines' },
  { icon: Sparkles, text: 'End-to-end capabilities' },
  { icon: Link2, text: 'Strategy to execution' },
]

/** Layered CSS 3D sculpture: the real Z mark on a pedestal, orbit rings and glass service cards. */
function Sculpture() {
  return (
    <div data-sculpt-pointer className="relative mx-auto aspect-square w-full max-w-[20rem] sm:max-w-[26rem] lg:max-w-[38rem]" style={{ perspective: '1400px' }}>
      <div data-sculpt className="absolute inset-0">
        {/* Ambient light */}
        <div className="absolute inset-[-10%] rounded-full bg-[radial-gradient(closest-side,rgb(240_217_189/0.55),rgb(247_245_240/0)_70%)]" />

        {/* Orbit rings — back halves (behind the Z) */}
        <div data-ring className="absolute left-[3%] top-[30%] h-[36%] w-[94%] rounded-[50%] border border-accent/60 [clip-path:inset(0_0_50%_0)]" />
        <div data-ring className="absolute left-[12%] top-[18%] h-[58%] w-[76%] rotate-[-16deg] rounded-[50%] border border-accent/35 [clip-path:inset(0_0_52%_0)]" />

        {/* Pedestal */}
        <div data-pedestal className="absolute bottom-[14%] left-[19%] h-[18%] w-[62%]">
          <div className="absolute inset-x-0 bottom-0 h-[62%] rounded-[50%] bg-[linear-gradient(180deg,#e8d3b8_0%,#b98a5c_60%,#7a5638_100%)] shadow-[0_30px_50px_-20px_rgb(58_42_29/0.45)]" />
          <div className="absolute inset-x-0 top-0 h-[70%] rounded-[50%] bg-[radial-gradient(70%_80%_at_50%_40%,#fbf3e8,#e6cfb1_70%,#c9a27a)] shadow-[inset_0_-6px_14px_rgb(140_94_52/0.35)]" />
          <div className="absolute inset-x-[10%] top-[8%] h-[52%] rounded-[50%] border border-white/60" />
        </div>

        {/* The Z mark (real logo asset) with a soft reflection */}
        <div className="absolute inset-x-0 top-[34%] flex justify-center">
          <div data-z className="relative w-[42%] will-change-transform">
            <Logo variant="mark" priority alt="" className="relative block h-auto w-full drop-shadow-[0_26px_22px_rgb(58_42_29/0.32)]" />
            <span className="absolute -bottom-[4%] left-1/2 -z-10 h-[10%] w-[90%] -translate-x-1/2 rounded-[50%] bg-[#3a2a1d]/30 blur-md" />
          </div>
        </div>

        {/* Orbit rings — front halves (in front of the Z) */}
        <div data-ring className="absolute left-[3%] top-[30%] h-[36%] w-[94%] rounded-[50%] border border-accent/70 [clip-path:inset(50%_0_0_0)]" />
        <div data-ring className="absolute left-[12%] top-[18%] h-[58%] w-[76%] rotate-[-16deg] rounded-[50%] border border-accent/40 [clip-path:inset(52%_0_0_0)]" />
        <span data-ring className="absolute right-[24%] top-[27%] h-3 w-3 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff6ea,#c79b69_55%,#7a5638)] shadow-[0_4px_10px_rgb(58_42_29/0.35)]" />
        <span data-ring className="absolute left-[2.5%] top-[47%] h-2.5 w-2.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff6ea,#c79b69_55%,#7a5638)]" />

        {/* Glass service cards */}
        {CARDS.map((c) => {
          const Icon = serviceIcons[c.id]
          return (
            <div
              key={c.id}
              data-card
              data-depth={c.z}
              className="absolute"
              style={{ left: `${c.x}%`, top: `${c.y}%`, transform: `translate(-50%, -50%) perspective(900px) rotateY(${c.ry}deg)` }}
            >
              <div className="flex items-center gap-2.5 rounded-xl border border-white/80 bg-[#fbf8f3]/90 will-change-transform px-3 py-2.5 shadow-[0_18px_36px_-16px_rgb(58_42_29/0.35),inset_0_1px_0_rgb(255_255_255/0.9)] sm:px-3.5 sm:py-3">
                <Icon size={20} strokeWidth={1.4} className="shrink-0 text-fg" aria-hidden="true" />
                <span className="text-[0.62rem] font-medium leading-tight text-fg sm:text-[0.72rem]">
                  {c.label[0]}
                  <br />
                  <span className="text-muted">{c.label[1]}</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** /services hero: editorial introduction, Z sculpture and the integrated service index. */
export function ServicesHero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        const split = SplitText.create(q('h1')[0], { type: 'lines', mask: 'lines', linesClass: 'split-line' })
        gsap
          .timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
          .from(split.lines, { yPercent: 112, duration: 1.4, stagger: 0.09 })
          .from(q('[data-fade]'), { autoAlpha: 0, y: 18, duration: 1.1, stagger: 0.07 }, 0.3)
          .from(q('[data-pedestal]'), { autoAlpha: 0, y: 30, duration: 1.4 }, 0.2)
          .from(q('[data-z]'), { autoAlpha: 0, y: 50, duration: 1.6 }, 0.3)
          .from(q('[data-ring]'), { autoAlpha: 0, scale: 0.9, duration: 1.4, stagger: 0.05 }, 0.45)
          .from(q('[data-card] > div'), { autoAlpha: 0, scale: 0.85, duration: 1.1, stagger: 0.06 }, 0.6)
          .from(q('[data-index] li'), { autoAlpha: 0, x: 16, duration: 1, stagger: 0.05 }, 0.4)

        // Scroll: the sculpture turns and the layers separate slightly by depth.
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 }
        gsap.to(q('[data-sculpt]'), { rotateY: -10, rotateX: 8, ease: 'none', scrollTrigger: st })
        gsap.to(q('[data-z]'), { yPercent: -8, ease: 'none', scrollTrigger: st })
        q('[data-card]').forEach((el) => {
          const d = Number((el as HTMLElement).dataset.depth) || 40
          gsap.to(el.firstElementChild, { y: -d * 0.9, ease: 'none', scrollTrigger: st })
        })
        return () => split.revert()
      })

      // Desktop pointer: gentle tilt of the whole composition.
      mm.add(`${MOTION} and (pointer: fine) and (min-width: 1024px)`, () => {
        const target = q('[data-sculpt-pointer]')[0]
        const rx = gsap.quickTo(target, 'rotationX', { duration: 1.2, ease: 'power3.out' })
        const ry = gsap.quickTo(target, 'rotationY', { duration: 1.2, ease: 'power3.out' })
        const el = root.current!
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          ry(((e.clientX - r.left) / r.width - 0.5) * 10)
          rx(-((e.clientY - r.top) / r.height - 0.5) * 6)
        }
        const leave = () => {
          rx(0)
          ry(0)
        }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        return () => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        }
      })
    },
    { scope: root },
  )

  return (
    <header ref={root} className="relative overflow-hidden pb-14 pt-[calc(var(--header-h)+2.5rem)] lg:pb-20 lg:pt-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem] bg-[radial-gradient(55%_60%_at_50%_10%,rgb(199_155_105/0.14),transparent_70%)]" />
      <div className="container-x">
        <div data-fade>
          <Breadcrumbs items={[{ label: 'Services' }]} />
        </div>

        <div className="grid items-center gap-10 md:grid-cols-12 lg:gap-8">
          {/* Introduction */}
          <div className="md:col-span-7 lg:col-span-4">
            <p data-fade className="eyebrow text-muted">
              Service directory · {pad(services.length)} disciplines
            </p>
            <h1 className="mt-5 text-[clamp(2.3rem,3.7vw,3.9rem)] font-medium leading-[0.98] tracking-[-0.045em]">
              Everything your business needs to <span className="serif-accent metal-text pr-[0.05em]">move forward.</span>
            </h1>
            <p data-fade className="mt-6 max-w-md leading-relaxed text-muted">
              From digital experiences to connected business systems, we bring design, engineering and strategy together to build what comes next.
            </p>
            <div data-fade className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <ButtonLink to={contactHref()}>Discuss your project</ButtonLink>
              <ArrowLink to="/services#web-development">Explore all services</ArrowLink>
            </div>
            <ul data-fade className="mt-10 grid grid-cols-3 border-t border-line pt-6" aria-label="At a glance">
              {facts.map((f, i) => (
                <li key={f.text} className={`flex flex-col gap-2 pr-3 ${i ? 'border-l border-line pl-3 sm:pl-4' : ''}`}>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-fg">
                    <f.icon size={16} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="text-[0.8rem] leading-tight text-fg">
                    {f.big && <span className="mr-1 font-medium text-accent-ink">{f.big}</span>}
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sculpture (decorative) */}
          <div aria-hidden="true" className="md:col-span-5 lg:col-span-5">
            <Sculpture />
          </div>

          {/* Service index */}
          <nav aria-label="Service index" data-index className="md:col-span-12 lg:col-span-3 lg:border-l lg:border-line lg:pl-8">
            <ol className="grid border-t border-line sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-1">
              {services.map((s, i) => (
                <li key={s.id} className="border-b border-line">
                  <Link to={servicePath(s)} className="group flex min-h-12 items-center gap-4 py-3.5">
                    <span className="font-mono text-[0.72rem] text-accent-ink">{pad(i + 1)}</span>
                    <span className="flex-1 text-[0.95rem] leading-snug transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
                      {s.title}
                    </span>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-fg transition-colors duration-500 group-hover:border-fg group-hover:bg-fg group-hover:text-canvas group-focus-visible:border-fg">
                      <ArrowRight size={13} aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </header>
  )
}

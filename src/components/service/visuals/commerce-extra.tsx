import { useRef } from 'react'
import { AlertTriangle, Check, Copy, LayoutGrid, LogOut, Package, ShoppingCart } from 'lucide-react'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

type Pair = { name?: string; title?: string; body: string }

/* Mini interface previews for each back-office operation (decorative). */
function OpsPreview({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="flex h-full items-center gap-3 px-3">
        <span className="h-14 w-14 rounded-lg bg-[linear-gradient(100deg,#5a3a24,#c99a6f_40%,#f0d9bd_50%,#a8754c)]" />
        <span className="flex-1 space-y-1.5">
          <span className="block h-1.5 w-3/4 rounded bg-[#171717]/70" />
          <span className="flex gap-1">
            {['#a8754c', '#9aa0a8', '#3a3c41'].map((c) => (
              <span key={c} className="h-3 w-3 rounded-full border border-white shadow" style={{ background: c }} />
            ))}
          </span>
          <span className="block h-1 w-1/3 rounded bg-[#171717]/20" />
        </span>
      </div>
    )
  if (i === 1)
    return (
      <div className="space-y-1.5 p-3 text-[0.55rem]">
        {[
          ['#2048', 'Shipped', 'bg-[#e6efe6] text-[#2f5a35]'],
          ['#2049', 'Packing', 'bg-accent/15 text-accent-ink'],
          ['#2050', 'New', 'bg-[#171717] text-white'],
        ].map(([o, st, c]) => (
          <span key={o} className="flex items-center justify-between rounded-md bg-white px-2 py-1">
            <span className="font-mono">{o}</span>
            <span className={`rounded-full px-1.5 ${c}`}>{st}</span>
          </span>
        ))}
      </div>
    )
  if (i === 2)
    return (
      <div className="space-y-2 p-3">
        {[78, 46, 18].map((w, k) => (
          <span key={k} className="flex items-center gap-2 text-[0.55rem]">
            <Package size={10} className="text-muted" />
            <span className="relative h-1.5 flex-1 rounded-full bg-[#171717]/10">
              <span className={`absolute inset-y-0 left-0 rounded-full ${w < 25 ? 'bg-[#c4705a]' : 'bg-accent'}`} style={{ width: `${w}%` }} />
            </span>
          </span>
        ))}
        <span className="block text-[0.52rem] text-subtle">Synced with warehouse</span>
      </div>
    )
  return (
    <div className="flex h-full items-center justify-center gap-3 p-3">
      <span className="relative h-12 w-20 rounded-lg bg-[linear-gradient(135deg,#1c2433,#2a2018)] p-1.5">
        <span className="block h-2 w-3 rounded-sm bg-[#e8cfae]" />
        <span className="absolute bottom-1.5 left-1.5 h-1 w-10 rounded bg-white/40" />
      </span>
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#2f5a35] text-white">
        <Check size={13} />
      </span>
    </div>
  )
}

export function OpsShowcase({ items }: { items: Pair[] }) {
  const root = useRef<HTMLUListElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.from('[data-op]', { autoAlpha: 0, y: 30, duration: 0.9, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } })
      })
    },
    { scope: root },
  )
  return (
    <ul ref={root} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((o, i) => (
        <li key={o.name} data-op className="group rounded-3xl border border-line bg-surface p-3 transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_30px_50px_-36px_rgb(58_42_29/0.55)]">
          <div aria-hidden="true" className="h-24 overflow-hidden rounded-2xl bg-canvas-alt transition-colors duration-500 group-hover:bg-[#efe6d8]">
            <OpsPreview i={i} />
          </div>
          <div className="px-2 pb-2 pt-4">
            <h3 className="font-medium">{o.name}</h3>
            <p className="mt-1.5 text-[0.92rem] leading-relaxed text-muted">{o.body}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------------------ */
/*  Where stores lose customers: each leak shown as a small scene        */
/* ------------------------------------------------------------------ */
const leakIcons = [ShoppingCart, Copy, LayoutGrid]

function LeakScene({ i }: { i: number }) {
  if (i === 0)
    // Long checkout, customer leaves
    return (
      <div className="flex h-full items-center gap-3 px-4">
        <div className="flex-1 space-y-1">
          {[0, 1, 2, 3, 4].map((k) => (
            <span key={k} className="block h-2 rounded-sm border border-[#171717]/15 bg-white" />
          ))}
          <span className="block text-[0.5rem] text-[#a4513d]">+ delivery fee shown at the last step</span>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f3e1dc] text-[#a4513d] motion-safe:animate-[float-x_2.4s_ease-in-out_infinite]">
          <LogOut size={14} />
        </span>
      </div>
    )
  if (i === 1)
    // Copying between store and back office
    return (
      <div className="flex h-full items-center justify-center gap-2 px-4">
        <span className="h-14 w-16 rounded-md border border-[#171717]/20 bg-white p-1.5">
          <span className="block h-1 w-2/3 rounded bg-[#171717]/50" />
          <span className="mt-1 block h-1 rounded bg-[#171717]/15" />
          <span className="mt-1 block h-1 w-1/2 rounded bg-[#171717]/15" />
        </span>
        <span className="flex flex-col items-center text-[0.5rem] text-[#a4513d]">
          <Copy size={12} />
          by hand
        </span>
        <span className="h-14 w-16 rounded-md border border-[#171717]/20 bg-white p-1.5">
          <span className="block h-1 w-1/2 rounded bg-[#171717]/50" />
          <span className="mt-1 block h-1 rounded bg-[#171717]/15" />
          <span className="mt-1 block h-1 w-2/3 rounded bg-[#c4705a]/40" />
        </span>
      </div>
    )
  // Rigid template
  return (
    <div className="grid h-full grid-cols-4 gap-1 p-4">
      {Array.from({ length: 8 }, (_, k) => (
        <span key={k} className="rounded-sm border border-dashed border-[#171717]/20 bg-white/70" />
      ))}
    </div>
  )
}

export function StoreLeaks({ items }: { items: Pair[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {items.map((p, i) => {
        const Icon = leakIcons[i] ?? AlertTriangle
        return (
          <li key={p.title} data-reveal className="group flex flex-col rounded-3xl border border-line bg-surface p-3">
            <div aria-hidden="true" className="relative h-28 overflow-hidden rounded-2xl bg-canvas-alt">
              <LeakScene i={i} />
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#f3e1dc] px-2 py-0.5 text-[0.58rem] font-medium text-[#8a3b2a]">
                <AlertTriangle size={10} /> Where it leaks
              </span>
            </div>
            <div className="flex items-start gap-3 px-2 pb-2 pt-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-fg text-accent">
                <Icon size={15} aria-hidden="true" />
              </span>
              <span>
                <h3 className="font-medium">{p.title}</h3>
                <p className="mt-1.5 text-[0.92rem] leading-relaxed text-muted">{p.body}</p>
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/* ------------------------------------------------------------------ */
/*  Benefits: each one shown as a store moment                          */
/* ------------------------------------------------------------------ */
function BenefitScene({ i }: { i: number }) {
  if (i === 0)
    // Short checkout: three steps, done
    return (
      <div className="flex h-full flex-col justify-center gap-3 px-5">
        <div className="flex items-center gap-2">
          {['Bag', 'Details', 'Pay'].map((t, k) => (
            <span key={t} className="flex flex-1 items-center gap-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-[#171717]">
                <Check size={12} />
              </span>
              <span className="text-[0.62rem] text-[#ede9e3]/70">{t}</span>
              {k < 2 && <span className="h-px flex-1 bg-accent/50" />}
            </span>
          ))}
        </div>
        <span className="flex items-center justify-between rounded-xl bg-[#ede9e3] px-3 py-2 text-[0.68rem] font-medium text-[#171717]">
          Order confirmed
          <span className="rounded-full bg-[#2f5a35] px-2 py-0.5 text-[0.58rem] text-white">Done</span>
        </span>
      </div>
    )
  if (i === 1)
    // Store ↔ stock ↔ accounts in sync
    return (
      <svg viewBox="0 0 240 110" className="h-full w-full" aria-hidden="true">
        {[
          [40, 'Store'],
          [120, 'Stock'],
          [200, 'Accounts'],
        ].map(([x, t]) => (
          <g key={t as string}>
            <rect x={(x as number) - 30} y="40" width="60" height="30" rx="8" fill="#22252c" stroke="rgb(199 155 105 / 0.5)" />
            <text x={x as number} y="59" fontSize="10" textAnchor="middle" fill="#ede9e3">
              {t}
            </text>
          </g>
        ))}
        {['M70 55 H90', 'M150 55 H170'].map((d, k) => (
          <g key={k}>
            <path d={d} stroke="rgb(199 155 105 / 0.35)" strokeWidth="2" />
            <path d={d} stroke="#e8cfae" strokeWidth="3.5" strokeLinecap="round" pathLength={1} className="flow-dash" style={{ animationDelay: `-${k}s` }} />
          </g>
        ))}
        <text x="120" y="95" fontSize="8.5" textAnchor="middle" fill="rgb(237 233 227 / 0.5)">
          Updated automatically
        </text>
      </svg>
    )
  // Brand-led product page
  return (
    <div className="flex h-full items-center gap-4 px-5">
      <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[radial-gradient(70%_70%_at_50%_45%,#3a2a1d,#0f1116)]">
        <span className="absolute inset-x-[34%] bottom-3 top-4 rounded-[45%_45%_18%_18%/30%_30%_12%_12%] bg-[linear-gradient(100deg,#5a3a24,#c99a6f_40%,#f0d9bd_50%,#a8754c)] transition-transform duration-700 group-hover:-translate-y-1" />
      </span>
      <span className="flex-1 space-y-2">
        <span className="block font-serif text-[1.05rem] italic text-[#ede9e3]">Your product</span>
        <span className="block h-1 w-4/5 rounded bg-[#ede9e3]/20" />
        <span className="flex gap-1.5">
          {['#a8754c', '#9aa0a8', '#3a3c41'].map((c) => (
            <span key={c} className="h-3.5 w-3.5 rounded-full ring-1 ring-white/30" style={{ background: c }} />
          ))}
        </span>
        <span className="inline-block rounded-full bg-accent px-3 py-1 text-[0.6rem] font-medium text-[#171717]">Add to bag</span>
      </span>
    </div>
  )
}

export function StoreBenefits({ items, title }: { items: { title: string; body: string }[]; title: string }) {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION, () => {
        gsap.from('[data-sb]', { autoAlpha: 0, y: 40, duration: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
      })
    },
    { scope: root },
  )
  return (
    <section ref={root} aria-labelledby="store-benefits" className="theme-dark bg-canvas py-20 lg:py-28">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-accent">Business benefits</p>
            <h2 id="store-benefits" className="mt-4 text-[clamp(1.9rem,3.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em]">
              {title}
            </h2>
          </div>
          <p className="text-muted lg:col-span-4 lg:col-start-9">For shoppers, a store that feels effortless. For your team, one that runs itself a little more every day.</p>
        </div>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((b, i) => (
            <li key={b.title} data-sb>
              <div className="group h-full overflow-hidden rounded-3xl border border-line bg-[#1a1c21] transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-accent/50">
                <div aria-hidden="true" className="relative h-40 border-b border-line bg-[radial-gradient(120%_100%_at_50%_0%,rgb(199_155_105/0.14),transparent_70%)]">
                  <BenefitScene i={i} />
                </div>
                <div className="p-6 sm:p-7">
                  <p className="font-mono text-[0.68rem] text-accent">{['For shoppers', 'For your team', 'For your brand'][i] ?? `0${i + 1}`}</p>
                  <h3 className="mt-2 text-xl font-medium tracking-[-0.02em]">{b.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{b.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

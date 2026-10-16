import { useRef } from 'react'
import { Check, FileText, Gauge, MapPin, Search, Settings2, Star, TrendingUp, type LucideIcon } from 'lucide-react'
import { useAutoCycle } from '@/hooks/useAutoCycle'

const pillars: { name: string; icon: LucideIcon; body: string; items: string[] }[] = [
  {
    name: 'Technical SEO',
    icon: Settings2,
    body: 'Make sure search engines can crawl, render and index your site — and that pages load quickly on real devices.',
    items: ['Site audit & crawl fixes', 'Page speed & Core Web Vitals', 'Sitemaps, robots & canonical tags', 'Structured data'],
  },
  {
    name: 'On-page SEO',
    icon: FileText,
    body: 'Titles, descriptions, headings and internal links written for the questions your customers actually search.',
    items: ['Keyword & intent research', 'Titles & meta descriptions', 'Heading structure', 'Internal linking'],
  },
  {
    name: 'Content',
    icon: TrendingUp,
    body: 'Useful pages and articles planned around topics, so your site answers more of the searches that matter.',
    items: ['Topic & content planning', 'Service and landing pages', 'Articles & guides', 'Refreshing existing content'],
  },
  {
    name: 'Local SEO',
    icon: MapPin,
    body: 'Help nearby customers find you, with consistent business details and an optimised business profile.',
    items: ['Google Business Profile', 'Location pages', 'Consistent business listings', 'Review responses'],
  },
  {
    name: 'Reporting',
    icon: Gauge,
    body: 'Plain-language reports on visibility, traffic and enquiries from search — and what we will change next.',
    items: ['Search Console & Analytics set-up', 'Regular progress reports', 'Prioritised next steps'],
  },
]

/* Illustrative preview for each pillar (decorative). */
function Preview({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="space-y-2.5 p-5">
        <p className="text-[0.7rem] font-medium text-muted">Site health checks</p>
        {['Pages can be crawled', 'Sitemap submitted', 'Mobile-friendly layout', 'Images compressed', 'Duplicate pages resolved'].map((t, k) => (
          <p key={t} className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2 text-[0.75rem]">
            {t}
            <span className={`grid h-5 w-5 place-items-center rounded-full ${k < 4 ? 'bg-[#e6efe6] text-[#2f5a35]' : 'bg-accent/15 text-accent-ink'}`}>
              {k < 4 ? <Check size={11} /> : <span className="text-[0.6rem]">…</span>}
            </span>
          </p>
        ))}
      </div>
    )
  if (i === 1)
    return (
      <div className="p-5">
        <p className="text-[0.7rem] font-medium text-muted">Search result preview</p>
        <div className="mt-3 rounded-xl border border-line bg-white p-4">
          <p className="text-[0.68rem] text-[#2f7a4f]">yourbrand.com › services › web-design</p>
          <p className="mt-1 text-[0.95rem] font-medium leading-snug text-[#1a3d8f]">Website Design for Growing Businesses | Your Brand</p>
          <p className="mt-1 text-[0.72rem] leading-relaxed text-muted">Clear, fast websites designed around your customers. See our process, typical timelines and how to start a project.</p>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[0.62rem]">
          {[
            ['Title', 'Clear & specific'],
            ['Description', 'Answers intent'],
            ['H1', 'One per page'],
          ].map(([k, v]) => (
            <span key={k} className="rounded-lg border border-accent-ink/40 bg-[#f3e6d6] px-2 py-1.5">
              <span className="block font-medium">{k}</span>
              <span className="text-muted">{v}</span>
            </span>
          ))}
        </div>
      </div>
    )
  if (i === 2)
    return (
      <div className="relative h-full p-5">
        <p className="text-[0.7rem] font-medium text-muted">Topic cluster</p>
        <svg viewBox="0 0 240 150" className="mt-2 h-[78%] w-full" aria-hidden="true">
          {[
            [40, 30],
            [200, 30],
            [30, 120],
            [210, 120],
            [120, 140],
          ].map(([x, y], k) => (
            <g key={k}>
              <line x1="120" y1="75" x2={x} y2={y} stroke="rgb(140 94 52 / 0.4)" strokeWidth="1.2" />
              <rect x={x - 30} y={y - 11} width="60" height="22" rx="11" fill="#fff" stroke="rgb(23 23 23 / 0.2)" />
              <text x={x} y={y + 3.5} fontSize="8" textAnchor="middle" fill="#171717">
                {['Pricing guide', 'FAQ', 'How-to', 'Case study', 'Checklist'][k]}
              </text>
            </g>
          ))}
          <circle cx="120" cy="75" r="26" fill="#171717" />
          <text x="120" y="73" fontSize="8" textAnchor="middle" fill="#e8cfae">Main</text>
          <text x="120" y="83" fontSize="8" textAnchor="middle" fill="#e8cfae">topic</text>
        </svg>
      </div>
    )
  if (i === 3)
    return (
      <div className="p-5">
        <p className="text-[0.7rem] font-medium text-muted">Local results</p>
        <div className="relative mt-3 h-28 overflow-hidden rounded-xl bg-[repeating-linear-gradient(45deg,#efe9df_0_10px,#f6f2ec_10px_20px)]">
          {[
            [30, 40, false],
            [62, 55, true],
            [80, 30, false],
          ].map(([x, y, me], k) => (
            <span key={k} className={`absolute -translate-x-1/2 -translate-y-full ${me ? 'text-accent-ink' : 'text-[#171717]/30'}`} style={{ left: `${x}%`, top: `${y}%` }}>
              <MapPin size={me ? 26 : 18} fill={me ? '#c79b69' : 'none'} />
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-xl border border-accent-ink/40 bg-white px-3 py-2.5">
          <span>
            <span className="block text-[0.8rem] font-medium">Your Brand</span>
            <span className="text-[0.65rem] text-muted">Open today · directions · website</span>
          </span>
          <span className="flex text-accent">
            {[0, 1, 2, 3, 4].map((k) => (
              <Star key={k} size={11} fill="currentColor" />
            ))}
          </span>
        </div>
      </div>
    )
  return (
    <div className="p-5">
      <p className="text-[0.7rem] font-medium text-muted">Search performance</p>
      <div className="mt-3 rounded-xl border border-line bg-white p-3">
        <svg viewBox="0 0 200 70" className="h-24 w-full" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 60 C25 58 35 50 55 52 S90 40 110 38 S150 24 170 22 S190 14 200 12 L200 70 L0 70 Z" fill="rgb(199 155 105 / 0.18)" />
          <path d="M0 60 C25 58 35 50 55 52 S90 40 110 38 S150 24 170 22 S190 14 200 12" fill="none" stroke="#8c5e34" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
          <path d="M0 64 C30 63 50 58 80 58 S140 50 200 44" fill="none" stroke="rgb(23 23 23 / 0.3)" strokeWidth="1.2" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
        </svg>
        <p className="mt-2 flex gap-4 text-[0.62rem] text-muted">
          <span className="flex items-center gap-1">
            <span className="h-0.5 w-3 bg-accent-ink" /> Clicks
          </span>
          <span className="flex items-center gap-1">
            <span className="h-0.5 w-3 border-t border-dashed border-fg/40" /> Impressions
          </span>
        </p>
      </div>
      <p className="mt-3 text-[0.62rem] text-subtle">Illustrative chart — no real figures.</p>
    </div>
  )
}

export function SeoSection() {
  const root = useRef<HTMLDivElement>(null)
  const { index, select } = useAutoCycle(pillars.length, root, 3600)
  const p = pillars[index]
  return (
    <section aria-labelledby="seo-title" className="border-t border-line py-20 lg:py-28">
      <div ref={root} className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-2 text-accent-ink">
              <Search size={13} aria-hidden="true" /> Search engine optimisation
            </p>
            <h2 id="seo-title" className="mt-4 text-[clamp(1.9rem,3.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em]">
              SEO that helps the right people <span className="serif-accent metal-text">find</span> you
            </h2>
          </div>
          <p className="text-muted lg:col-span-4 lg:col-start-9">
            Five connected parts of search visibility, planned together. Results build over time — we don’t promise rankings, we show you the work and the progress.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div role="tablist" aria-label="SEO services" className="flex gap-2 overflow-x-auto pb-1 lg:col-span-4 lg:flex-col lg:overflow-visible lg:pb-0">
            {pillars.map((pl, i) => (
              <button
                key={pl.name}
                type="button"
                role="tab"
                id={`seo-tab-${i}`}
                aria-selected={i === index}
                aria-controls="seo-panel"
                onClick={() => select(i)}
                className={`flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-500 ${i === index ? 'border-fg bg-surface' : 'border-line hover:border-line-strong'}`}
              >
                <span className={`grid h-9 w-9 place-items-center rounded-lg transition-colors ${i === index ? 'bg-fg text-accent' : 'bg-canvas-alt text-muted'}`}>
                  <pl.icon size={16} aria-hidden="true" />
                </span>
                <span className="whitespace-nowrap font-medium">{pl.name}</span>
              </button>
            ))}
          </div>

          <div id="seo-panel" role="tabpanel" aria-labelledby={`seo-tab-${index}`} className="grid gap-6 lg:col-span-8 md:grid-cols-2">
            <div key={`t${index}`} className="fade-in" style={{ animationDelay: '0ms', animationDuration: '.45s' }}>
              <h3 className="text-2xl font-medium tracking-[-0.025em]">{p.name}</h3>
              <p className="mt-3 leading-relaxed text-muted">{p.body}</p>
              <ul className="mt-6 space-y-2.5">
                {p.items.map((x) => (
                  <li key={x} className="flex items-center gap-2.5">
                    <Check size={15} className="shrink-0 text-accent-ink" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div aria-hidden="true" className="min-h-[17rem] overflow-hidden rounded-3xl border border-line bg-canvas-alt shadow-[0_40px_60px_-45px_rgb(58_42_29/0.6)]">
              <div key={`p${index}`} className="fade-in h-full" style={{ animationDelay: '0ms', animationDuration: '.45s' }}>
                <Preview i={index} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

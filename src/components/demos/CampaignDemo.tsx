import { useState } from 'react'
import { DemoFrame, Seg } from './DemoFrame'

const stages = [
  { name: 'Reach', channels: ['Search (SEO)', 'Paid social', 'Partnerships'], content: 'Problem-led articles and short videos', measure: ['Impressions & reach', 'New visitors', 'Search visibility'] },
  { name: 'Engage', channels: ['Website', 'Email', 'Social'], content: 'Guides, comparisons and case studies', measure: ['Engaged sessions', 'Return visits', 'Content depth'] },
  { name: 'Convert', channels: ['Landing pages', 'Search ads', 'Enquiry forms'], content: 'Clear offers, proof and a simple next step', measure: ['Enquiries & sign-ups', 'Conversion rate', 'Cost per lead'] },
  { name: 'Retain', channels: ['Email', 'CRM journeys', 'Community'], content: 'Onboarding, updates and useful follow-ups', measure: ['Repeat purchases', 'Retention', 'Referrals'] },
]

/** Digital marketing: a campaign journey — channels, content and what is measured at each stage. */
export function CampaignDemo() {
  const [active, setActive] = useState(0)
  const s = stages[active]
  return (
    <DemoFrame
      title="One journey, four jobs"
      controls={stages.map((st, i) => (
        <Seg key={st.name} on={i === active} onClick={() => setActive(i)}>
          {st.name}
        </Seg>
      ))}
      caption="Illustrative structure — metric names only. Real targets are set with you from your own data."
    >
      <div className="grid gap-8 px-5 py-8 lg:grid-cols-12 lg:px-8">
        <ol className="space-y-2 lg:col-span-6" aria-label="Funnel">
          {stages.map((st, i) => (
            <li key={st.name}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`mx-auto flex h-14 items-center justify-between rounded-lg border px-5 text-left transition-all duration-500 ${
                  i === active ? 'border-accent bg-accent/20 text-fg' : 'border-line-strong bg-surface/60 text-muted hover:text-fg'
                }`}
                style={{ width: `${100 - i * 12}%` }}
              >
                <span className="font-medium">{st.name}</span>
                <span className="font-mono text-[0.7rem]">0{i + 1}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="grid gap-6 sm:grid-cols-3 lg:col-span-6 lg:grid-cols-1" aria-live="polite">
          <div>
            <p className="eyebrow text-accent">Channels</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {s.channels.map((c) => (
                <li key={c} className="chip">
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-accent">Content</p>
            <p className="mt-2 text-fg">{s.content}</p>
          </div>
          <div>
            <p className="eyebrow text-accent">What we measure</p>
            <ul className="mt-2 space-y-1.5">
              {s.measure.map((m) => (
                <li key={m} className="flex items-center gap-2 text-fg">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DemoFrame>
  )
}

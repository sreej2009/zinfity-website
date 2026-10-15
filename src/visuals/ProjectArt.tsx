import type { ReactNode } from 'react'
import type { ProjectArtKey } from '@/content/work'

/**
 * Generated artwork for concept projects. Pure HTML/CSS — no numbers or
 * metrics, so nothing reads as an invented result. Replace with a real
 * thumbnail by setting `image` on the project.
 */

const bar = (w: string, o = 0.18) => <span className="block h-[0.45em] rounded-full bg-fg" style={{ width: w, opacity: o }} />

function Window({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`absolute overflow-hidden rounded-[0.9em] border border-fg/10 bg-[#0f1116]/95 shadow-[0_2em_5em_rgb(0_0_0/0.55)] ${className}`}>
      <div className="flex items-center gap-[0.4em] border-b border-fg/[0.06] px-[1em] py-[0.7em]">
        <span className="h-[0.5em] w-[0.5em] rounded-full bg-fg/20" />
        <span className="h-[0.5em] w-[0.5em] rounded-full bg-fg/20" />
        <span className="h-[0.5em] w-[0.5em] rounded-full bg-accent/70" />
      </div>
      {children}
    </div>
  )
}

function Operations() {
  const heights = [38, 52, 44, 68, 58, 76, 64, 82, 70, 88, 78, 92]
  return (
    <>
      <Window className="left-[7%] top-[12%] h-[82%] w-[78%]">
        <div className="flex h-full">
          <div className="w-[18%] space-y-[0.9em] border-r border-fg/[0.06] p-[1em]">
            {bar('70%', 0.3)}
            {['Overview', 'Inventory', 'Production', 'Finance', 'People'].map((l, i) => (
              <div key={l} className={`flex items-center gap-[0.5em] text-[0.62em] ${i === 0 ? 'text-accent-ink' : 'text-fg/40'}`}>
                <span className={`h-[0.5em] w-[0.5em] rounded-[0.15em] ${i === 0 ? 'bg-accent' : 'bg-fg/20'}`} />
                {l}
              </div>
            ))}
          </div>
          <div className="flex-1 space-y-[1em] p-[1.2em]">
            <div className="grid grid-cols-3 gap-[0.8em]">
              {['Inventory', 'Production', 'Finance'].map((l, i) => (
                <div key={l} className="rounded-[0.6em] border border-fg/[0.07] bg-fg/[0.02] p-[0.8em]">
                  <p className="text-[0.55em] uppercase tracking-[0.14em] text-fg/40">{l}</p>
                  <svg viewBox="0 0 100 30" className="mt-[0.6em] h-[2.2em] w-full" preserveAspectRatio="none">
                    <path
                      d={['M0 24 C20 20 30 26 50 16 S80 10 100 6', 'M0 20 C25 24 40 8 60 14 S85 6 100 10', 'M0 26 C20 18 45 22 60 12 S85 14 100 4'][i]}
                      fill="none"
                      stroke={i === 0 ? '#d9b690' : 'rgb(237 233 227 / 0.45)'}
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              ))}
            </div>
            <div className="rounded-[0.6em] border border-fg/[0.07] bg-fg/[0.02] p-[1em]">
              <div className="mb-[0.8em] flex justify-between">{bar('22%', 0.3)}{bar('10%', 0.15)}</div>
              <div className="flex h-[7em] items-end gap-[0.45em]">
                {heights.map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t-[0.25em]"
                    style={{
                      height: `${h}%`,
                      background: i === heights.length - 1 ? 'linear-gradient(#e8cfae,#a8754c)' : 'rgb(237 233 227 / 0.12)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Window>
      <div className="absolute bottom-[10%] right-[5%] w-[30%] space-y-[0.7em] rounded-[0.9em] border border-fg/10 bg-[#13161c]/95 p-[1em] shadow-[0_2em_4em_rgb(0_0_0/0.6)] backdrop-blur">
        <p className="text-[0.55em] uppercase tracking-[0.14em] text-accent-ink">Live sync</p>
        {['Purchase order', 'Batch scheduled', 'Invoice matched'].map((l) => (
          <div key={l} className="flex items-center gap-[0.6em] text-[0.62em] text-fg/70">
            <span className="grid h-[1.4em] w-[1.4em] place-items-center rounded-full border border-accent/50 text-[0.8em] text-accent-ink">✓</span>
            {l}
          </div>
        ))}
      </div>
    </>
  )
}

function Commerce() {
  return (
    <>
      <Window className="left-[6%] top-[10%] h-[84%] w-[88%]">
        <div className="grid h-full grid-cols-[1.25fr_1fr]">
          <div className="relative overflow-hidden bg-[radial-gradient(70%_70%_at_50%_45%,#2a2018,#0f1116)]">
            {/* Sculpted product object */}
            <div className="absolute left-1/2 top-[48%] h-[62%] w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-[45%_45%_18%_18%/30%_30%_12%_12%] bg-[linear-gradient(100deg,#5a3a24_0%,#c99a6f_32%,#f0d9bd_44%,#a8754c_60%,#3a2618_100%)] shadow-[0_3em_4em_rgb(0_0_0/0.6)]" />
            <div className="absolute left-1/2 top-[13%] h-[8%] w-[12%] -translate-x-1/2 rounded-[0.3em] bg-[linear-gradient(90deg,#2a2c31,#9aa0a8,#2a2c31)]" />
            <div className="absolute bottom-[10%] left-1/2 h-[4%] w-[40%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-md" />
            <p className="absolute left-[8%] top-[8%] font-serif text-[1.6em] italic leading-none text-fg/90">Form</p>
          </div>
          <div className="flex flex-col justify-between p-[1.4em]">
            <div className="space-y-[0.7em]">
              <p className="text-[0.55em] uppercase tracking-[0.16em] text-fg/40">New collection</p>
              {bar('85%', 0.45)}
              {bar('60%', 0.45)}
              <div className="pt-[0.4em]">{bar('90%', 0.12)}</div>
              {bar('75%', 0.12)}
            </div>
            <div className="grid grid-cols-3 gap-[0.5em]">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`aspect-square rounded-[0.5em] border ${i === 0 ? 'border-accent/60' : 'border-fg/10'} bg-fg/[0.03]`} />
              ))}
            </div>
            <div className="flex items-center gap-[0.6em]">
              <span className="flex-1 rounded-full bg-fg py-[0.7em] text-center text-[0.62em] font-medium text-canvas">Add to bag</span>
              <span className="grid h-[2.2em] w-[2.2em] place-items-center rounded-full border border-fg/20 text-[0.7em]">♡</span>
            </div>
          </div>
        </div>
      </Window>
    </>
  )
}

function Phone({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`absolute aspect-[9/19] overflow-hidden rounded-[1.6em] border border-fg/15 bg-[#0f1116] p-[0.7em] shadow-[0_2.5em_5em_rgb(0_0_0/0.6)] ${className}`}
    >
      <div className="mx-auto mb-[0.9em] h-[0.55em] w-[30%] rounded-full bg-fg/10" />
      {children}
    </div>
  )
}

function Field() {
  return (
    <>
      <Phone className="left-[16%] top-[9%] w-[27%] -rotate-[5deg]">
        <p className="px-[0.3em] text-[0.55em] uppercase tracking-[0.14em] text-fg/40">Today</p>
        <div className="mt-[0.7em] space-y-[0.55em]">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`rounded-[0.6em] border p-[0.6em] ${i === 0 ? 'border-accent/50 bg-accent/10' : 'border-fg/[0.07]'}`}>
              {bar(i === 0 ? '70%' : '60%', 0.4)}
              <div className="mt-[0.4em]">{bar('40%', 0.15)}</div>
            </div>
          ))}
        </div>
      </Phone>
      <Phone className="left-[52%] top-[14%] w-[27%] rotate-[4deg]">
        <div className="relative mb-[0.7em] aspect-[4/3] overflow-hidden rounded-[0.6em] bg-[linear-gradient(135deg,#1c2433,#2a2018)]">
          <div className="absolute inset-[18%] rounded-[0.4em] border border-dashed border-fg/25" />
        </div>
        <p className="px-[0.2em] text-[0.55em] uppercase tracking-[0.14em] text-fg/40">Checklist</p>
        <div className="mt-[0.5em] space-y-[0.5em]">
          {[true, true, false, false].map((done, i) => (
            <div key={i} className="flex items-center gap-[0.5em]">
              <span className={`h-[0.9em] w-[0.9em] shrink-0 rounded-[0.25em] border ${done ? 'border-accent bg-accent' : 'border-fg/25'}`} />
              {bar(['75%', '60%', '80%', '50%'][i], done ? 0.35 : 0.15)}
            </div>
          ))}
        </div>
        <div className="mt-[0.9em] rounded-full bg-fg py-[0.55em] text-center text-[0.55em] font-medium text-canvas">Sync job</div>
      </Phone>
      <div className="absolute bottom-[12%] left-[38%] flex items-center gap-[0.6em] rounded-full border border-fg/10 bg-[#13161c]/95 px-[1em] py-[0.55em] text-[0.6em] text-fg/70 shadow-xl">
        <span className="h-[0.6em] w-[0.6em] rounded-full bg-accent" />
        Works offline
      </div>
    </>
  )
}

function Automation() {
  const routes = ['Review', 'Draft reply', 'Route to team']
  return (
    <>
      <svg viewBox="0 0 160 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        {[30, 50, 70].map((y) => (
          <path key={`in-${y}`} d={`M36 ${y} C52 ${y} 56 50 70 50`} fill="none" stroke="rgb(237 233 227 / 0.18)" strokeWidth="0.35" />
        ))}
        {[28, 50, 72].map((y, i) => (
          <path
            key={`out-${y}`}
            d={`M92 50 C106 50 108 ${y} 122 ${y}`}
            fill="none"
            stroke={i === 1 ? '#d9b690' : 'rgb(237 233 227 / 0.18)'}
            strokeWidth={i === 1 ? 0.6 : 0.35}
          />
        ))}
      </svg>
      <div className="absolute left-[6%] top-[22%] w-[17%] space-y-[0.6em]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-[0.6em] border border-fg/10 bg-[#13161c] p-[0.6em]">
            {bar('80%', 0.35)}
            <div className="mt-[0.35em]">{bar('55%', 0.15)}</div>
          </div>
        ))}
      </div>
      <div className="absolute left-1/2 top-1/2 grid aspect-square w-[14%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[1.2em] border border-accent/50 bg-[radial-gradient(circle,#2a2018,#0f1116)] shadow-[0_0_4em_rgb(217_182_144/0.25)]">
        <span className="text-[0.55em] uppercase tracking-[0.16em] text-accent-ink">Classify</span>
      </div>
      <div className="absolute right-[6%] top-[20%] flex h-[60%] w-[20%] flex-col justify-between">
        {routes.map((r, i) => (
          <div
            key={r}
            className={`rounded-[0.6em] border p-[0.6em] text-[0.6em] ${i === 1 ? 'border-accent/60 bg-accent/10 text-fg' : 'border-fg/10 bg-[#13161c] text-fg/50'}`}
          >
            {r}
          </div>
        ))}
      </div>
      <div className="absolute bottom-[8%] left-1/2 flex -translate-x-1/2 items-center gap-[0.6em] rounded-full border border-fg/10 bg-[#13161c]/95 px-[1em] py-[0.55em] text-[0.6em] text-fg/70">
        <span className="h-[0.6em] w-[0.6em] rounded-full bg-accent" /> Human approval step
      </div>
    </>
  )
}

const arts: Record<ProjectArtKey, () => ReactNode> = {
  operations: Operations,
  commerce: Commerce,
  field: Field,
  automation: Automation,
}

const backdrops: Record<ProjectArtKey, string> = {
  operations: 'radial-gradient(80% 90% at 85% 15%, #1d2638 0%, #0b0d12 60%)',
  commerce: 'radial-gradient(80% 90% at 20% 20%, #2b2017 0%, #0b0c10 62%)',
  field: 'radial-gradient(80% 90% at 50% 0%, #16202f 0%, #0a0b0f 60%)',
  automation: 'radial-gradient(70% 80% at 50% 50%, #241b14 0%, #0a0b0f 65%)',
}

export function ProjectArt({ art }: { art: ProjectArtKey }) {
  const Art = arts[art]
  return (
    <div
      className="theme-dark absolute inset-0 text-[1.55cqw] text-fg"
      style={{ background: backdrops[art] }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgb(237 233 227 / 0.035) 1px, transparent 1px), linear-gradient(90deg, rgb(237 233 227 / 0.035) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <Art />
    </div>
  )
}

import { useId, useState } from 'react'
import { DemoFrame } from './DemoFrame'

const levels = ['Sketch', 'Wireframe', 'Interface', 'System'] as const
const notes = [
  'Ideas on paper: structure and priorities before pixels.',
  'Layout and content agreed in grey boxes — fast to change.',
  'Type, colour, imagery and real states come in.',
  'The same screen expressed as reusable components and tokens.',
]

/** UI/UX: one screen at four levels of fidelity, controlled by a slider. */
export function DesignCanvasDemo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const [level, setLevel] = useState(2)
  const id = useId()
  const sketch = level === 0
  const wire = level === 1
  const ui = level >= 2
  const system = level === 3

  const box = (extra = '') =>
    `${extra} transition-all duration-500 ${
      sketch ? 'border-2 border-dashed border-[#171717]/50 bg-transparent rounded-[10px_4px_12px_6px]' : wire ? 'border border-black/10 bg-black/[0.07] rounded-md' : 'rounded-lg'
    } ${system ? 'outline outline-1 outline-offset-2 outline-[#c79b69]' : ''}`

  return (
    <DemoFrame
      tone={tone}
      title="From sketch to design system"
      caption={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor={id} className="shrink-0">
            Fidelity
          </label>
          <input
            id={id}
            type="range"
            min={0}
            max={3}
            step={1}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            aria-valuetext={levels[level]}
            className="w-full max-w-xs accent-[#c79b69]"
          />
          <span className="text-fg" aria-live="polite">
            {levels[level]} — {notes[level]}
          </span>
        </div>
      }
    >
      <div className="grid items-center gap-8 px-5 py-10 lg:grid-cols-12 lg:px-10">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-[#171717]/10 bg-[#f7f5f0] p-5 text-[#171717] shadow-[0_24px_40px_-30px_rgb(58_42_29/0.5)] lg:col-span-7" aria-hidden="true">
          <div className="flex items-center justify-between">
            <span className={box(`h-6 w-24 ${ui ? 'bg-[#171717]' : ''}`)} />
            <span className={box(`h-7 w-7 rounded-full ${ui ? 'bg-[linear-gradient(135deg,#e8cfae,#a8754c)]' : ''}`)} />
          </div>
          <div className={box(`relative mt-5 aspect-[16/9] overflow-hidden ${ui ? 'bg-[linear-gradient(135deg,#1c2433,#2a2018)]' : ''}`)}>
            {ui && <span className="absolute bottom-3 left-3 text-[0.8rem] font-medium text-white">Project overview</span>}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {['Tasks', 'Files', 'Team'].map((t) => (
              <div key={t} className={box(`p-3 ${ui ? 'border border-black/10 bg-white' : ''}`)}>
                {ui ? <span className="text-[0.7rem] font-medium">{t}</span> : <span className="block h-2 w-10 rounded bg-current opacity-20" />}
                <span className="mt-2 block h-1.5 w-full rounded bg-black/10" />
              </div>
            ))}
          </div>
          <span className={box(`mt-5 flex h-10 items-center justify-center text-[0.75rem] ${ui ? 'bg-[#171717] text-white' : ''}`)}>{ui ? 'Continue' : ''}</span>
        </div>
        <div className="lg:col-span-5">
          <ol className="space-y-3">
            {levels.map((l, i) => (
              <li key={l}>
                <button
                  type="button"
                  onClick={() => setLevel(i)}
                  aria-pressed={level === i}
                  className={`flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left transition-colors ${
                    level === i ? 'border-accent bg-accent/15 text-fg' : 'border-line-strong text-muted hover:text-fg'
                  }`}
                >
                  <span className="font-mono text-[0.72rem]">0{i + 1}</span>
                  {l}
                </button>
              </li>
            ))}
          </ol>
          {system && (
            <dl className="mt-6 grid grid-cols-3 gap-3 text-[0.75rem]">
              <div>
                <dt className="text-subtle">Radius</dt>
                <dd className="text-fg">8 px</dd>
              </div>
              <div>
                <dt className="text-subtle">Spacing</dt>
                <dd className="text-fg">4 px grid</dd>
              </div>
              <div>
                <dt className="text-subtle">Accent</dt>
                <dd className="flex items-center gap-1.5 text-fg">
                  <span className="h-3 w-3 rounded-full bg-accent" /> Bronze
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </DemoFrame>
  )
}

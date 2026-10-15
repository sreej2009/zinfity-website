import { useState } from 'react'
import { Check, ShoppingBag } from 'lucide-react'
import { DemoFrame } from './DemoFrame'

const finishes = [
  { name: 'Bronze', fill: 'linear-gradient(100deg,#5a3a24 0%,#c99a6f 32%,#f0d9bd 44%,#a8754c 60%,#3a2618 100%)' },
  { name: 'Steel', fill: 'linear-gradient(100deg,#2a2c31 0%,#9aa0a8 32%,#eef0f2 44%,#7d838c 60%,#1f2125 100%)' },
  { name: 'Graphite', fill: 'linear-gradient(100deg,#0f1012 0%,#3a3c41 32%,#7b7e85 44%,#2a2c30 60%,#0b0b0d 100%)' },
]
const sizes = ['500 ml', '750 ml']
const journey = ['Discover', 'Evaluate', 'Purchase', 'Fulfil', 'Return']

/** E-commerce: a product page with variants, add-to-bag and the journey it advances. */
export function StorefrontDemo() {
  const [finish, setFinish] = useState(0)
  const [size, setSize] = useState(0)
  const [bag, setBag] = useState(0)
  const [stage, setStage] = useState(1)

  const add = () => {
    setBag((b) => b + 1)
    setStage((s) => Math.max(s, 2))
  }

  return (
    <DemoFrame title="A product page that sells and stays simple to run" caption="Fictional product for demonstration.">
      <div className="grid gap-8 px-5 py-8 lg:grid-cols-12 lg:px-8">
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-2xl bg-[radial-gradient(70%_70%_at_50%_45%,#2a2018,#0f1116)] lg:col-span-6" aria-hidden="true">
          <div className="relative h-[70%] w-[28%]">
            <div className="absolute inset-x-[30%] top-0 h-[10%] rounded-[0.3em] bg-[linear-gradient(90deg,#2a2c31,#9aa0a8,#2a2c31)]" />
            <div
              className="absolute inset-x-0 bottom-0 top-[9%] rounded-[45%_45%_18%_18%/30%_30%_12%_12%] shadow-[0_3em_4em_rgb(0_0_0/0.6)] transition-[background] duration-700"
              style={{ background: finishes[finish].fill, transform: size ? 'scale(1.08, 1.12)' : 'none', transformOrigin: 'bottom', transition: 'transform .6s, background .7s' }}
            />
          </div>
          <span className="absolute bottom-[8%] left-1/2 h-[3%] w-[34%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-md" />
        </div>

        <div className="flex flex-col lg:col-span-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-subtle">New collection</p>
              <p className="mt-2 text-3xl font-medium tracking-[-0.03em]">Form Bottle</p>
            </div>
            <span className="relative grid h-11 w-11 place-items-center rounded-full border border-line-strong" aria-label={`Bag: ${bag} item${bag === 1 ? '' : 's'}`} role="status">
              <ShoppingBag size={18} aria-hidden="true" />
              {bag > 0 && (
                <span key={bag} className="fade-in absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.65rem] font-semibold text-[#171717]">
                  {bag}
                </span>
              )}
            </span>
          </div>

          <fieldset className="mt-6">
            <legend className="eyebrow text-subtle">Finish — {finishes[finish].name}</legend>
            <div className="mt-3 flex gap-3">
              {finishes.map((f, i) => (
                <button
                  key={f.name}
                  type="button"
                  aria-pressed={i === finish}
                  aria-label={f.name}
                  onClick={() => {
                    setFinish(i)
                    setStage((s) => Math.max(s, 1))
                  }}
                  className={`h-10 w-10 rounded-full border-2 transition-transform ${i === finish ? 'scale-110 border-accent' : 'border-transparent'}`}
                  style={{ background: f.fill }}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="eyebrow text-subtle">Size</legend>
            <div className="mt-3 flex gap-2">
              {sizes.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={i === size}
                  onClick={() => setSize(i)}
                  className={`rounded-lg border px-4 py-2 text-[0.85rem] ${i === size ? 'border-fg bg-fg text-canvas' : 'border-line-strong'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>

          <button type="button" onClick={add} className="mt-8 rounded-full bg-fg py-3 text-[0.9rem] font-medium text-canvas transition-transform active:scale-[0.98]">
            Add to bag
          </button>

          <ol className="mt-auto flex gap-1 pt-8" aria-label="Shopping journey">
            {journey.map((j, i) => (
              <li key={j} className="flex-1">
                <span className={`block h-1 rounded-full transition-colors duration-500 ${i <= stage ? 'bg-accent' : 'bg-line-strong'}`} />
                <span className={`mt-2 flex items-center gap-1 text-[0.68rem] ${i <= stage ? 'text-fg' : 'text-subtle'}`}>
                  {i < stage && <Check size={10} aria-hidden="true" />}
                  {j}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </DemoFrame>
  )
}

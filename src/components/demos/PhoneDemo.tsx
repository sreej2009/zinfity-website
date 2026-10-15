import { useState } from 'react'
import { CheckCircle2, Circle, CloudOff, MapPin, RefreshCw } from 'lucide-react'
import { DemoFrame, Seg } from './DemoFrame'

const screens = ['Today', 'Job', 'Checklist', 'Sync'] as const
const checklist = ['Isolate power supply', 'Inspect wiring', 'Replace filter', 'Take after photo']

/** Mobile: a field-service app with real screen transitions and an offline mode. */
export function PhoneDemo() {
  const [screen, setScreen] = useState(0)
  const [offline, setOffline] = useState(false)
  const [done, setDone] = useState<boolean[]>([true, false, false, false])
  const [synced, setSynced] = useState(0)
  const pending = done.filter(Boolean).length - synced

  const toggle = (i: number) => setDone((d) => d.map((v, k) => (k === i ? !v : v)))
  const sync = () => !offline && setSynced(done.filter(Boolean).length)

  return (
    <DemoFrame
      title="A field app that works offline"
      controls={
        <Seg on={offline} onClick={() => setOffline((o) => !o)} label="Toggle offline mode">
          <CloudOff size={14} aria-hidden="true" /> {offline ? 'Offline' : 'Online'}
        </Seg>
      }
    >
      <div className="flex flex-col items-center gap-6 px-4 py-8">
        {/* Phone */}
        <div className="relative w-[16.5rem] rounded-[2.4rem] border border-line-strong bg-[#0c0d10] p-2.5 shadow-[0_40px_60px_-20px_rgb(0_0_0/0.6)]">
          <div className="relative h-[30rem] overflow-hidden rounded-[1.9rem] bg-[#f7f5f0] text-[#171717]">
            <div className="flex items-center justify-between px-5 pb-2 pt-3 text-[0.62rem] font-medium">
              <span>9:41</span>
              <span className="h-4 w-16 rounded-full bg-black" aria-hidden="true" />
              <span>{offline ? 'No signal' : '5G'}</span>
            </div>
            {offline && (
              <p className="mx-3 mb-1 rounded-lg bg-[#171717] px-3 py-1.5 text-[0.62rem] text-white">Offline — changes are saved on this device</p>
            )}
            <div className="flex h-full transition-transform duration-700 ease-[var(--ease-in-out-quart)]" style={{ transform: `translateX(-${screen * 100}%)` }}>
              {/* Today */}
              <section aria-hidden={screen !== 0} className="w-full shrink-0 px-4">
                <p className="mt-2 text-[1.1rem] font-semibold">Today</p>
                {['Air handling unit', 'Pump inspection', 'Panel check'].map((j, i) => (
                  <button
                    key={j}
                    type="button"
                    tabIndex={screen === 0 ? 0 : -1}
                    onClick={() => setScreen(1)}
                    className={`mt-2 block w-full rounded-xl border p-3 text-left text-[0.75rem] ${i === 0 ? 'border-[#c79b69] bg-[#c79b69]/15' : 'border-black/10'}`}
                  >
                    <span className="font-medium">{j}</span>
                    <span className="mt-1 block text-black/50">Site {i + 1} · Scheduled</span>
                  </button>
                ))}
              </section>
              {/* Job */}
              <section aria-hidden={screen !== 1} className="w-full shrink-0 px-4">
                <p className="mt-2 text-[1.1rem] font-semibold">Air handling unit</p>
                <div className="mt-3 grid aspect-[4/3] place-items-center rounded-xl bg-[linear-gradient(135deg,#dfe4ec,#c7cfdb)]">
                  <MapPin size={22} className="text-[#8c5e34]" aria-hidden="true" />
                </div>
                <p className="mt-3 text-[0.72rem] text-black/60">Quarterly service. Access via rear entrance.</p>
                <button type="button" tabIndex={screen === 1 ? 0 : -1} onClick={() => setScreen(2)} className="mt-4 w-full rounded-full bg-[#171717] py-2 text-[0.72rem] text-white">
                  Start checklist
                </button>
              </section>
              {/* Checklist */}
              <section aria-hidden={screen !== 2} className="w-full shrink-0 px-4">
                <p className="mt-2 text-[1.1rem] font-semibold">Checklist</p>
                <ul className="mt-3 space-y-2">
                  {checklist.map((c, i) => (
                    <li key={c}>
                      <button
                        type="button"
                        tabIndex={screen === 2 ? 0 : -1}
                        onClick={() => toggle(i)}
                        aria-pressed={done[i]}
                        className="flex w-full items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-left text-[0.74rem]"
                      >
                        {done[i] ? <CheckCircle2 size={16} className="text-[#8c5e34]" aria-hidden="true" /> : <Circle size={16} className="text-black/30" aria-hidden="true" />}
                        <span className={done[i] ? 'text-black/50 line-through' : ''}>{c}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
              {/* Sync */}
              <section aria-hidden={screen !== 3} className="w-full shrink-0 px-4">
                <p className="mt-2 text-[1.1rem] font-semibold">Sync</p>
                <div className="mt-4 rounded-xl border border-black/10 p-4 text-center">
                  <p className="text-[2rem] font-semibold leading-none">{Math.max(0, pending)}</p>
                  <p className="mt-1 text-[0.7rem] text-black/55">updates waiting</p>
                  <button
                    type="button"
                    tabIndex={screen === 3 ? 0 : -1}
                    onClick={sync}
                    disabled={offline || pending <= 0}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-4 py-2 text-[0.7rem] text-white disabled:opacity-40"
                  >
                    <RefreshCw size={12} aria-hidden="true" /> {offline ? 'Waiting for signal' : 'Sync now'}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
        {/* Screen tabs */}
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="App screens">
          {screens.map((s, i) => (
            <Seg key={s} on={screen === i} onClick={() => setScreen(i)}>
              {s}
            </Seg>
          ))}
        </div>
        <p className="text-center text-[0.82rem] text-muted" aria-live="polite">
          {offline ? `Offline: ${Math.max(0, pending)} update(s) stored on the device.` : pending > 0 ? `${pending} update(s) ready to sync.` : 'Everything is in sync.'}
        </p>
      </div>
    </DemoFrame>
  )
}

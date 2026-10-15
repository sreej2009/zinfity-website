import { useId, useState } from 'react'
import { Monitor, Smartphone, Tablet } from 'lucide-react'
import { DemoFrame, Seg } from './DemoFrame'

type Device = 'desktop' | 'tablet' | 'mobile'
const widths: Record<Device, string> = { desktop: '100%', tablet: '64%', mobile: '34%' }

/** Web: a live page that reflows across devices, with an editable headline. */
export function ResponsiveDemo() {
  const [device, setDevice] = useState<Device>('desktop')
  const [headline, setHeadline] = useState('Clear websites for growing businesses')
  const id = useId()
  const cols = device === 'desktop' ? 'grid-cols-3' : device === 'tablet' ? 'grid-cols-2' : 'grid-cols-1'
  const small = device === 'mobile'

  return (
    <DemoFrame
      title="One layout, every screen"
      controls={
        <>
          <Seg on={device === 'desktop'} onClick={() => setDevice('desktop')} label="Desktop view">
            <Monitor size={14} aria-hidden="true" /> <span className="hidden sm:inline">Desktop</span>
          </Seg>
          <Seg on={device === 'tablet'} onClick={() => setDevice('tablet')} label="Tablet view">
            <Tablet size={14} aria-hidden="true" /> <span className="hidden sm:inline">Tablet</span>
          </Seg>
          <Seg on={device === 'mobile'} onClick={() => setDevice('mobile')} label="Mobile view">
            <Smartphone size={14} aria-hidden="true" /> <span className="hidden sm:inline">Mobile</span>
          </Seg>
        </>
      }
      caption={
        <label htmlFor={id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="shrink-0">Edit the headline — it’s your content, not ours:</span>
          <input
            id={id}
            value={headline}
            maxLength={60}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full rounded-md border border-line-strong bg-transparent px-3 py-1.5 text-fg outline-none focus:border-accent"
          />
        </label>
      }
    >
      <div className="flex min-h-[26rem] items-start justify-center px-4 py-8 sm:px-8 lg:min-h-[30rem]">
        <div
          className="w-full overflow-hidden rounded-xl border border-line-strong bg-[#f7f5f0] text-[#171717] shadow-2xl transition-[max-width] duration-700 ease-[var(--ease-in-out-quart)]"
          style={{ maxWidth: widths[device], minWidth: '15rem' }}
          aria-label={`Website preview, ${device} layout`}
        >
          <div className="flex items-center gap-1.5 border-b border-black/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-black/15" />
            <span className="h-2 w-2 rounded-full bg-black/15" />
            <span className="h-2 w-2 rounded-full bg-[#c79b69]" />
            <span className="ml-3 h-3 flex-1 rounded bg-black/5" />
          </div>
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="h-3 w-16 rounded bg-black/80" />
              {small ? (
                <span className="flex flex-col gap-1" aria-hidden="true">
                  <span className="h-0.5 w-4 bg-black/70" />
                  <span className="h-0.5 w-4 bg-black/70" />
                </span>
              ) : (
                <span className="flex gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className="h-2 w-8 rounded bg-black/20" />
                  ))}
                </span>
              )}
            </div>
            <div className={`mt-6 grid gap-4 ${small ? '' : 'grid-cols-[1.3fr_1fr]'} items-center`}>
              <div>
                <p className={`font-medium leading-[1.05] tracking-[-0.03em] transition-all duration-500 ${small ? 'text-xl' : device === 'tablet' ? 'text-2xl' : 'text-[1.9rem]'}`}>
                  {headline || ' '}
                </p>
                <span className="mt-3 block h-2 w-4/5 rounded bg-black/15" />
                <span className="mt-1.5 block h-2 w-3/5 rounded bg-black/15" />
                <span className="mt-4 inline-block rounded-full bg-[#171717] px-3 py-1.5 text-[0.65rem] text-white">Get in touch</span>
              </div>
              <div className="aspect-[4/3] rounded-lg bg-[linear-gradient(135deg,#e8cfae,#a8754c)]" />
            </div>
            <div className={`mt-6 grid gap-3 ${cols}`}>
              {['Services', 'Work', 'About'].map((t) => (
                <div key={t} className="rounded-lg border border-black/10 p-3">
                  <span className="text-[0.7rem] font-medium">{t}</span>
                  <span className="mt-2 block h-1.5 w-full rounded bg-black/10" />
                  <span className="mt-1 block h-1.5 w-2/3 rounded bg-black/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DemoFrame>
  )
}

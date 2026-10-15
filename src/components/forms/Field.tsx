import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react'

type FieldProps = {
  id: string
  label: string
  error?: string
  optional?: boolean
  hint?: string
  children: ReactNode
  className?: string
}

/** Label + control + reserved error line (so the layout never jumps). */
export function Field({ id, label, error, optional, hint, children, className = '' }: FieldProps) {
  return (
    <div className={className} data-form-row>
      <label htmlFor={id} className="eyebrow flex items-center justify-between gap-4 text-muted">
        <span>{label}</span>
        {optional && <span className="normal-case tracking-normal text-subtle">Optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-[0.8rem] text-subtle">
          {hint}
        </p>
      )}
      <p id={`${id}-error`} className={`mt-2 min-h-[1.25rem] text-[0.82rem] text-danger ${error ? '' : 'hidden'}`}>
        {error}
      </p>
    </div>
  )
}

type Tone = 'error' | 'info' | 'success'

/** Inline status message used after submitting a form. */
export function FormNotice({ tone, children }: { tone: Tone; children: ReactNode }) {
  const styles: Record<Tone, string> = {
    error: 'border-danger/40 bg-danger/[0.06]',
    info: 'border-line-strong bg-canvas-alt',
    success: 'border-success/40 bg-success/[0.06]',
  }
  const Icon = tone === 'error' ? AlertCircle : tone === 'success' ? CheckCircle2 : Mail
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex gap-3 rounded-xl border p-4 text-[0.92rem] text-fg ${styles[tone]}`}>
      <Icon
        size={18}
        aria-hidden="true"
        className={`mt-0.5 shrink-0 ${tone === 'error' ? 'text-danger' : tone === 'success' ? 'text-success' : 'text-accent-ink'}`}
      />
      <div>{children}</div>
    </div>
  )
}

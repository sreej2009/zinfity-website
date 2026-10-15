import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useSearchParams } from 'react-router'
import { CheckCircle2, ChevronDown, Loader2, X } from 'lucide-react'
import { site } from '@/config/site'
import { serviceTitles } from '@/content/services'
import { budgetOptions, notSureService } from '@/content/enquiry'
import { Button } from '@/components/ui/Button'
import { EMAIL_RE, openMailto, postJson } from '@/lib/delivery'
import { Field, FormNotice } from './Field'

type Values = { name: string; email: string; company: string; service: string; budget: string; message: string; website: string }
type FieldName = Exclude<keyof Values, 'website'>
type Errors = Partial<Record<FieldName, string>>
type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'handoff' }
  | { kind: 'error'; message: string }
  | { kind: 'unavailable' }

const empty: Values = { name: '', email: '', company: '', service: '', budget: '', message: '', website: '' }
const serviceOptions = [...serviceTitles, notSureService]
const order: FieldName[] = ['name', 'email', 'company', 'service', 'budget', 'message']

function validate(v: Values): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!v.email.trim()) e.email = 'Please enter your work email.'
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'That email address doesn’t look right.'
  if (!v.service) e.service = 'Choose the service you need.'
  if (!v.budget) e.budget = 'Choose an approximate budget.'
  if (v.message.trim().length < 20) e.message = 'Tell us a little more — at least 20 characters.'
  return e
}

/**
 * Project enquiry form. Reads `?service=` and `?project=` so any CTA on the site
 * can open it with context pre-filled. Never reports delivery unless confirmed.
 */
export function EnquiryForm() {
  const uid = useId()
  const fid = (f: FieldName) => `${uid}-${f}`
  const [params, setParams] = useSearchParams()
  const statusRef = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState<Values>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [project, setProject] = useState<string | null>(null)
  const [engagement, setEngagement] = useState<string | null>(null)
  const [flash, setFlash] = useState(false)

  // Apply context from the URL (e.g. /contact?service=ERP%20%26%20CRM%20Solutions&project=…).
  const qService = params.get('service')
  const qProject = params.get('project')
  const qEngagement = params.get('engagement')
  useEffect(() => {
    if (qService && serviceOptions.includes(qService)) {
      setValues((v) => ({ ...v, service: qService }))
      setErrors((e) => ({ ...e, service: undefined }))
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 1800)
      return () => clearTimeout(t)
    }
  }, [qService])
  useEffect(() => {
    setProject(qProject && qProject.length < 120 ? qProject : null)
  }, [qProject])
  useEffect(() => {
    setEngagement(qEngagement && qEngagement.length < 60 ? qEngagement : null)
  }, [qEngagement])

  const clearEngagement = () => {
    setEngagement(null)
    const next = new URLSearchParams(params)
    next.delete('engagement')
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const clearProject = () => {
    setProject(null)
    const next = new URLSearchParams(params)
    next.delete('project')
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const update = (field: keyof Values) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: e.target.value }
    setValues(next)
    if (field !== 'website' && (touched[field] || errors[field])) setErrors((er) => ({ ...er, [field]: validate(next)[field] }))
    if (status.kind === 'error' || status.kind === 'unavailable') setStatus({ kind: 'idle' })
  }

  const blur = (field: FieldName) => () => {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors((er) => ({ ...er, [field]: validate(values)[field] }))
  }

  const focusStatus = () => requestAnimationFrame(() => statusRef.current?.focus())

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (status.kind === 'submitting') return
    const found = validate(values)
    setErrors(found)
    setTouched(Object.fromEntries(order.map((f) => [f, true])))
    const first = order.find((f) => found[f])
    if (first) {
      document.getElementById(fid(first))?.focus()
      return
    }
    if (values.website) {
      // Honeypot filled: silently drop bot submissions.
      setStatus({ kind: 'idle' })
      return
    }

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company.trim(),
      service: values.service,
      budget: values.budget,
      message: values.message.trim(),
      context: [project && `Similar to: ${project}`, engagement && `Engagement model: ${engagement}`].filter(Boolean).join(' · ') || undefined,
      source: 'zinfity-website',
    }

    if (site.contact.endpoint) {
      setStatus({ kind: 'submitting' })
      const res = await postJson(site.contact.endpoint, payload)
      if (res.ok) {
        setStatus({ kind: 'success' })
        setValues(empty)
        setTouched({})
      } else {
        setStatus({
          kind: 'error',
          message: 'Your enquiry couldn’t be sent. Please check your connection and try again — your details are still here.',
        })
      }
      focusStatus()
      return
    }

    if (site.contact.email) {
      openMailto(site.contact.email, `Project enquiry — ${payload.service}`, [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        ...(payload.company ? [`Company: ${payload.company}`] : []),
        `Service: ${payload.service}`,
        `Budget: ${payload.budget}`,
        ...(payload.context ? [payload.context] : []),
        '',
        payload.message,
      ])
      setStatus({ kind: 'handoff' })
      focusStatus()
      return
    }

    setStatus({ kind: 'unavailable' })
    focusStatus()
  }

  const inputProps = (f: FieldName) => ({
    id: fid(f),
    name: f,
    value: values[f],
    onChange: update(f),
    onBlur: blur(f),
    'aria-invalid': errors[f] ? true : undefined,
    'aria-describedby': errors[f] ? `${fid(f)}-error` : undefined,
  })

  if (status.kind === 'success') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="flex min-h-[26rem] flex-col items-start justify-center outline-none">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-success/40 text-success">
          <CheckCircle2 size={24} aria-hidden="true" />
        </span>
        <h3 className="text-title mt-8">Thank you — your enquiry has been sent.</h3>
        <p className="mt-4 max-w-md text-muted">We’ll review the details and reply to the email address you provided.</p>
        <Button variant="ghost" size="sm" className="mt-10" onClick={() => setStatus({ kind: 'idle' })}>
          Send another enquiry
        </Button>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-label="Project enquiry" className="relative grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {engagement && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas-alt px-4 py-3 text-[0.9rem] sm:col-span-2">
          <p>
            <span className="eyebrow mr-2 text-accent-ink">Engagement</span>
            <strong className="font-medium">{engagement}</strong>
          </p>
          <button type="button" onClick={clearEngagement} aria-label="Remove engagement model" className="grid h-8 w-8 place-items-center rounded-full hover:bg-canvas">
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      )}
      {project && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas-alt px-4 py-3 text-[0.9rem] sm:col-span-2">
          <p>
            <span className="eyebrow mr-2 text-accent-ink">Context</span>A project similar to <strong className="font-medium">{project}</strong>
          </p>
          <button type="button" onClick={clearProject} aria-label="Remove project context" className="grid h-8 w-8 place-items-center rounded-full hover:bg-canvas">
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      )}
      <Field id={fid('name')} label="Name" error={errors.name}>
        <input {...inputProps('name')} type="text" autoComplete="name" required className="field-input" placeholder="Your full name" />
      </Field>
      <Field id={fid('email')} label="Work email" error={errors.email}>
        <input {...inputProps('email')} type="email" inputMode="email" autoComplete="email" required className="field-input" placeholder="you@company.com" />
      </Field>
      <Field id={fid('company')} label="Company" optional className="sm:col-span-2">
        <input {...inputProps('company')} type="text" autoComplete="organization" className="field-input" placeholder="Company or organisation" />
      </Field>
      <Field id={fid('service')} label="Required service" error={errors.service}>
        <div className="relative">
          <select
            {...inputProps('service')}
            required
            className={`field-input transition-[border-color,box-shadow] ${values.service ? '' : 'text-subtle'} ${
              flash ? '!border-accent-ink shadow-[0_1px_0_0_var(--color-accent-ink)]' : ''
            }`}
          >
            <option value="" disabled>
              Select a service
            </option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-muted" />
        </div>
      </Field>
      <Field id={fid('budget')} label="Project budget" error={errors.budget}>
        <div className="relative">
          <select {...inputProps('budget')} required className={`field-input ${values.budget ? '' : 'text-subtle'}`}>
            <option value="" disabled>
              Select a range
            </option>
            {budgetOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-muted" />
        </div>
      </Field>
      <Field id={fid('message')} label="Project description" error={errors.message} className="sm:col-span-2">
        <textarea
          {...inputProps('message')}
          required
          rows={5}
          maxLength={4000}
          className="field-input"
          placeholder="What are you building or improving? Goals, timeline, anything we should know."
        />
      </Field>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={update('website')} />
      </div>

      <div data-form-row className="flex flex-col-reverse items-start gap-5 pt-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[0.82rem] leading-relaxed text-subtle">We only use these details to respond to your enquiry.</p>
        <Button type="submit" disabled={status.kind === 'submitting'} icon={status.kind !== 'submitting'} className="w-full sm:w-auto">
          {status.kind === 'submitting' ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending…
            </span>
          ) : (
            'Send enquiry'
          )}
        </Button>
      </div>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none sm:col-span-2">
        {status.kind === 'error' && <FormNotice tone="error">{status.message}</FormNotice>}
        {status.kind === 'unavailable' && (
          <FormNotice tone="error">
            Online enquiries aren’t connected yet, so this message has not been sent. Your details are still in the form.
          </FormNotice>
        )}
        {status.kind === 'handoff' && (
          <FormNotice tone="info">
            Your email app should now open with the enquiry filled in — please press send there to deliver it. If nothing opened, email{' '}
            <a className="underline underline-offset-4" href={`mailto:${site.contact.email}`}>
              {site.contact.email}
            </a>
            .
          </FormNotice>
        )}
      </div>
    </form>
  )
}

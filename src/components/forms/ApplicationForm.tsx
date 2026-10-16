import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { site } from '@/config/site'
import { dbConfigured, saveApplication } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { EMAIL_RE, openMailto, postFormData } from '@/lib/delivery'
import { Field, FormNotice } from './Field'

type Values = { name: string; email: string; phone: string; location: string; link: string; message: string; consent: boolean; website: string }
type FieldName = 'name' | 'email' | 'phone' | 'location' | 'link' | 'cv' | 'message' | 'consent'
type Errors = Partial<Record<FieldName, string>>
type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'success' } | { kind: 'handoff' } | { kind: 'error' } | { kind: 'unavailable' }

const empty: Values = { name: '', email: '', phone: '', location: '', link: '', message: '', consent: false, website: '' }
const MAX_BYTES = 5 * 1024 * 1024
const ACCEPT = ['.pdf', '.doc', '.docx']
const order: FieldName[] = ['name', 'email', 'phone', 'location', 'link', 'cv', 'message', 'consent']

type Props = {
  role: string
  /** Disable the whole form, e.g. for sample listings. */
  disabled?: boolean
}

/**
 * Job application form. With VITE_CAREERS_ENDPOINT it submits multipart form data
 * (including the CV file). With only VITE_CAREERS_EMAIL it opens the applicant's
 * email app. Otherwise it states plainly that applications cannot be delivered yet.
 */
export function ApplicationForm({ role, disabled }: Props) {
  const uid = useId()
  const fid = (f: FieldName) => `${uid}-${f}`
  const statusRef = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState<Values>(empty)
  const [cv, setCv] = useState<File | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const endpoint = site.careers.endpoint
  const fallbackEmail = site.careers.email ?? site.contact.email
  const cvRequired = Boolean(endpoint || dbConfigured)

  function validate(v: Values, file: File | null): Errors {
    const e: Errors = {}
    if (v.name.trim().length < 2) e.name = 'Please enter your name.'
    if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.'
    if (v.phone && !/^[+\d][\d\s()-]{6,}$/.test(v.phone.trim())) e.phone = 'Please enter a valid phone number.'
    if (v.link && !/^https?:\/\/\S+\.\S+/.test(v.link.trim())) e.link = 'Please enter a full URL starting with https://'
    if (cvRequired && !file) e.cv = 'Please attach your CV.'
    if (file && !ACCEPT.some((ext) => file.name.toLowerCase().endsWith(ext))) e.cv = 'Please upload a PDF, DOC or DOCX file.'
    else if (file && file.size > MAX_BYTES) e.cv = 'Your CV must be smaller than 5 MB.'
    if (v.message.trim().length < 30) e.message = 'Please write a short note — at least 30 characters.'
    if (!v.consent) e.consent = 'Please confirm so we can process your application.'
    return e
  }

  const update = (field: keyof Values) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    const next = { ...values, [field]: value }
    setValues(next)
    if (field !== 'website' && errors[field as FieldName]) setErrors((er) => ({ ...er, [field]: validate(next, cv)[field as FieldName] }))
  }

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setCv(file)
    setErrors((er) => ({ ...er, cv: validate(values, file).cv }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (disabled || status.kind === 'submitting') return
    const found = validate(values, cv)
    setErrors(found)
    const first = order.find((f) => found[f])
    if (first) {
      document.getElementById(fid(first))?.focus()
      return
    }
    if (values.website) return

    const focusStatus = () => requestAnimationFrame(() => statusRef.current?.focus())

    if (dbConfigured) {
      setStatus({ kind: 'submitting' })
      const res = await saveApplication(
        {
          role,
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim() || null,
          location: values.location.trim() || null,
          link: values.link.trim() || null,
          message: values.message.trim(),
        },
        cv,
      )
      if (res.ok) {
        setStatus({ kind: 'success' })
        setValues(empty)
        setCv(null)
      } else setStatus({ kind: 'error' })
      focusStatus()
      return
    }

    if (endpoint) {
      setStatus({ kind: 'submitting' })
      const data = new FormData()
      data.append('role', role)
      data.append('name', values.name.trim())
      data.append('email', values.email.trim())
      if (values.phone) data.append('phone', values.phone.trim())
      if (values.location) data.append('location', values.location.trim())
      if (values.link) data.append('link', values.link.trim())
      data.append('message', values.message.trim())
      if (cv) data.append('cv', cv, cv.name)
      data.append('source', 'zinfity-website')
      const res = await postFormData(endpoint, data)
      if (res.ok) {
        setStatus({ kind: 'success' })
        setValues(empty)
        setCv(null)
      } else setStatus({ kind: 'error' })
      focusStatus()
      return
    }

    if (fallbackEmail) {
      openMailto(fallbackEmail, `Application — ${role}`, [
        `Role: ${role}`,
        `Name: ${values.name.trim()}`,
        `Email: ${values.email.trim()}`,
        ...(values.phone ? [`Phone: ${values.phone.trim()}`] : []),
        ...(values.location ? [`Location: ${values.location.trim()}`] : []),
        ...(values.link ? [`Portfolio / LinkedIn: ${values.link.trim()}`] : []),
        '',
        values.message.trim(),
        '',
        '(Please attach your CV to this email.)',
      ])
      setStatus({ kind: 'handoff' })
      focusStatus()
      return
    }

    setStatus({ kind: 'unavailable' })
    focusStatus()
  }

  const props = (f: Exclude<FieldName, 'cv' | 'consent'>) => ({
    id: fid(f),
    name: f,
    value: values[f],
    onChange: update(f),
    disabled,
    'aria-invalid': errors[f] ? true : undefined,
    'aria-describedby': errors[f] ? `${fid(f)}-error` : undefined,
  })

  if (status.kind === 'success') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-2xl border border-line bg-surface p-8 outline-none">
        <CheckCircle2 size={24} className="text-success" aria-hidden="true" />
        <h3 className="mt-5 text-2xl font-medium tracking-[-0.02em]">Thank you — your application has been sent.</h3>
        <p className="mt-3 text-muted">We’ll review it and contact you by email.</p>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-label={`Application for ${role}`} className="relative">
      <fieldset disabled={disabled} className="grid gap-x-8 gap-y-5 disabled:opacity-60 sm:grid-cols-2">
        <legend className="sr-only">Your details</legend>
        <Field id={fid('name')} label="Full name" error={errors.name}>
          <input {...props('name')} type="text" autoComplete="name" className="field-input" />
        </Field>
        <Field id={fid('email')} label="Email" error={errors.email}>
          <input {...props('email')} type="email" autoComplete="email" inputMode="email" className="field-input" />
        </Field>
        <Field id={fid('phone')} label="Phone" optional error={errors.phone}>
          <input {...props('phone')} type="tel" autoComplete="tel" inputMode="tel" className="field-input" />
        </Field>
        <Field id={fid('location')} label="Current location" optional error={errors.location}>
          <input {...props('location')} type="text" autoComplete="address-level2" className="field-input" />
        </Field>
        <Field id={fid('link')} label="Portfolio or LinkedIn" optional error={errors.link} className="sm:col-span-2">
          <input {...props('link')} type="url" inputMode="url" placeholder="https://" className="field-input" />
        </Field>
        <Field
          id={fid('cv')}
          label="CV"
          optional={!cvRequired}
          error={errors.cv}
          hint={cvRequired ? 'PDF, DOC or DOCX, up to 5 MB.' : 'PDF, DOC or DOCX, up to 5 MB. If your email app opens, please attach your CV there.'}
          className="sm:col-span-2"
        >
          <input
            id={fid('cv')}
            name="cv"
            type="file"
            accept={ACCEPT.join(',')}
            onChange={onFile}
            disabled={disabled}
            aria-invalid={errors.cv ? true : undefined}
            aria-describedby={errors.cv ? `${fid('cv')}-error` : `${fid('cv')}-hint`}
            className="field-input"
          />
        </Field>
        <Field id={fid('message')} label="Why this role?" error={errors.message} className="sm:col-span-2">
          <textarea {...props('message')} rows={5} maxLength={3000} className="field-input" placeholder="A few lines about you and what you would bring." />
        </Field>
        <div className="sm:col-span-2" data-form-row>
          <label htmlFor={fid('consent')} className="flex cursor-pointer items-start gap-3 text-[0.92rem] text-fg">
            <input
              id={fid('consent')}
              type="checkbox"
              checked={values.consent}
              onChange={update('consent')}
              disabled={disabled}
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? `${fid('consent')}-error` : undefined}
              className="mt-1 h-4 w-4 shrink-0 accent-[#8c5e34]"
            />
            I agree that Zinfity Technologies may use these details to assess my application.
          </label>
          <p id={`${fid('consent')}-error`} className={`mt-2 text-[0.82rem] text-danger ${errors.consent ? '' : 'hidden'}`}>
            {errors.consent}
          </p>
        </div>
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${uid}-website`}>Website</label>
          <input id={`${uid}-website`} tabIndex={-1} autoComplete="off" value={values.website} onChange={update('website')} />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={disabled || status.kind === 'submitting'} icon={status.kind !== 'submitting'}>
            {status.kind === 'submitting' ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending…
              </span>
            ) : (
              'Submit application'
            )}
          </Button>
        </div>
      </fieldset>
      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="mt-6 outline-none">
        {status.kind === 'error' && (
          <FormNotice tone="error">Your application couldn’t be sent. Please try again — your details are still in the form.</FormNotice>
        )}
        {status.kind === 'unavailable' && (
          <FormNotice tone="error">
            Online applications aren’t connected yet, so this application has not been sent. Your details are still in the form.
          </FormNotice>
        )}
        {status.kind === 'handoff' && (
          <FormNotice tone="info">
            Your email app should now open with your application filled in. Please attach your CV and press send to deliver it.
          </FormNotice>
        )}
      </div>
    </form>
  )
}

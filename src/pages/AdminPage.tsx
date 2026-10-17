import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Briefcase, Download, Inbox, Loader2, LogOut, Mail, Phone, RefreshCw, Search, Trash2 } from 'lucide-react'
import { Seo } from '@/components/Seo'
import { pageMeta } from '@/content/seo'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import {
  cvLink,
  dbConfigured,
  getSession,
  list,
  remove,
  setStatus,
  signIn,
  signOut,
  type Application,
  type Enquiry,
  type SubmissionStatus,
  type Table,
} from '@/lib/supabase'

const statuses: SubmissionStatus[] = ['new', 'contacted', 'closed']
const statusStyle: Record<SubmissionStatus, string> = {
  new: 'bg-accent/20 text-accent-ink',
  contacted: 'bg-[#e3ecf5] text-[#2c4a6b]',
  closed: 'bg-[#e6efe6] text-[#2f5a35]',
}
const fmt = (iso: string) => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

/* ---------------- Sign in ---------------- */
function SignIn({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(email.trim(), password)
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-sm rounded-3xl border border-line bg-surface p-8 shadow-[0_40px_80px_-50px_rgb(23_23_23/0.4)]">
      <h1 className="text-2xl font-medium tracking-[-0.02em]">Admin sign in</h1>
      <p className="mt-2 text-[0.92rem] text-muted">Enquiries and job applications from the website.</p>
      <label className="mt-8 block">
        <span className="eyebrow text-subtle">Email</span>
        <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-line-strong bg-canvas px-3 outline-none focus:border-accent-ink" />
      </label>
      <label className="mt-5 block">
        <span className="eyebrow text-subtle">Password</span>
        <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-line-strong bg-canvas px-3 outline-none focus:border-accent-ink" />
      </label>
      {error && (
        <p role="alert" className="mt-4 text-[0.88rem] text-danger">
          {error}
        </p>
      )}
      <Button type="submit" className="mt-7 w-full justify-center" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}

/* ---------------- Dashboard ---------------- */
function StatusSelect({ value, onChange }: { value: SubmissionStatus; onChange: (s: SubmissionStatus) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SubmissionStatus)}
      aria-label="Status"
      className={`rounded-full border-0 px-3 py-1 text-[0.78rem] font-medium capitalize outline-none ${statusStyle[value]}`}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[8rem_1fr]">
      <dt className="eyebrow pt-0.5 text-subtle">{label}</dt>
      <dd className="break-words">{children}</dd>
    </div>
  )
}

function Dashboard({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const [tab, setTab] = useState<Table>('enquiries')
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<'all' | SubmissionStatus>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [e, a] = await Promise.all([list<Enquiry>('enquiries'), list<Application>('applications')])
      setEnquiries(e)
      setApplications(a)
    } catch (err) {
      if (err instanceof Error && err.message === 'signed-out') onSignOut()
      else setError('Could not load submissions. Check the Supabase set-up and try again.')
    } finally {
      setLoading(false)
    }
  }, [onSignOut])

  useEffect(() => {
    load()
  }, [load])

  const rows = (tab === 'enquiries' ? enquiries : applications) as (Enquiry | Application)[]
  const shown = useMemo(() => {
    const term = q.trim().toLowerCase()
    return rows.filter((r) => (filter === 'all' || r.status === filter) && (!term || JSON.stringify(r).toLowerCase().includes(term)))
  }, [rows, q, filter])

  const update = async (id: string, status: SubmissionStatus) => {
    const patch = <T extends { id: string; status: SubmissionStatus }>(list: T[]) => list.map((r) => (r.id === id ? { ...r, status } : r))
    if (tab === 'enquiries') setEnquiries(patch)
    else setApplications(patch)
    try {
      await setStatus(tab, id, status)
    } catch {
      setError('Could not update the status. Refresh and try again.')
    }
  }

  const del = async (id: string) => {
    if (!window.confirm('Delete this submission permanently?')) return
    try {
      await remove(tab, id)
      if (tab === 'enquiries') setEnquiries((l) => l.filter((r) => r.id !== id))
      else setApplications((l) => l.filter((r) => r.id !== id))
    } catch {
      setError('Could not delete. Refresh and try again.')
    }
  }

  const openCv = async (path: string) => {
    try {
      window.open(await cvLink(path), '_blank', 'noopener')
    } catch {
      setError('Could not open the CV.')
    }
  }

  const counts = {
    enquiries: enquiries.filter((r) => r.status === 'new').length,
    applications: applications.filter((r) => r.status === 'new').length,
  }

  return (
    <div className="container-x pb-24 pt-[calc(var(--header-h)+2rem)]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-accent-ink">Admin</p>
          <h1 className="mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-medium tracking-[-0.035em]">Website submissions</h1>
          <p className="mt-1 text-[0.9rem] text-muted">Signed in as {email}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[0.88rem] hover:border-fg">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} aria-hidden="true" /> Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              signOut()
              onSignOut()
            }}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[0.88rem] hover:border-fg"
          >
            <LogOut size={14} aria-hidden="true" /> Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Submission type" className="mt-8 flex gap-2">
        {(
          [
            ['enquiries', 'Contact enquiries', Inbox, enquiries.length, counts.enquiries],
            ['applications', 'Job applications', Briefcase, applications.length, counts.applications],
          ] as const
        ).map(([id, label, Icon, total, fresh]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => {
              setTab(id)
              setOpenId(null)
            }}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-left transition-colors ${tab === id ? 'border-fg bg-fg text-canvas' : 'border-line-strong hover:border-fg'}`}
          >
            <Icon size={16} aria-hidden="true" />
            <span className="font-medium">{label}</span>
            <span className={`rounded-full px-2 text-[0.75rem] ${tab === id ? 'bg-canvas/20' : 'bg-canvas-alt'}`}>{total}</span>
            {fresh > 0 && <span className="rounded-full bg-accent px-2 text-[0.72rem] font-medium text-[#171717]">{fresh} new</span>}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="relative">
          <span className="sr-only">Search</span>
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, message…" className="h-10 w-72 max-w-full rounded-full border border-line-strong bg-surface pl-9 pr-4 text-[0.9rem] outline-none focus:border-accent-ink" />
        </label>
        <div role="group" aria-label="Filter by status" className="flex gap-1.5">
          {(['all', ...statuses] as const).map((s) => (
            <button key={s} type="button" aria-pressed={filter === s} onClick={() => setFilter(s)} className={`rounded-full border px-3 py-1.5 text-[0.82rem] capitalize ${filter === s ? 'border-fg bg-fg text-canvas' : 'border-line-strong'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-danger/40 bg-danger/[0.06] p-4 text-[0.9rem]">
          {error}
        </p>
      )}

      {/* List */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-surface">
        {loading ? (
          <p className="flex items-center gap-2 p-8 text-muted">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Loading…
          </p>
        ) : shown.length === 0 ? (
          <p className="p-10 text-center text-muted">{rows.length ? 'Nothing matches these filters.' : 'No submissions yet.'}</p>
        ) : (
          <ul className="divide-y divide-line">
            {shown.map((r) => {
              const open = openId === r.id
              const subtitle = 'service' in r ? r.service : r.role
              return (
                <li key={r.id}>
                  <div className="flex flex-wrap items-center gap-4 px-5 py-4">
                    <button type="button" aria-expanded={open} onClick={() => setOpenId(open ? null : r.id)} className="min-w-0 flex-1 text-left">
                      <span className="flex flex-wrap items-baseline gap-x-3">
                        <span className="font-medium">{r.name}</span>
                        <span className="text-[0.85rem] text-muted">{r.email}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-[0.85rem] text-subtle">
                        {subtitle} · {fmt(r.created_at)}
                      </span>
                    </button>
                    <StatusSelect value={r.status} onChange={(s) => update(r.id, s)} />
                  </div>
                  {open && (
                    <div className="border-t border-line bg-canvas-alt/50 px-5 py-6">
                      <dl className="space-y-3 text-[0.92rem]">
                        {'service' in r ? (
                          <>
                            <Row label="Company">{r.company || '—'}</Row>
                            <Row label="Service">{r.service}</Row>
                            <Row label="Budget">{r.budget}</Row>
                            {r.context && <Row label="Context">{r.context}</Row>}
                          </>
                        ) : (
                          <>
                            <Row label="Role">{r.role}</Row>
                            <Row label="Phone">{r.phone || '—'}</Row>
                            <Row label="Location">{r.location || '—'}</Row>
                            <Row label="Portfolio">
                              {r.link ? (
                                <a href={r.link} target="_blank" rel="noopener noreferrer" className="link-draw text-accent-ink">
                                  {r.link}
                                </a>
                              ) : (
                                '—'
                              )}
                            </Row>
                          </>
                        )}
                        <Row label="Message">
                          <span className="whitespace-pre-wrap">{r.message}</span>
                        </Row>
                      </dl>
                      <div className="mt-6 flex flex-wrap gap-2">
                        <a href={`mailto:${r.email}`} className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-[0.85rem] text-canvas">
                          <Mail size={14} aria-hidden="true" /> Reply by email
                        </a>
                        {'phone' in r && r.phone && (
                          <a href={`tel:${r.phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[0.85rem]">
                            <Phone size={14} aria-hidden="true" /> Call
                          </a>
                        )}
                        {'cv_path' in r && r.cv_path && (
                          <button type="button" onClick={() => openCv(r.cv_path!)} className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[0.85rem]">
                            <Download size={14} aria-hidden="true" /> Open CV
                          </button>
                        )}
                        <button type="button" onClick={() => del(r.id)} className="ml-auto inline-flex items-center gap-2 rounded-full border border-danger/40 px-4 py-2 text-[0.85rem] text-danger">
                          <Trash2 size={14} aria-hidden="true" /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

/** /admin — private page (not linked or indexed) for reading website submissions. */
export default function AdminPage() {
  const [state, setState] = useState<'checking' | 'out' | { email: string }>('checking')

  const check = useCallback(async () => {
    const s = await getSession()
    setState(s ? { email: s.email } : 'out')
  }, [])
  useEffect(() => {
    if (dbConfigured) check()
  }, [check])

  return (
    <>
      <Seo {...pageMeta.admin} />
      {!dbConfigured ? (
        <div className="container-x grid min-h-[70vh] place-items-center pt-[var(--header-h)]">
          <div className="max-w-md text-center">
            <Logo variant="mark" alt="" className="mx-auto h-auto w-14" />
            <h1 className="mt-6 text-2xl font-medium">Admin isn’t connected yet</h1>
            <p className="mt-3 text-muted">Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then rebuild. See docs/admin-setup.md.</p>
          </div>
        </div>
      ) : state === 'checking' ? (
        <div className="grid min-h-[70vh] place-items-center">
          <Loader2 className="animate-spin text-muted" aria-label="Loading" />
        </div>
      ) : state === 'out' ? (
        <div className="container-x grid min-h-[80vh] place-items-center pt-[var(--header-h)]">
          <SignIn onDone={check} />
        </div>
      ) : (
        <Dashboard email={state.email} onSignOut={() => setState('out')} />
      )}
    </>
  )
}

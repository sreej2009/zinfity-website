/**
 * Minimal Supabase client using its REST APIs directly (no SDK, keeps the site light).
 *
 * - Website visitors use the public "anon" key, which Row Level Security limits to
 *   INSERTING enquiries/applications and uploading CVs. They can never read data.
 * - The admin signs in with email + password; their session token is what allows
 *   reading and updating submissions. See docs/admin-setup.md.
 */
import type { DeliveryResult } from './delivery'

const env = import.meta.env
const URL_ = (env.VITE_SUPABASE_URL as string | undefined)?.trim().replace(/\/$/, '')
const ANON = (env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim()

export const dbConfigured = Boolean(URL_ && ANON)

// New-style publishable keys (sb_publishable_…) are not JWTs: send them only as `apikey`.
// Legacy anon keys (eyJ…) are also sent as the bearer token.
const base = (token?: string): Record<string, string> =>
  token ? { apikey: ANON!, Authorization: `Bearer ${token}` } : ANON!.startsWith('sb_') ? { apikey: ANON! } : { apikey: ANON!, Authorization: `Bearer ${ANON}` }

export type Enquiry = {
  id: string
  created_at: string
  name: string
  email: string
  company: string | null
  service: string
  budget: string
  message: string
  context: string | null
  status: SubmissionStatus
}
export type Application = {
  id: string
  created_at: string
  role: string
  name: string
  email: string
  phone: string | null
  location: string | null
  link: string | null
  message: string
  cv_path: string | null
  status: SubmissionStatus
}
export type SubmissionStatus = 'new' | 'contacted' | 'closed'
export type Table = 'enquiries' | 'applications'

/* ---------------- Public: save a submission ---------------- */

async function insert(table: Table, row: Record<string, unknown>): Promise<DeliveryResult> {
  try {
    const res = await fetch(`${URL_}/rest/v1/${table}`, {
      method: 'POST',
      headers: { ...base(), 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(row),
    })
    return res.ok ? { ok: true } : { ok: false, reason: 'rejected', status: res.status }
  } catch {
    return { ok: false, reason: 'network' }
  }
}

export const saveEnquiry = (row: Omit<Enquiry, 'id' | 'created_at' | 'status'>) => insert('enquiries', row)

export async function saveApplication(row: Omit<Application, 'id' | 'created_at' | 'status' | 'cv_path'>, cv: File | null): Promise<DeliveryResult> {
  let cv_path: string | null = null
  if (cv) {
    const safe = cv.name.replace(/[^\w.-]+/g, '_').slice(-80)
    cv_path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safe}`
    try {
      const res = await fetch(`${URL_}/storage/v1/object/cvs/${cv_path}`, {
        method: 'POST',
        headers: { ...base(), 'Content-Type': cv.type || 'application/octet-stream', 'x-upsert': 'false' },
        body: cv,
      })
      if (!res.ok) return { ok: false, reason: 'rejected', status: res.status }
    } catch {
      return { ok: false, reason: 'network' }
    }
  }
  return insert('applications', { ...row, cv_path })
}

/* ---------------- Admin: session ---------------- */

const KEY = 'zinfity-admin-session'
type Session = { access_token: string; refresh_token: string; expires_at: number; email: string }

function read(): Session | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}
function write(s: Session | null) {
  try {
    if (s) sessionStorage.setItem(KEY, JSON.stringify(s))
    else sessionStorage.removeItem(KEY)
  } catch {
    /* storage unavailable: session lives only in memory for this page */
  }
}

async function tokenRequest(grant: 'password' | 'refresh_token', body: Record<string, string>): Promise<Session> {
  const res = await fetch(`${URL_}/auth/v1/token?grant_type=${grant}`, {
    method: 'POST',
    headers: { apikey: ANON!, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Sign-in failed.')
  return { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: Date.now() + data.expires_in * 1000, email: data.user?.email ?? '' }
}

export async function signIn(email: string, password: string) {
  const s = await tokenRequest('password', { email, password })
  write(s)
  return s
}

export function signOut() {
  write(null)
}

/** Current session, refreshed if it is about to expire. Null when signed out. */
export async function getSession(): Promise<Session | null> {
  const s = read()
  if (!s) return null
  if (s.expires_at - Date.now() > 60_000) return s
  try {
    const next = await tokenRequest('refresh_token', { refresh_token: s.refresh_token })
    write(next)
    return next
  } catch {
    write(null)
    return null
  }
}

/* ---------------- Admin: data ---------------- */

async function authed(path: string, init: RequestInit = {}) {
  const s = await getSession()
  if (!s) throw new Error('signed-out')
  const res = await fetch(`${URL_}${path}`, { ...init, headers: { ...base(s.access_token), 'Content-Type': 'application/json', ...(init.headers ?? {}) } })
  if (res.status === 401) {
    write(null)
    throw new Error('signed-out')
  }
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return res
}

export async function list<T>(table: Table): Promise<T[]> {
  const res = await authed(`/rest/v1/${table}?select=*&order=created_at.desc`)
  return res.json()
}

export async function setStatus(table: Table, id: string, status: SubmissionStatus) {
  await authed(`/rest/v1/${table}?id=eq.${id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status }) })
}

export async function remove(table: Table, id: string) {
  await authed(`/rest/v1/${table}?id=eq.${id}`, { method: 'DELETE' })
}

/** A short-lived download link for a stored CV. */
export async function cvLink(path: string): Promise<string> {
  const res = await authed(`/storage/v1/object/sign/cvs/${path}`, { method: 'POST', body: JSON.stringify({ expiresIn: 300 }) })
  const data = await res.json()
  return `${URL_}/storage/v1${data.signedURL}`
}

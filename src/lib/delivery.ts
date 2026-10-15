/**
 * Form delivery helpers. A submission is only reported as delivered when the
 * configured endpoint returns a 2xx response — never optimistically.
 */
export type DeliveryResult = { ok: true } | { ok: false; reason: 'network' | 'rejected'; status?: number }

export async function postJson(endpoint: string, payload: unknown): Promise<DeliveryResult> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.ok ? { ok: true } : { ok: false, reason: 'rejected', status: res.status }
  } catch {
    return { ok: false, reason: 'network' }
  }
}

export async function postFormData(endpoint: string, data: FormData): Promise<DeliveryResult> {
  try {
    const res = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: data })
    return res.ok ? { ok: true } : { ok: false, reason: 'rejected', status: res.status }
  } catch {
    return { ok: false, reason: 'network' }
  }
}

/** Opens the visitor's email app. Delivery is NOT confirmed — the visitor must press send. */
export function openMailto(to: string, subject: string, lines: string[]) {
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

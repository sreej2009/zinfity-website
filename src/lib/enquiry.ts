/**
 * Contextual enquiry links. Any CTA can send visitors to /contact with the
 * service (and optionally a project) pre-selected in the form.
 */
export function contactHref(opts: { service?: string; project?: string; engagement?: string } = {}) {
  const params = new URLSearchParams()
  if (opts.service) params.set('service', opts.service)
  if (opts.project) params.set('project', opts.project)
  if (opts.engagement) params.set('engagement', opts.engagement)
  const q = params.toString()
  return q ? `/contact?${q}#enquiry` : '/contact#enquiry'
}

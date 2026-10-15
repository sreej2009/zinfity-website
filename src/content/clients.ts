/**
 * Clients shown on the home page ("Our clients").
 *
 * ONLY add genuine, verified clients who have agreed to be listed.
 * Do not add concept-study projects, technology vendors or product brands.
 *
 * The section stays hidden while this list is empty.
 *
 * To add a client:
 *   1. Put the client's official logo in /public/clients/ (SVG preferred, or a
 *      transparent PNG/WebP at least 400px wide). Do not alter the logo.
 *   2. Add an entry below, e.g.
 *      { name: 'Client Name', logo: '/clients/client-name.svg', url: 'https://client.example' }
 */
import { withBase } from '@/lib/base'

export type Client = {
  name: string
  logo: string
  /** Optional link to the client's website. */
  url?: string
}

// TEMPORARY PLACEHOLDERS — replace with real client logos before launch.
// (Delete these six lines and the files /public/clients/placeholder-*.svg.)
export const clients: Client[] = [
  { name: 'Placeholder client logo 1', logo: withBase('/clients/placeholder-1.svg') },
  { name: 'Placeholder client logo 2', logo: withBase('/clients/placeholder-2.svg') },
  { name: 'Placeholder client logo 3', logo: withBase('/clients/placeholder-3.svg') },
  { name: 'Placeholder client logo 4', logo: withBase('/clients/placeholder-4.svg') },
  { name: 'Placeholder client logo 5', logo: withBase('/clients/placeholder-5.svg') },
  { name: 'Placeholder client logo 6', logo: withBase('/clients/placeholder-6.svg') },
]

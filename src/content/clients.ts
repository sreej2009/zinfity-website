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
  /** Square / stacked logos are shown taller so they read at the same visual weight. */
  square?: boolean
}

export const clients: Client[] = [
  { name: 'Hitswork', logo: withBase('/clients/hitswork.webp') },
  { name: 'Sticko', logo: withBase('/clients/sticko.webp'), square: true },
  { name: 'Brandotics', logo: withBase('/clients/brandotics.webp') },
]

import { withBase } from '@/lib/base'

/**
 * Site-wide configuration.
 *
 * Contact details and social profiles are read from environment variables
 * (see .env.example). Anything left empty is simply not rendered, so the
 * site never shows unverified details.
 */
const env = import.meta.env

const clean = (v?: string) => (v && v.trim() ? v.trim() : undefined)

export const site = {
  name: 'Zinfity Technologies',
  shortName: 'Zinfity',
  tagline: 'Technology That Works Together.',
  url: clean(env.VITE_SITE_URL),

  contact: {
    endpoint: clean(env.VITE_CONTACT_ENDPOINT),
    email: clean(env.VITE_CONTACT_EMAIL),
    phone: clean(env.VITE_CONTACT_PHONE),
    location: clean(env.VITE_CONTACT_LOCATION),
  },

  careers: {
    endpoint: clean(env.VITE_CAREERS_ENDPOINT),
    email: clean(env.VITE_CAREERS_EMAIL),
  },

  socials: [
    { label: 'LinkedIn', href: clean(env.VITE_SOCIAL_LINKEDIN) },
    { label: 'Instagram', href: clean(env.VITE_SOCIAL_INSTAGRAM) },
    { label: 'X', href: clean(env.VITE_SOCIAL_X) },
    { label: 'GitHub', href: clean(env.VITE_SOCIAL_GITHUB) },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href)),
} as const

export const brandAssets = {
  logoOnDark: withBase('/brand/logo-on-dark'),
  logoOnLight: withBase('/brand/logo-on-light'),
  lockupOnDark: withBase('/brand/lockup-on-dark'),
  lockupOnLight: withBase('/brand/lockup-on-light'),
  mark: withBase('/brand/z-mark'),
} as const

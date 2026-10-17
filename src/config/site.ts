import { withBase } from '@/lib/base'
import { brand } from '@/content/seo'

/**
 * Site-wide configuration.
 *
 * Contact details and social profiles default to Zinfity's confirmed details
 * and can be overridden with environment variables (see .env.example).
 * Social profiles without a value are simply not rendered.
 */
const env = import.meta.env

const clean = (v?: string) => (v && v.trim() ? v.trim() : undefined)

export const site = {
  name: brand.name,
  shortName: 'Zinfity',
  tagline: brand.tagline,
  url: clean(env.VITE_SITE_URL),

  contact: {
    endpoint: clean(env.VITE_CONTACT_ENDPOINT),
    email: clean(env.VITE_CONTACT_EMAIL) ?? 'infozinfity@gmail.com',
    phone: clean(env.VITE_CONTACT_PHONE) ?? '+91 63824 24956',
    location: clean(env.VITE_CONTACT_LOCATION) ?? '7th Cross, Periyar Nagar, Nehru Nagar, Kalapatti Road, Sitra, Coimbatore – 641014',
    /** WhatsApp number in international format, digits only. */
    whatsapp: clean(env.VITE_CONTACT_WHATSAPP) ?? '916382424956',
  },

  careers: {
    endpoint: clean(env.VITE_CAREERS_ENDPOINT),
    email: clean(env.VITE_CAREERS_EMAIL),
  },

  socials: [
    { label: 'LinkedIn', href: clean(env.VITE_SOCIAL_LINKEDIN) },
    { label: 'Instagram', href: clean(env.VITE_SOCIAL_INSTAGRAM) ?? 'https://www.instagram.com/zinfity.tech/' },
    { label: 'Facebook', href: clean(env.VITE_SOCIAL_FACEBOOK) ?? 'https://www.facebook.com/share/1JJczg7yZv/' },
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

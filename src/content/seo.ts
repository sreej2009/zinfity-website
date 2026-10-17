/**
 * Titles and descriptions for every route. Pure data (no React, no import.meta.env),
 * shared by the pages (<Seo>) and the build step that writes each route's HTML file,
 * so what crawlers and link previews read before JavaScript matches the rendered app.
 */
import { services } from './services'
import { serviceDetails } from './service-details'
import type { Project } from './work'
import type { Job } from './careers'

export const brand = { name: 'Zinfity Technologies', tagline: 'Technology That Works Together.' }

/** Root-relative share image (1200×630) in /public. */
export const defaultShareImage = '/og-image.jpg'

export type PageMeta = {
  title: string
  description: string
  noindex?: boolean
  type?: 'website' | 'article'
  /** Absolute or root-relative image path. */
  image?: string
  publishedTime?: string
}

export const pageMeta = {
  home: {
    title: brand.name,
    description:
      'Zinfity Technologies designs and builds digital experiences, intelligent software and connected systems that help businesses move from ideas to impact.',
  },
  services: {
    title: 'Services',
    description:
      'Websites, mobile apps, custom software, ERP & CRM, digital marketing, UI/UX design, e-commerce, AI automation and Microsoft solutions — the Zinfity service directory.',
  },
  solutions: {
    title: 'Solutions',
    description:
      'How interfaces, applications, integrations, data and business operations connect — and the solution architectures Zinfity designs across them.',
  },
  about: {
    title: 'About',
    description: 'Zinfity Technologies is a design and engineering company. How we think, the principles we hold, and how we deliver projects.',
  },
  blog: {
    title: 'Blog',
    description: 'The Zinfity Journal: practical notes on websites, mobile apps, custom software, ERP & CRM, automation and digital transformation.',
  },
  careers: { title: 'Careers', description: 'Careers at Zinfity Technologies — how we work, open positions and how to apply.' },
  contact: {
    title: 'Contact',
    description: 'Start a project with Zinfity Technologies. Tell us about your website, app, software, ERP/CRM, marketing or automation needs.',
  },
  admin: { title: 'Admin', description: 'Private admin area.', noindex: true },
  notFound: { title: 'Page not found', description: 'The page you were looking for could not be found.', noindex: true },
} satisfies Record<string, PageMeta>

/** "About" → "About — Zinfity Technologies"; the home page uses the tagline instead. */
export const fullTitle = (title: string) =>
  title === brand.name ? `${brand.name} — ${brand.tagline.replace(/\.$/, '')}` : `${title} — ${brand.name}`

const clip = (s: string) => (s.length > 158 ? s.slice(0, 155).replace(/\s+\S*$/, '') + '…' : s)

export function serviceMeta(id: string): PageMeta {
  const s = services.find((x) => x.id === id)!
  return { title: s.title, description: clip(serviceDetails[id].intro) }
}

export const projectMeta = (p: Pick<Project, 'title' | 'description' | 'status'>): PageMeta => ({
  title: `${p.title}${p.status === 'concept' ? ' (concept study)' : ''}`,
  description: p.description,
})

export const jobMeta = (j: Pick<Job, 'title' | 'summary' | 'sample'>): PageMeta => ({
  title: `${j.title}${j.sample ? ' (sample listing)' : ''}`,
  description: j.summary,
  noindex: j.sample,
})

export const postMeta = (p: { title: string; excerpt: string; date: string; status: string }): PageMeta => ({
  title: p.title,
  description: p.excerpt,
  type: 'article',
  publishedTime: p.date || undefined,
  noindex: p.status === 'draft',
})

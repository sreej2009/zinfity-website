/**
 * Service overview data. Pure data (no React imports) so the build-time
 * sitemap generator can read it. Long-form detail lives in service-details.ts.
 */
export type ServiceVisualKey =
  | 'web'
  | 'mobile'
  | 'software'
  | 'erp'
  | 'marketing'
  | 'uiux'
  | 'commerce'
  | 'ai'
  | 'microsoft'

export type Service = {
  id: string
  /** URL segment: /services/<slug> */
  slug: string
  title: string
  short: string
  description: string
  deliverables: string[]
  visual: ServiceVisualKey
}

export const services: Service[] = [
  {
    id: 'web',
    slug: 'web-development',
    title: 'Website Design & Development',
    short: 'Websites',
    description:
      'Fast, considered websites that explain what you do with clarity — designed around your audience, built on a foundation your team can grow.',
    deliverables: ['Corporate sites', 'Landing pages', 'Headless CMS', 'Performance & SEO'],
    visual: 'web',
  },
  {
    id: 'mobile',
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    short: 'Mobile apps',
    description:
      'Native-feeling iOS and Android apps, from first prototype to store release, engineered for reliability on real devices and real networks.',
    deliverables: ['iOS & Android', 'Cross-platform', 'Offline-first', 'Store release'],
    visual: 'mobile',
  },
  {
    id: 'software',
    slug: 'custom-software',
    title: 'Custom Software Development',
    short: 'Custom software',
    description:
      'Purpose-built platforms, portals and internal tools shaped around how your organisation actually works — not the other way round.',
    deliverables: ['Web platforms', 'Internal tools', 'APIs & integrations', 'Cloud architecture'],
    visual: 'software',
  },
  {
    id: 'erp',
    slug: 'erp-crm',
    title: 'ERP & CRM Solutions',
    short: 'ERP & CRM',
    description:
      'Operations, sales and customer data brought into one connected system, so every team works from the same source of truth.',
    deliverables: ['Implementation', 'Customisation', 'Data migration', 'System integration'],
    visual: 'erp',
  },
  {
    id: 'marketing',
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    short: 'Digital marketing',
    description:
      'Search, social and performance campaigns connected to your product and data — so growth is planned, measured and repeatable.',
    deliverables: ['SEO', 'Paid media', 'Content strategy', 'Analytics'],
    visual: 'marketing',
  },
  {
    id: 'uiux',
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    short: 'UI/UX design',
    description:
      'Research-led product design: flows, interfaces and design systems that make complex software feel simple and inevitable.',
    deliverables: ['UX research', 'Product design', 'Prototyping', 'Design systems'],
    visual: 'uiux',
  },
  {
    id: 'commerce',
    slug: 'ecommerce',
    title: 'E-commerce Development',
    short: 'E-commerce',
    description:
      'Storefronts and commerce platforms built for conversion and operations alike — catalogue, checkout, payments, fulfilment and beyond.',
    deliverables: ['Storefronts', 'Headless commerce', 'Payments', 'Marketplace integrations'],
    visual: 'commerce',
  },
  {
    id: 'ai',
    slug: 'ai-automation',
    title: 'AI & Business Automation',
    short: 'AI & automation',
    description:
      'Practical AI and workflow automation that removes repetitive work, connects your tools and puts your data to use where it matters.',
    deliverables: ['Workflow automation', 'AI assistants', 'Document processing', 'Data pipelines'],
    visual: 'ai',
  },
  {
    id: 'microsoft',
    slug: 'microsoft-solutions',
    title: 'Microsoft Solutions',
    short: 'Microsoft',
    description:
      'Dynamics 365, Business Central, the Power Platform and Azure — planned, configured and connected around how your business runs.',
    deliverables: ['Dynamics 365', 'Business Central', 'Power Platform', 'Azure'],
    visual: 'microsoft',
  },
]

export const serviceTitles = services.map((s) => s.title)

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug)
export const serviceById = (id: string) => services.find((s) => s.id === id)
export const servicePath = (s: Pick<Service, 'slug'>) => `/services/${s.slug}`

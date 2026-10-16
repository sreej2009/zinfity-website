/**
 * Selected work.
 *
 * The entries below are CONCEPT STUDIES that show the kind of work Zinfity
 * delivers. They are not client projects, name no clients and make no claims
 * about results. Each has a detail page at /work/<slug>.
 *
 * To publish a real case study:
 *   1. Put images in /public/work/<slug>/ (WebP, ~1600px wide, 16:10 works best).
 *   2. Add or replace an entry with `status: 'case-study'`, `image`, `imageAlt`
 *      and optional `gallery`. When `image` is set it replaces the generated artwork.
 *   3. Only fill `results` with outcomes the client has verified and approved.
 */
export type ProjectArtKey = 'operations' | 'commerce' | 'field' | 'automation'

export type Project = {
  id: string
  slug: string
  title: string
  category: string
  /** Project grouping (kept for content organisation) */
  group: 'Platforms' | 'Commerce' | 'Mobile' | 'Automation'
  description: string
  overview: string
  problem: string
  approach: string[]
  solution: string
  deliverables: string[]
  technologies: string[]
  /** Verified outcomes only. Leave empty for concept studies. */
  results?: string[]
  status: 'concept' | 'case-study'
  art: ProjectArtKey
  image?: string
  imageAlt?: string
  gallery?: { src: string; alt: string }[]
  /** Service pre-selected when someone asks about a similar project. */
  relatedService: string
  /** Service ids shown as related on the detail page. */
  services: string[]
  /** Case-study presentation: which side the sticky canvas sits on, and where
   *  the camera focuses on the artwork for each chapter (x/y in %, zoom). */
  presentation: { side: 'left' | 'right'; focus: [Focus, Focus, Focus, Focus] }
}

export type Focus = { x: number; y: number; zoom: number; caption: string }

export const projects: Project[] = [
  {
    id: 'operations',
    slug: 'unified-operations-platform',
    title: 'Unified Operations Platform',
    category: 'ERP · Manufacturing',
    group: 'Platforms',
    description:
      'A single operational view connecting inventory, production planning and finance — replacing spreadsheets with live, shared data.',
    overview:
      'A concept for a mid-sized manufacturer whose teams plan production, track stock and reconcile costs in separate spreadsheets. The study explores how a connected operations platform could give every team the same current picture.',
    problem:
      'When inventory, production and finance each keep their own records, planning relies on whoever last updated a sheet. Shortages are discovered late, and month-end reconciliation becomes a manual project of its own.',
    approach: [
      'Map the flow of materials and information from purchase order to finished goods.',
      'Identify the few shared records — items, batches, orders — that every team depends on.',
      'Design role-based dashboards that show each team what it needs, from the same data.',
      'Plan a phased rollout that starts with inventory visibility before automating planning.',
    ],
    solution:
      'A web platform with a shared data model for items, stock movements, production batches and costs. Live synchronisation events replace re-keying, while dashboards present trends for each department without exposing the complexity underneath.',
    deliverables: ['Process & data mapping', 'System architecture', 'Dashboard & workflow designs', 'Integration plan', 'Phased roadmap'],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    status: 'concept',
    art: 'operations',
    relatedService: 'ERP & CRM Solutions',
    services: ['erp', 'software', 'uiux'],
    presentation: { side: 'right', focus: [{ x: 50, y: 50, zoom: 1, caption: 'Overview' }, { x: 62, y: 30, zoom: 1.75, caption: 'Shared indicators' }, { x: 60, y: 64, zoom: 1.6, caption: 'Production trend' }, { x: 84, y: 84, zoom: 2.2, caption: 'Live sync events' }] },
  },
  {
    id: 'commerce',
    slug: 'direct-to-consumer-storefront',
    title: 'Direct-to-Consumer Storefront',
    category: 'E-commerce · Retail',
    group: 'Commerce',
    description:
      'An editorial storefront and headless commerce stack designed for fast browsing, a frictionless checkout and simple catalogue operations.',
    overview:
      'A concept for a design-led product brand selling directly to customers. The study combines editorial storytelling with a fast, dependable buying experience and back-office simplicity.',
    problem:
      'Template storefronts often force a choice between brand expression and performance, while catalogue updates and order handling still involve manual steps behind the scenes.',
    approach: [
      'Design product pages around the questions customers ask before buying.',
      'Separate content from commerce so the brand team can tell stories without touching checkout.',
      'Keep checkout short, mobile-first and transparent about costs.',
      'Connect orders to stock and fulfilment so operations stay in sync automatically.',
    ],
    solution:
      'A headless storefront: an editorial front end driven by a content system, connected to a proven commerce engine for catalogue, cart, payments and orders. Product launches can be prepared as content while operations remain automated.',
    deliverables: ['Experience strategy', 'Storefront design system', 'Product & checkout templates', 'Headless architecture', 'Integration plan'],
    technologies: ['Next.js', 'Headless CMS', 'Payments API', 'Edge hosting'],
    status: 'concept',
    art: 'commerce',
    relatedService: 'E-commerce Development',
    services: ['commerce', 'web', 'marketing'],
    presentation: { side: 'left', focus: [{ x: 50, y: 50, zoom: 1, caption: 'Storefront' }, { x: 30, y: 50, zoom: 1.8, caption: 'Product story' }, { x: 74, y: 52, zoom: 1.9, caption: 'Variants & detail' }, { x: 76, y: 86, zoom: 2.3, caption: 'Checkout entry' }] },
  },
  {
    id: 'field',
    slug: 'field-service-mobile-app',
    title: 'Field Service Mobile App',
    category: 'Mobile · Services',
    group: 'Mobile',
    description:
      'An offline-first app for technicians: job scheduling, digital checklists, photo capture and instant sync with the back office.',
    overview:
      'A concept for a service company whose technicians receive jobs by phone and report back on paper. The study explores a mobile tool designed for gloves, sunlight and unreliable coverage.',
    problem:
      'Paper job sheets get lost or arrive days later, photos sit in personal phones, and the office cannot see progress until technicians return.',
    approach: [
      'Observe the technician’s day and design for the moments that matter: arriving, inspecting, completing.',
      'Make every core action work offline, with clear sync status.',
      'Use large touch targets and high-contrast screens for outdoor use.',
      'Give the office live visibility without adding admin work for technicians.',
    ],
    solution:
      'A cross-platform mobile app with a daily job list, guided digital checklists, photo and signature capture, and background synchronisation to a web dashboard used by schedulers.',
    deliverables: ['Field research plan', 'Mobile UX & UI', 'Offline sync architecture', 'Scheduler dashboard concept', 'Release plan'],
    technologies: ['React Native', 'TypeScript', 'REST API', 'Offline sync'],
    status: 'concept',
    art: 'field',
    relatedService: 'Mobile App Development',
    services: ['mobile', 'uiux', 'software'],
    presentation: { side: 'right', focus: [{ x: 50, y: 50, zoom: 1, caption: 'Two key screens' }, { x: 30, y: 32, zoom: 1.9, caption: 'Today’s jobs' }, { x: 65, y: 58, zoom: 1.75, caption: 'Guided checklist' }, { x: 46, y: 88, zoom: 2.4, caption: 'Offline status' }] },
  },
  {
    id: 'automation',
    slug: 'intelligent-request-automation',
    title: 'Intelligent Request Automation',
    category: 'AI · Automation',
    group: 'Automation',
    description:
      'Incoming requests classified, routed and drafted automatically, with people kept in the loop for review and approval.',
    overview:
      'A concept for a service team that receives a steady stream of emails and form submissions. The study explores how AI-assisted triage could speed up responses while keeping people responsible for decisions.',
    problem:
      'Every request is read, categorised and forwarded by hand. Response times depend on who is available, and similar questions are answered from scratch again and again.',
    approach: [
      'Analyse request types and decide which can be safely automated.',
      'Classify and route requests automatically, with confidence thresholds.',
      'Prepare draft replies from approved knowledge, always reviewed by a person.',
      'Log every automated step so the process is transparent and auditable.',
    ],
    solution:
      'An automation workflow connected to the team’s inbox and ticketing tool. Requests are classified, enriched and routed; draft responses are generated from an approved knowledge base and wait for human approval before sending.',
    deliverables: ['Process analysis', 'Automation design', 'Human-review workflow', 'Integration architecture', 'Governance guidelines'],
    technologies: ['Python', 'LLM APIs', 'Workflow engine', 'Integrations'],
    status: 'concept',
    art: 'automation',
    relatedService: 'AI & Business Automation',
    services: ['ai', 'software', 'erp'],
    presentation: { side: 'left', focus: [{ x: 50, y: 50, zoom: 1, caption: 'The flow' }, { x: 16, y: 42, zoom: 2.1, caption: 'Incoming requests' }, { x: 50, y: 50, zoom: 2.3, caption: 'Classification' }, { x: 84, y: 50, zoom: 2, caption: 'Routes & review' }] },
  },
]

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug)
export const projectById = (id: string) => projects.find((p) => p.id === id)
export const projectPath = (p: Pick<Project, 'slug'>) => `/work/${p.slug}`

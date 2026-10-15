export type Solution = {
  id: string
  title: string
  description: string
  connects: string[]
  /** Typical situations where this solution applies. */
  appliesTo: string[]
  /** Related service ids. */
  services: string[]
  /** Nodes this solution passes through on the architecture map, top to bottom. */
  path: string[]
}

export type Layer = { id: string; name: string; note: string; role: string; nodes: string[]; services: string[] }

/** The architecture map on /solutions: how a business system is layered. */
export const layers: Layer[] = [
  {
    id: 'interfaces',
    name: 'Interfaces',
    note: 'Where people meet the system',
    role: 'Websites, apps, portals and dashboards — designed for each audience, sharing one design system.',
    nodes: ['Website', 'Mobile app', 'Customer portal', 'Team dashboard'],
    services: ['web', 'mobile', 'uiux'],
  },
  {
    id: 'applications',
    name: 'Applications',
    note: 'Business logic and rules',
    role: 'The platforms that hold your rules: custom products, ERP/CRM and commerce engines.',
    nodes: ['Product platform', 'ERP & CRM', 'Commerce engine'],
    services: ['software', 'erp', 'commerce'],
  },
  {
    id: 'integration',
    name: 'Integration & automation',
    note: 'How information moves',
    role: 'APIs, workflows and AI services that move information between systems without re-typing.',
    nodes: ['APIs', 'Workflows', 'AI services'],
    services: ['software', 'ai'],
  },
  {
    id: 'data',
    name: 'Data',
    note: 'What the business knows',
    role: 'Operational records, documents and analytics — kept consistent so reports can be trusted.',
    nodes: ['Operational data', 'Documents', 'Analytics'],
    services: ['erp', 'marketing'],
  },
  {
    id: 'operations',
    name: 'Business operations',
    note: 'The work itself',
    role: 'Sales, fulfilment, finance and support — the outcomes every other layer exists to serve.',
    nodes: ['Sales', 'Fulfilment', 'Finance', 'Support'],
    services: ['erp', 'ai', 'marketing'],
  },
]

/** The five outcomes Zinfity's work is organised around. */
export const solutions: Solution[] = [
  {
    id: 'systems',
    title: 'Connected business systems',
    description:
      'ERP, CRM, finance and operations tools linked through clean integrations, so data moves once and every team sees the same picture.',
    connects: ['Engineering', 'Business processes'],
    appliesTo: ['Teams working from separate spreadsheets', 'Duplicate data entry between tools', 'Slow, manual reporting'],
    services: ['erp', 'software'],
    path: ['Team dashboard', 'ERP & CRM', 'APIs', 'Operational data', 'Finance'],
  },
  {
    id: 'products',
    title: 'Custom digital products',
    description:
      'Software designed around your customers and your model — portals, platforms and apps that become part of how you deliver value.',
    connects: ['Design', 'Engineering'],
    appliesTo: ['Customer or partner portals', 'New digital services', 'Products that off-the-shelf tools cannot support'],
    services: ['software', 'mobile', 'uiux'],
    path: ['Customer portal', 'Product platform', 'APIs', 'Operational data', 'Support'],
  },
  {
    id: 'automation',
    title: 'Workflow automation',
    description:
      'Repetitive, error-prone steps mapped and automated — approvals, document handling, notifications and hand-offs between tools.',
    connects: ['Business processes', 'Engineering'],
    appliesTo: ['High-volume requests or documents', 'Approval chains handled by email', 'Routine reporting'],
    services: ['ai', 'erp'],
    path: ['Team dashboard', 'ERP & CRM', 'AI services', 'Documents', 'Fulfilment'],
  },
  {
    id: 'platforms',
    title: 'Scalable web & mobile platforms',
    description:
      'Architecture chosen for where you are going, not just where you are: performant, secure and ready to grow with demand.',
    connects: ['Engineering', 'Growth'],
    appliesTo: ['Growing user numbers or catalogues', 'Websites that are slow or hard to update', 'Apps that need to work offline'],
    services: ['web', 'mobile', 'commerce'],
    path: ['Mobile app', 'Commerce engine', 'APIs', 'Operational data', 'Fulfilment'],
  },
  {
    id: 'data',
    title: 'Data-driven digital experiences',
    description:
      'Analytics and insight built into the product, so decisions on design, marketing and operations are made with evidence.',
    connects: ['Design', 'Growth'],
    appliesTo: ['Campaigns without reliable measurement', 'Journeys with unclear drop-off points', 'Decisions made on opinion'],
    services: ['marketing', 'uiux', 'web'],
    path: ['Website', 'Product platform', 'Workflows', 'Analytics', 'Sales'],
  },
]

export const disciplines = [
  { id: 'design', label: 'Design', note: 'Clarity for people' },
  { id: 'engineering', label: 'Engineering', note: 'Systems that hold' },
  { id: 'process', label: 'Business processes', note: 'How work flows' },
  { id: 'growth', label: 'Growth', note: 'Reach that compounds' },
]

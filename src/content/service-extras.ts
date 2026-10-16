/**
 * Additional content for the individual service pages (on top of
 * service-details.ts). Everything here describes how Zinfity works or what a
 * deliverable looks like — no client names, results or statistics.
 */

/** "How we'd start" — the first concrete step for each service. */
export const firstSteps: Record<string, { title: string; body: string; duration: string }> = {
  web: { title: 'Website review & content plan', body: 'We review your current site, goals and content, then propose a sitemap and page priorities.', duration: 'Usually the first 1–2 weeks' },
  mobile: { title: 'App discovery workshop', body: 'We define the core user tasks, platforms and must-have features, then prototype the key screens.', duration: 'Usually the first 1–2 weeks' },
  software: { title: 'Process & systems mapping', body: 'We map how the work flows today, the systems involved and where software would help most.', duration: 'Usually the first 2 weeks' },
  erp: { title: 'Operations fit analysis', body: 'We compare your processes with platform capabilities and agree which modules come first.', duration: 'Usually the first 2–3 weeks' },
  marketing: { title: 'Channel & tracking audit', body: 'We review your channels, content and analytics set-up, then agree goals and a first campaign plan.', duration: 'Usually the first 1–2 weeks' },
  uiux: { title: 'Research & discovery', body: 'We speak with users and stakeholders and review the current product before any screens are designed.', duration: 'Usually the first 1–2 weeks' },
  commerce: { title: 'Commerce audit', body: 'We review catalogue, checkout, operations and integrations, then recommend a platform approach.', duration: 'Usually the first 1–2 weeks' },
  microsoft: { title: 'Microsoft fit assessment', body: 'We review your processes, current licences and systems, then recommend which Microsoft products fit and what to configure or build first.', duration: 'Usually the first 2–3 weeks' },
  ai: { title: 'Automation opportunity review', body: 'We shortlist repetitive processes and pick one well-defined workflow for a first pilot.', duration: 'Usually the first 1–2 weeks' },
}

/** Website types (illustrative examples of what we build). */
export const siteTypes = [
  { id: 'corporate', name: 'Corporate website', body: 'Clear positioning, services, team and credibility for organisations of any size.' },
  { id: 'landing', name: 'Landing pages', body: 'Focused pages for campaigns and launches, built to convert a single action.' },
  { id: 'cms', name: 'CMS-driven sites', body: 'Content your team can publish and update safely — news, resources, products.' },
  { id: 'multilingual', name: 'Multilingual sites', body: 'One structure, several languages, with translation workflows and local SEO.' },
] as const

/** Mobile release journey (illustrative stages of an app, not a live store listing). */
export const releaseJourney = [
  { id: 'onboarding', name: 'Onboarding', body: 'First-run screens that explain value and request only the permissions needed.' },
  { id: 'task', name: 'Core task', body: 'The one job users open the app for, designed to be fast and obvious.' },
  { id: 'sync', name: 'Sync', body: 'Data saved on the device and synchronised reliably when a connection returns.' },
  { id: 'store', name: 'Store listing', body: 'Screenshots, description and review preparation for App Store and Google Play.' },
] as const

/** Digital marketing deliverables. */
export const marketingDeliverables = [
  { name: 'Campaign planning', body: 'Goals, audiences, channels, messages and a schedule agreed up front.' },
  { name: 'Content production', body: 'Ad copy, social posts, articles and email content written for each stage.' },
  { name: 'Landing pages', body: 'Focused pages built and tracked for each campaign.' },
  { name: 'Search & paid media', body: 'SEO improvements and paid campaigns set up and managed in your accounts.' },
  { name: 'Tracking set-up', body: 'Analytics, conversion events and tag management verified before launch.' },
  { name: 'Regular reporting', body: 'Plain-language reports on what is working and what changes next.' },
]

/** E-commerce operations we connect. */
export const commerceOperations = [
  { name: 'Product management', body: 'Catalogue structure, variants, pricing and media managed in one place.' },
  { name: 'Order management', body: 'Orders, statuses, returns and customer notifications in a clear workflow.' },
  { name: 'Inventory', body: 'Stock levels synchronised with your warehouse or ERP to avoid overselling.' },
  { name: 'Payments', body: 'Payment gateways, refunds and reconciliation with your accounting.' },
]

/** AI workflow (illustrative): from unstructured input to routed, reviewed work. */
export const aiWorkflow = [
  { id: 'inputs', name: 'Incoming', body: 'Emails, PDFs and form submissions arrive as they do today.' },
  { id: 'extract', name: 'Read & classify', body: 'Key details are extracted and each item is categorised.' },
  { id: 'review', name: 'Human review', body: 'A person checks and approves anything uncertain or sensitive.', checkpoint: true },
  { id: 'route', name: 'Route & act', body: 'Approved work becomes a task in the right team’s system.' },
] as const

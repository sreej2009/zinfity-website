/**
 * Microsoft Solutions page content. Product names and relationships follow
 * Microsoft's own naming. Zinfity is an independent company: nothing here
 * claims a Microsoft partnership, certification or client deployment.
 */

export type MsProductId = 'd365' | 'bc' | 'apps' | 'bi' | 'automate' | 'azure'

export type MsProduct = {
  id: MsProductId
  name: string
  /** Short role used in the ecosystem diagram. */
  role: string
  purpose: string
  capabilities: string[]
  useCases: string[]
  /** How it fits a wider solution. */
  fit: string
}

export const msProducts: MsProduct[] = [
  {
    id: 'd365',
    name: 'Microsoft Dynamics 365',
    role: 'Business applications',
    purpose:
      'Dynamics 365 is Microsoft’s family of business applications. Its customer-engagement apps — such as Dynamics 365 Sales and Dynamics 365 Customer Service — keep leads, opportunities, accounts and cases in one connected record.',
    capabilities: ['Lead & opportunity management', 'Account & contact history', 'Customer service cases', 'Sales pipeline & forecasting views', 'Role-based dashboards', 'Outlook & Teams integration'],
    useCases: ['A sales team tracking every opportunity in one pipeline', 'Service teams resolving cases with full customer history', 'Managers reviewing pipeline health without spreadsheets'],
    fit: 'Shares data through Microsoft Dataverse, so Power Apps, Power Automate and Power BI can build on the same customer records.',
  },
  {
    id: 'bc',
    name: 'Dynamics 365 Business Central',
    role: 'Finance & operations',
    purpose:
      'Business Central is a specific product within the Dynamics 365 family: an all-in-one business management application for small and mid-sized organisations, covering finance, sales, purchasing, inventory and operations.',
    capabilities: ['General ledger & financial reporting', 'Sales orders & invoicing', 'Purchasing & vendor management', 'Inventory & warehouse', 'Projects & resources', 'Excel, Outlook & Teams integration'],
    useCases: ['Replacing separate accounting and stock tools', 'Purchase approvals with a clear audit trail', 'Month-end close from one set of books'],
    fit: 'Connects to Power BI for reporting, Power Automate for approvals and Power Apps for task-specific screens.',
  },
  {
    id: 'apps',
    name: 'Microsoft Power Apps',
    role: 'Custom business apps',
    purpose:
      'Power Apps is Microsoft’s low-code platform for building custom business apps — canvas apps for task-focused screens and model-driven apps built on Dataverse — that run in a browser, on mobile and inside Teams.',
    capabilities: ['Canvas & model-driven apps', 'Mobile apps for field teams', 'Forms connected to live data', 'Dataverse, SharePoint & SQL data sources', 'Role-based access', 'Apps embedded in Teams'],
    useCases: ['Site inspections captured on a phone', 'Replacing paper or spreadsheet forms', 'Internal request and booking apps'],
    fit: 'Reads and writes the same data used by Dynamics 365 and Business Central; flows in Power Automate handle what happens next.',
  },
  {
    id: 'bi',
    name: 'Microsoft Power BI',
    role: 'Analytics & reporting',
    purpose:
      'Power BI turns connected business data into interactive reports and dashboards, with reports authored in Power BI Desktop and shared securely through the Power BI service.',
    capabilities: ['Interactive reports & dashboards', 'Data modelling & measures', 'Scheduled data refresh', 'Row-level security', 'Reports embedded in Teams & SharePoint', 'Many data source connectors'],
    useCases: ['Management dashboards from several systems', 'Sales and finance reporting without manual compilation', 'Operational KPIs shared with each team'],
    fit: 'Draws on Dynamics 365, Business Central, Azure SQL and other sources to give one reporting view.',
  },
  {
    id: 'automate',
    name: 'Microsoft Power Automate',
    role: 'Workflow automation',
    purpose:
      'Power Automate builds automated workflows — cloud flows triggered by events or schedules, approvals, and desktop flows for repetitive on-screen tasks — across Microsoft and third-party applications.',
    capabilities: ['Approval workflows', 'Automated, scheduled & instant flows', 'Notifications in Teams & Outlook', 'Connectors to Microsoft & third-party apps', 'Desktop flows for legacy systems', 'Run history for every flow'],
    useCases: ['Purchase requests routed for approval', 'New orders posted to the right team', 'Documents filed and records updated automatically'],
    fit: 'The connective layer: moves data and decisions between Dynamics 365, Business Central, SharePoint and custom apps.',
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    role: 'Cloud infrastructure',
    purpose:
      'Azure is Microsoft’s cloud platform. We use it to host custom applications, APIs and databases, and to run the integration services that connect business systems.',
    capabilities: ['Web app & API hosting (App Service)', 'Serverless functions', 'Azure SQL Database & storage', 'Identity with Microsoft Entra ID', 'Monitoring & logging', 'Secrets management with Key Vault'],
    useCases: ['Hosting a customer portal or internal platform', 'Integration services between business systems', 'A secure database behind custom apps and reports'],
    fit: 'Hosts the custom software and integrations that extend Dynamics 365 and the Power Platform beyond their standard features.',
  },
]

export const msProduct = (id: MsProductId) => msProducts.find((p) => p.id === id)!

/** Connections drawn in the ecosystem diagram (illustrative, typical patterns). */
export const msLinks: [MsProductId, MsProductId][] = [
  ['d365', 'bc'],
  ['d365', 'apps'],
  ['d365', 'bi'],
  ['bc', 'bi'],
  ['bc', 'automate'],
  ['apps', 'automate'],
  ['apps', 'azure'],
  ['bi', 'azure'],
  ['automate', 'd365'],
  ['azure', 'automate'],
]

/** Business scenarios and the products that typically combine to solve them. */
export const msScenarios: { title: string; body: string; products: MsProductId[] }[] = [
  { title: 'Connect business operations', body: 'Sales, finance and operations share one set of records instead of separate systems.', products: ['d365', 'bc', 'automate'] },
  { title: 'Improve reporting & decisions', body: 'Reports built from connected data replace weekly manual compilation.', products: ['bi', 'bc', 'd365'] },
  { title: 'Automate repetitive processes', body: 'Approvals, notifications and record updates run as defined flows.', products: ['automate', 'apps', 'bc'] },
  { title: 'Build custom internal apps', body: 'Task-specific apps for teams in the office and in the field.', products: ['apps', 'automate', 'azure'] },
  { title: 'Manage finance, inventory & purchasing', body: 'One business management system from purchase order to invoice.', products: ['bc', 'automate', 'bi'] },
  { title: 'Connect apps & cloud systems', body: 'Integrations and custom services hosted securely in the cloud.', products: ['azure', 'automate', 'apps'] },
]

/** Related Microsoft 365 work offered where it fits a wider project. */
export const msExtras = [
  { name: 'Microsoft 365 & Teams', body: 'Apps, reports and approvals brought into the tools people already use every day.' },
  { name: 'SharePoint', body: 'Document libraries, intranet pages and lists used as structured data sources for apps and flows.' },
  { name: 'Copilot Studio', body: 'Custom AI agents grounded in approved company content, designed with clear boundaries and human review.' },
]

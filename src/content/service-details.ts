/**
 * Long-form content for each /services/<slug> page.
 *
 * Every service has a different `signature` block, so each page has its own
 * centrepiece rather than one generic template with a new title.
 * Technology lists describe tools Zinfity typically works with — the actual
 * stack is chosen per project.
 */

export type Signature =
  | { kind: 'checklist'; title: string; intro: string; items: { title: string; body: string }[] }
  | {
      kind: 'compare'
      title: string
      intro: string
      options: { name: string; bestFor: string; consider: string }[]
    }
  | { kind: 'layers'; title: string; intro: string; layers: { name: string; body: string }[] }
  | {
      kind: 'modules'
      title: string
      intro: string
      modules: { name: string; body: string }[]
      integrations: string[]
    }
  | { kind: 'funnel'; title: string; intro: string; stages: { name: string; channels: string[]; body: string }[] }
  | { kind: 'artifacts'; title: string; intro: string; items: { name: string; body: string }[] }
  | { kind: 'journey'; title: string; intro: string; steps: { name: string; body: string }[] }
  | { kind: 'workflows'; title: string; intro: string; examples: { area: string; before: string; after: string }[] }

export type ServiceDetail = {
  id: string
  /** Hero headline split around an accent word. */
  headline: [string, string, string]
  intro: string
  /** Layout variant for the hero composition. */
  heroLayout: 'split' | 'stacked'
  problems: { title: string; body: string }[]
  benefits: { title: string; body: string }[]
  capabilities: { group: string; items: string[] }[]
  signature: Signature
  tech: { label: string; items: string[] }[]
  process: { name: string; body: string }[]
  faq: { q: string; a: string }[]
  relatedProject?: string
  related: string[]
  ctaLine: string
}

export const serviceDetails: Record<string, ServiceDetail> = {
  web: {
    id: 'web',
    headline: ['Websites that make your business', 'clear', 'at first glance.'],
    intro:
      'Your website is often the first serious conversation a customer has with you. We design and build fast, accessible, search-friendly sites that explain what you do, earn trust and are easy for your team to keep up to date.',
    heroLayout: 'split',
    problems: [
      { title: 'The site no longer reflects the business', body: 'Services, positioning and audiences have moved on, but the website still tells an older story.' },
      { title: 'Every small change needs a developer', body: 'Content updates are slow and costly because the site was not built with editing in mind.' },
      { title: 'Slow pages and poor mobile experience', body: 'Heavy pages and layouts that break on phones make visitors leave before they read anything.' },
      { title: 'Visitors don’t know what to do next', body: 'Unclear structure and weak calls to action mean interest rarely turns into enquiries.' },
    ],
    benefits: [
      { title: 'A clearer first impression', body: 'Structure and copy organised around the questions your customers actually ask.' },
      { title: 'Independence for your team', body: 'A content system your team can use confidently, without breaking the design.' },
      { title: 'Foundations for growth', body: 'Performance, accessibility and technical SEO built in from the start, not patched on later.' },
    ],
    capabilities: [
      { group: 'Strategy & content', items: ['Sitemap & information architecture', 'Messaging and page structure', 'Content migration planning'] },
      { group: 'Design', items: ['Art direction', 'Responsive interface design', 'Interaction & motion design'] },
      { group: 'Build', items: ['Static & headless builds', 'CMS integration', 'Forms, analytics and integrations'] },
    ],
    signature: {
      kind: 'checklist',
      title: 'What every website we build includes',
      intro: 'These are not add-ons. They are part of how we define “done”.',
      items: [
        { title: 'Responsive by design', body: 'Layouts designed for phones, tablets and large screens individually — not just squeezed.' },
        { title: 'Accessibility', body: 'Semantic markup, keyboard navigation, readable contrast and descriptive alternative text.' },
        { title: 'Performance', body: 'Optimised images, lean code and careful loading so pages feel quick on real connections.' },
        { title: 'Technical SEO', body: 'Clean URLs, metadata, structured headings, sitemaps and sensible indexing rules.' },
        { title: 'Editable content', body: 'Content modelled so your team can add pages and update copy safely.' },
        { title: 'Analytics & forms', body: 'Measurement and enquiry handling connected and tested before launch.' },
      ],
    },
    tech: [
      { label: 'Front end', items: ['React', 'Next.js', 'Vite', 'TypeScript', 'Tailwind CSS'] },
      { label: 'Content', items: ['Headless CMS', 'Markdown/MDX', 'WordPress (where it fits)'] },
      { label: 'Hosting', items: ['Edge/static hosting', 'CDN', 'Managed cloud'] },
    ],
    process: [
      { name: 'Content & structure', body: 'Agree audiences, goals, sitemap and key messages before any visual design.' },
      { name: 'Design direction', body: 'Explore the visual language on key pages, then extend it into a system.' },
      { name: 'Build & integrate', body: 'Develop responsive templates, connect the CMS, forms and analytics.' },
      { name: 'Launch & handover', body: 'Test across devices, set up redirects, launch and train your editors.' },
    ],
    faq: [
      { q: 'Can you redesign our existing website rather than start over?', a: 'Yes. We start by reviewing what works today — content, search visibility, integrations — and decide together what to keep, improve or replace.' },
      { q: 'Will we be able to edit the website ourselves?', a: 'That is the default. We set up a content system suited to your team and show you how to use it.' },
      { q: 'Do you write the content?', a: 'We can shape structure and key messages with you, and work alongside your team or a copywriter on the full content.' },
    ],
    relatedProject: 'commerce',
    related: ['uiux', 'marketing', 'commerce'],
    ctaLine: 'Planning a new website or a redesign?',
  },

  mobile: {
    id: 'mobile',
    headline: ['Mobile apps people', 'keep', 'on their home screen.'],
    intro:
      'We design and build iOS and Android apps for customers and for teams in the field — from first prototype to store release and beyond, with reliability on real devices and patchy networks treated as a requirement.',
    heroLayout: 'stacked',
    problems: [
      { title: 'Customers expect an app, but the case is unclear', body: 'It is hard to know which features matter and whether native, cross-platform or web is the right choice.' },
      { title: 'Field teams rely on paper or messaging apps', body: 'Information gets lost between the field and the office, and nobody has the full picture.' },
      { title: 'An existing app is fragile', body: 'Crashes, slow screens and difficult releases make every update stressful.' },
    ],
    benefits: [
      { title: 'The right platform decision', body: 'A clear recommendation based on your users, features and budget — not on habit.' },
      { title: 'Apps that work offline', body: 'Data is captured reliably and synchronised when a connection is available.' },
      { title: 'Smooth releases', body: 'Automated builds, testing and store submission so updates become routine.' },
    ],
    capabilities: [
      { group: 'Product', items: ['Feature prioritisation', 'Prototyping', 'Store listing preparation'] },
      { group: 'Engineering', items: ['Cross-platform & native development', 'Offline data & sync', 'Push notifications', 'Device features (camera, location)'] },
      { group: 'Operations', items: ['Backend APIs', 'Crash reporting & monitoring', 'Release automation'] },
    ],
    signature: {
      kind: 'compare',
      title: 'Native, cross-platform or web app?',
      intro: 'There is no universal answer. This is how we help you choose.',
      options: [
        { name: 'Cross-platform', bestFor: 'Most business and customer apps that need iOS and Android from one codebase.', consider: 'Some advanced device features may need native modules.' },
        { name: 'Native (Swift / Kotlin)', bestFor: 'Apps that depend heavily on platform-specific features or demanding performance.', consider: 'Two codebases to build and maintain.' },
        { name: 'Progressive web app', bestFor: 'Simple tools and content experiences where store presence is not essential.', consider: 'More limited access to device features and app stores.' },
      ],
    },
    tech: [
      { label: 'App', items: ['React Native', 'Expo', 'TypeScript', 'Swift', 'Kotlin'] },
      { label: 'Backend', items: ['Node.js', 'REST & GraphQL APIs', 'Firebase / Supabase'] },
      { label: 'Quality', items: ['Automated testing', 'CI/CD builds', 'Crash reporting'] },
    ],
    process: [
      { name: 'Define the core loop', body: 'Identify the few things users must be able to do quickly and well.' },
      { name: 'Prototype on devices', body: 'Validate flows with clickable prototypes on real phones.' },
      { name: 'Build in increments', body: 'Ship internal test builds regularly so feedback starts early.' },
      { name: 'Release & monitor', body: 'Prepare store listings, release, and watch stability closely after launch.' },
    ],
    faq: [
      { q: 'Do you publish the app to the App Store and Google Play?', a: 'Yes. We prepare builds and store listings and guide you through the developer accounts, which are registered in your organisation’s name.' },
      { q: 'Can the app work without an internet connection?', a: 'Yes — offline-first design is something we plan for from the beginning when the use case needs it.' },
    ],
    relatedProject: 'field',
    related: ['uiux', 'software', 'ai'],
    ctaLine: 'Thinking about an app for your customers or your team?',
  },

  software: {
    id: 'software',
    headline: ['Software shaped around', 'how', 'your business works.'],
    intro:
      'When off-the-shelf tools force your team into workarounds, custom software can fit the way you actually operate. We design and engineer portals, platforms and internal tools that are secure, maintainable and ready to grow.',
    heroLayout: 'split',
    problems: [
      { title: 'Work happens in spreadsheets and inboxes', body: 'Critical processes depend on manual copying, version confusion and individual memory.' },
      { title: 'Off-the-shelf tools almost fit', body: 'You pay for features you do not use while the ones you need require workarounds.' },
      { title: 'Systems don’t talk to each other', body: 'The same information is entered in several places and is rarely consistent.' },
      { title: 'Legacy software is holding you back', body: 'An older system works, but is hard to change, secure or extend.' },
    ],
    benefits: [
      { title: 'A tool that fits', body: 'Workflows, permissions and screens designed around your real process.' },
      { title: 'One source of truth', body: 'Data captured once and shared across teams and systems through clean integrations.' },
      { title: 'Room to evolve', body: 'Architecture and documentation that let the software grow with the business.' },
    ],
    capabilities: [
      { group: 'Applications', items: ['Customer & partner portals', 'Internal tools & dashboards', 'SaaS platforms'] },
      { group: 'Integration', items: ['API design', 'Third-party integrations', 'Data migration'] },
      { group: 'Platform', items: ['Cloud architecture', 'Authentication & roles', 'Security reviews', 'Monitoring'] },
    ],
    signature: {
      kind: 'layers',
      title: 'How we structure a custom platform',
      intro: 'Clear layers keep software understandable, testable and safe to change.',
      layers: [
        { name: 'Interface', body: 'Web and mobile front ends designed for each type of user, built on a shared design system.' },
        { name: 'Application services', body: 'Business rules, workflows and permissions, kept separate from screens so they can be reused and tested.' },
        { name: 'Integrations', body: 'Well-defined APIs and connectors to the tools you already rely on.' },
        { name: 'Data & infrastructure', body: 'Reliable databases, backups, logging and cloud hosting configured for security and scale.' },
      ],
    },
    tech: [
      { label: 'Application', items: ['TypeScript', 'React', 'Node.js', 'Python'] },
      { label: 'Data', items: ['PostgreSQL', 'Redis', 'Object storage'] },
      { label: 'Infrastructure', items: ['AWS / Azure / GCP', 'Docker', 'CI/CD pipelines'] },
    ],
    process: [
      { name: 'Map the process', body: 'Document how work flows today, where it breaks and what “better” looks like.' },
      { name: 'Design the system', body: 'Agree data model, architecture, integrations and a phased roadmap.' },
      { name: 'Deliver in phases', body: 'Release the most valuable workflows first and build on real feedback.' },
      { name: 'Support & extend', body: 'Monitor, maintain and add capabilities as needs change.' },
    ],
    faq: [
      { q: 'Who owns the code?', a: 'Ownership and licensing are agreed in the contract before work starts. Our standard approach is that the software we build for you is handed over with its source code and documentation.' },
      { q: 'Can you work with our existing systems?', a: 'Yes. Most projects involve integrating with existing tools, and we assess them early to avoid surprises.' },
    ],
    relatedProject: 'operations',
    related: ['erp', 'ai', 'uiux'],
    ctaLine: 'Have a process that deserves better software?',
  },

  erp: {
    id: 'erp',
    headline: ['One connected system for', 'every', 'team.'],
    intro:
      'We implement, customise and integrate ERP and CRM systems so sales, operations, finance and service work from the same, current information — with less manual entry and clearer reporting.',
    heroLayout: 'stacked',
    problems: [
      { title: 'Each department has its own version of the truth', body: 'Sales, stock and finance figures differ depending on who you ask.' },
      { title: 'Customer history is scattered', body: 'Conversations, quotes and orders live in personal inboxes and spreadsheets.' },
      { title: 'Reporting takes days', body: 'Month-end and management reports require manual consolidation.' },
    ],
    benefits: [
      { title: 'Shared, reliable data', body: 'Information entered once and used everywhere it is needed.' },
      { title: 'Visible pipelines and operations', body: 'See leads, orders, stock and cash in one place.' },
      { title: 'Fewer manual hand-offs', body: 'Approvals and notifications built into the workflow.' },
    ],
    capabilities: [
      { group: 'Implementation', items: ['Requirements & fit analysis', 'Configuration', 'User roles & permissions'] },
      { group: 'Customisation', items: ['Custom modules & fields', 'Workflow automation', 'Reports & dashboards'] },
      { group: 'Adoption', items: ['Data migration & cleansing', 'Training', 'Post-go-live support'] },
    ],
    signature: {
      kind: 'modules',
      title: 'Modules we connect',
      intro: 'We start with the modules that remove the most friction, then extend the system step by step.',
      modules: [
        { name: 'CRM & sales', body: 'Leads, opportunities, quotes and customer history in one timeline.' },
        { name: 'Inventory', body: 'Stock levels, locations and movements updated as they happen.' },
        { name: 'Purchasing', body: 'Requests, approvals and supplier orders with a clear audit trail.' },
        { name: 'Finance', body: 'Invoicing and payments connected to the operational records behind them.' },
        { name: 'Service', body: 'Tickets, field visits and service history linked to each customer.' },
        { name: 'People', body: 'Teams, roles and responsibilities reflected in access and approvals.' },
      ],
      integrations: ['Accounting software', 'E-commerce platforms', 'Email & calendars', 'Payment gateways', 'Messaging tools', 'Custom databases'],
    },
    tech: [
      { label: 'Platforms', items: ['Odoo', 'ERPNext', 'Zoho', 'Custom ERP modules'] },
      { label: 'Integration', items: ['REST APIs', 'Webhooks', 'Scheduled sync jobs'] },
      { label: 'Reporting', items: ['Dashboards', 'Exports', 'BI connectors'] },
    ],
    process: [
      { name: 'Fit analysis', body: 'Compare your processes with platform capabilities and decide what to configure or build.' },
      { name: 'Prepare data', body: 'Clean and map existing data before migration.' },
      { name: 'Configure & integrate', body: 'Set up modules, roles, workflows and integrations in a test environment.' },
      { name: 'Train & go live', body: 'Train each team on their workflows and support them through the switch.' },
    ],
    faq: [
      { q: 'Should we choose an existing ERP or build our own?', a: 'Usually an established platform with targeted customisation is the most practical route. We recommend custom modules only where your process is genuinely distinctive.' },
      { q: 'What happens to our existing data?', a: 'We plan migration early: what to move, how to clean it and how to verify it before go-live.' },
    ],
    relatedProject: 'operations',
    related: ['software', 'ai', 'commerce'],
    ctaLine: 'Ready to bring your teams onto one system?',
  },

  marketing: {
    id: 'marketing',
    headline: ['Growth that is', 'planned,', 'not hoped for.'],
    intro:
      'We connect search, content, social and paid media to your website and data, so marketing decisions are based on evidence and every channel supports the same goals.',
    heroLayout: 'split',
    problems: [
      { title: 'Activity without direction', body: 'Posts and campaigns go out, but nobody is sure which ones contribute to the business.' },
      { title: 'Traffic that doesn’t convert', body: 'Visitors arrive but leave without enquiring, because the journey after the click was never designed.' },
      { title: 'Measurement is incomplete', body: 'Analytics and tracking are partly set up, so reports raise more questions than they answer.' },
    ],
    benefits: [
      { title: 'A clear growth plan', body: 'Channels, messages and priorities agreed around your audience and goals.' },
      { title: 'Connected journeys', body: 'Campaigns, landing pages and follow-up designed as one path.' },
      { title: 'Trustworthy measurement', body: 'Tracking and reporting set up so you can see what is working.' },
    ],
    capabilities: [
      { group: 'Visibility', items: ['Search engine optimisation', 'Content strategy', 'Local search'] },
      { group: 'Acquisition', items: ['Paid search', 'Paid social', 'Campaign landing pages'] },
      { group: 'Insight', items: ['Analytics setup', 'Conversion tracking', 'Reporting dashboards'] },
    ],
    signature: {
      kind: 'funnel',
      title: 'From first impression to lasting relationship',
      intro: 'Each stage has a different job. We plan channels and content for all of them.',
      stages: [
        { name: 'Reach', channels: ['SEO', 'Paid social', 'Content'], body: 'Be found by the people who need what you offer.' },
        { name: 'Engage', channels: ['Website', 'Email', 'Social'], body: 'Give them reasons to learn more and trust you.' },
        { name: 'Convert', channels: ['Landing pages', 'Search ads', 'Forms'], body: 'Make the next step obvious and easy.' },
        { name: 'Retain', channels: ['Email', 'CRM', 'Community'], body: 'Stay useful after the first purchase or project.' },
      ],
    },
    tech: [
      { label: 'Measurement', items: ['Google Analytics 4', 'Tag Manager', 'Search Console'] },
      { label: 'Channels', items: ['Google Ads', 'Meta Ads', 'LinkedIn Ads'] },
      { label: 'Engagement', items: ['Email platforms', 'CRM integration', 'Landing page builds'] },
    ],
    process: [
      { name: 'Audit', body: 'Review current channels, tracking, content and competitors.' },
      { name: 'Plan', body: 'Set goals, audiences, messages and a channel plan.' },
      { name: 'Launch', body: 'Build campaigns and pages, with tracking verified before spend.' },
      { name: 'Optimise', body: 'Review results regularly and adjust what is not working.' },
    ],
    faq: [
      { q: 'Can you guarantee rankings or a number of leads?', a: 'No honest partner can. We commit to a clear plan, transparent reporting and steady improvement based on what the data shows.' },
      { q: 'Do you manage ad budgets?', a: 'We plan and manage campaigns; ad spend is paid directly from your own advertising accounts so you keep full visibility.' },
    ],
    related: ['web', 'commerce', 'uiux'],
    ctaLine: 'Want marketing that connects to real business goals?',
  },

  uiux: {
    id: 'uiux',
    headline: ['Design that makes complex things', 'feel', 'simple.'],
    intro:
      'We research how people work, design the flows and interfaces that support them, and turn the result into a design system your developers can build on — so products are easier to learn, use and evolve.',
    heroLayout: 'stacked',
    problems: [
      { title: 'Users get stuck or need training for basic tasks', body: 'Features exist, but people cannot find them or understand how they work.' },
      { title: 'Every screen looks a little different', body: 'Without a shared system, design and development drift apart with every release.' },
      { title: 'Decisions are based on opinion', body: 'Debates about features happen without input from the people who will use them.' },
    ],
    benefits: [
      { title: 'Products people understand', body: 'Clear flows and language reduce errors and support requests.' },
      { title: 'Faster, consistent delivery', body: 'Reusable components help design and engineering move together.' },
      { title: 'Evidence-based decisions', body: 'Research and testing reduce the risk of building the wrong thing.' },
    ],
    capabilities: [
      { group: 'Research', items: ['Stakeholder & user interviews', 'Usability testing', 'Journey mapping'] },
      { group: 'Design', items: ['Information architecture', 'Interface design', 'Interactive prototypes'] },
      { group: 'Systems', items: ['Design systems', 'Component libraries', 'Accessibility reviews'] },
    ],
    signature: {
      kind: 'artifacts',
      title: 'What you receive',
      intro: 'Every artefact has a purpose: to align people, test ideas or guide implementation.',
      items: [
        { name: 'Journey maps', body: 'How users move through a task today, with pain points and opportunities highlighted.' },
        { name: 'User flows', body: 'The steps and decisions in each key task, agreed before screens are designed.' },
        { name: 'Wireframes', body: 'Low-detail layouts to settle structure and content quickly.' },
        { name: 'Prototypes', body: 'Clickable designs used to test with real users and stakeholders.' },
        { name: 'UI designs', body: 'Polished, responsive screens for every state, including empty and error states.' },
        { name: 'Design system', body: 'Tokens, components and usage guidelines shared with developers.' },
      ],
    },
    tech: [
      { label: 'Design', items: ['Figma', 'FigJam', 'Prototyping tools'] },
      { label: 'Research', items: ['Interview guides', 'Usability test scripts', 'Analytics review'] },
      { label: 'Handover', items: ['Design tokens', 'Component specs', 'Storybook'] },
    ],
    process: [
      { name: 'Understand', body: 'Interview users and stakeholders; review existing products and data.' },
      { name: 'Structure', body: 'Define information architecture and key user flows.' },
      { name: 'Design & test', body: 'Prototype, test with users and refine.' },
      { name: 'Systemise', body: 'Document components and support developers during build.' },
    ],
    faq: [
      { q: 'Can you redesign an existing product without rebuilding it?', a: 'Often, yes. We can improve flows and interfaces incrementally and introduce a design system alongside your current codebase.' },
      { q: 'Do you work with our in-house developers?', a: 'Yes. We hand over design systems and specifications and stay involved during implementation.' },
    ],
    relatedProject: 'field',
    related: ['web', 'mobile', 'software'],
    ctaLine: 'Need a product that is easier to use?',
  },

  commerce: {
    id: 'commerce',
    headline: ['Commerce built for', 'buyers', 'and operators alike.'],
    intro:
      'We design and build online stores and commerce platforms that are pleasant to shop and practical to run — with catalogue, checkout, payments, fulfilment and integrations considered together.',
    heroLayout: 'split',
    problems: [
      { title: 'Checkout loses customers', body: 'Long forms, surprise costs and slow pages cause people to abandon their carts.' },
      { title: 'Operations are manual', body: 'Orders, stock and invoices are copied between the store and back-office tools by hand.' },
      { title: 'The platform limits the brand', body: 'Templates make it difficult to present products the way they deserve.' },
    ],
    benefits: [
      { title: 'A smoother buying journey', body: 'Fast pages, clear product information and a simple checkout.' },
      { title: 'Connected operations', body: 'Orders, stock and accounting synchronised automatically.' },
      { title: 'A brand-led storefront', body: 'Design freedom without losing the reliability of proven commerce platforms.' },
    ],
    capabilities: [
      { group: 'Storefront', items: ['Product & category design', 'Search & filtering', 'Mobile-first checkout'] },
      { group: 'Platform', items: ['Shopify & headless commerce', 'Custom commerce builds', 'Payment gateway integration'] },
      { group: 'Operations', items: ['Inventory & ERP sync', 'Shipping & fulfilment', 'Marketplace integrations'] },
    ],
    signature: {
      kind: 'journey',
      title: 'The journey we design end to end',
      intro: 'Commerce works when every step — front of house and back office — is considered.',
      steps: [
        { name: 'Discover', body: 'Search, navigation and landing pages that help shoppers find the right product.' },
        { name: 'Evaluate', body: 'Product pages with the details, imagery and answers people need to decide.' },
        { name: 'Purchase', body: 'A short, trustworthy checkout with suitable payment options.' },
        { name: 'Fulfil', body: 'Orders flowing to stock, shipping and accounting without re-typing.' },
        { name: 'Return', body: 'Accounts, re-ordering and communication that bring customers back.' },
      ],
    },
    tech: [
      { label: 'Platforms', items: ['Shopify', 'WooCommerce', 'Headless commerce', 'Custom builds'] },
      { label: 'Payments', items: ['Payment gateways', 'UPI & cards', 'Subscriptions'] },
      { label: 'Integrations', items: ['ERP & inventory', 'Shipping providers', 'Marketplaces'] },
    ],
    process: [
      { name: 'Commerce audit', body: 'Review catalogue, operations, platform options and integrations.' },
      { name: 'Experience design', body: 'Design key templates: home, category, product, cart and checkout.' },
      { name: 'Build & integrate', body: 'Develop the store and connect payments, stock and fulfilment.' },
      { name: 'Launch & improve', body: 'Test real orders end to end, launch and refine based on behaviour.' },
    ],
    faq: [
      { q: 'Which commerce platform should we use?', a: 'It depends on catalogue size, operations and how much flexibility you need. We compare options against your requirements before recommending one.' },
      { q: 'Can you migrate our existing store?', a: 'Yes — including products, customers and order history where the platforms allow, with redirects to protect search visibility.' },
    ],
    relatedProject: 'commerce',
    related: ['web', 'marketing', 'erp'],
    ctaLine: 'Planning a new store or a better one?',
  },

  ai: {
    id: 'ai',
    headline: ['Automation that gives your team', 'time', 'back.'],
    intro:
      'We identify repetitive, rules-based work and automate it — using workflow tools, integrations and AI where it genuinely helps — with people kept in control of the decisions that matter.',
    heroLayout: 'stacked',
    problems: [
      { title: 'Skilled people doing repetitive work', body: 'Copying data, sorting requests and chasing approvals take time away from valuable work.' },
      { title: 'Information arrives in unstructured form', body: 'Emails, PDFs and forms need to be read and re-typed before anything can happen.' },
      { title: 'AI is interesting, but where to start?', body: 'There are many tools and claims; it is hard to know which uses are safe and worthwhile.' },
    ],
    benefits: [
      { title: 'Fewer manual steps', body: 'Routine tasks handled automatically, with exceptions routed to people.' },
      { title: 'Faster responses', body: 'Requests classified, routed and prepared as soon as they arrive.' },
      { title: 'Responsible use of AI', body: 'Clear boundaries, human review and attention to data privacy.' },
    ],
    capabilities: [
      { group: 'Automation', items: ['Process discovery', 'Workflow automation', 'System integrations'] },
      { group: 'AI', items: ['Document & email processing', 'AI assistants on your knowledge', 'Classification & routing'] },
      { group: 'Data', items: ['Data pipelines', 'Reporting automation', 'Monitoring & audit trails'] },
    ],
    signature: {
      kind: 'workflows',
      title: 'Where automation typically helps',
      intro: 'Illustrative examples of the kind of change we look for — every process is assessed individually.',
      examples: [
        { area: 'Incoming enquiries', before: 'Someone reads every email and forwards it to the right person.', after: 'Requests are classified and routed automatically, with a draft reply prepared for review.' },
        { area: 'Documents & invoices', before: 'Details are re-typed from PDFs into another system.', after: 'Key fields are extracted, validated and entered, with uncertain cases flagged.' },
        { area: 'Approvals', before: 'Approvals are chased over chat and email.', after: 'Requests follow a defined path with reminders and a clear audit trail.' },
        { area: 'Reporting', before: 'Figures are compiled manually from several sources each week.', after: 'Reports are generated on schedule from connected data.' },
      ],
    },
    tech: [
      { label: 'AI', items: ['LLM APIs', 'Retrieval (RAG)', 'Document AI'] },
      { label: 'Automation', items: ['n8n / Make / Zapier', 'Custom Python services', 'Webhooks'] },
      { label: 'Governance', items: ['Human-in-the-loop review', 'Access controls', 'Logging'] },
    ],
    process: [
      { name: 'Discover', body: 'Map candidate processes and estimate effort, risk and value together.' },
      { name: 'Pilot', body: 'Automate one well-defined workflow and measure it against today’s process.' },
      { name: 'Integrate', body: 'Connect to your systems with monitoring, permissions and review steps.' },
      { name: 'Scale', body: 'Extend to further processes once the first one is proven.' },
    ],
    faq: [
      { q: 'Is our data safe when using AI?', a: 'We design around your data policies: choosing providers and settings carefully, limiting what is shared and keeping humans in the review loop for sensitive decisions.' },
      { q: 'Do we need AI, or just automation?', a: 'Often plain workflow automation solves most of the problem. We use AI only where it adds clear value.' },
    ],
    relatedProject: 'automation',
    related: ['software', 'erp', 'marketing'],
    ctaLine: 'Have a process that should run itself?',
  },
  microsoft: {
    id: 'microsoft',
    headline: ['Microsoft solutions that', 'move', 'your business forward.'],
    intro:
      'We help businesses plan, configure and connect Microsoft business applications — Dynamics 365, Business Central, Power Apps, Power BI, Power Automate and Azure — so each one fits the way your teams actually work.',
    heroLayout: 'split',
    problems: [
      { title: 'Licences without a plan', body: 'Microsoft tools are paid for but only partly used, because nobody has mapped them to real processes.' },
      { title: 'Data in separate places', body: 'Sales, finance and operations each keep their own records, so reports are assembled by hand.' },
      { title: 'Manual steps between systems', body: 'Approvals, re-typing and spreadsheet exports fill the gaps between applications.' },
    ],
    benefits: [
      { title: 'Connected business processes', body: 'Sales, finance, operations and reporting working from shared, consistent data.' },
      { title: 'Decisions from live reports', body: 'Dashboards built on connected sources instead of weekly manual compilation.' },
      { title: 'Less manual work', body: 'Approvals, notifications and routine updates handled by automated flows.' },
    ],
    capabilities: [
      { group: 'Business applications', items: ['Dynamics 365 configuration', 'Business Central implementation', 'Data migration'] },
      { group: 'Power Platform', items: ['Power Apps (canvas & model-driven)', 'Power Automate flows', 'Power BI reports & dashboards'] },
      { group: 'Cloud & integration', items: ['Azure application hosting', 'APIs & system integration', 'Identity & access set-up'] },
    ],
    signature: {
      kind: 'modules',
      title: 'The Microsoft products we work with',
      intro: 'Each product has a distinct job. The value comes from connecting them carefully.',
      modules: [
        { name: 'Dynamics 365', body: 'Microsoft’s family of business applications for sales, customer service and wider operations.' },
        { name: 'Business Central', body: 'Dynamics 365 Business Central: business management for small and mid-sized organisations.' },
        { name: 'Power Apps', body: 'Low-code custom business apps for web and mobile, connected to your data.' },
        { name: 'Power BI', body: 'Interactive reports and dashboards built from connected business data.' },
        { name: 'Power Automate', body: 'Automated workflows and approvals across Microsoft and third-party applications.' },
        { name: 'Azure', body: 'Microsoft’s cloud platform for hosting applications, data and integrations.' },
      ],
      integrations: ['Microsoft 365', 'SharePoint', 'Microsoft Teams', 'Dataverse', 'Microsoft Entra ID', 'Third-party APIs'],
    },
    tech: [
      { label: 'Business apps', items: ['Dynamics 365', 'Business Central', 'Dataverse'] },
      { label: 'Power Platform', items: ['Power Apps', 'Power Automate', 'Power BI', 'Copilot Studio'] },
      { label: 'Cloud', items: ['Azure App Service', 'Azure Functions', 'Azure SQL Database', 'Microsoft Entra ID'] },
    ],
    process: [
      { name: 'Discovery', body: 'Understand your processes, systems, licences and goals.' },
      { name: 'Requirements', body: 'Agree what each team needs, including reports, roles and integrations.' },
      { name: 'Solution planning', body: 'Choose the right products and decide what to configure, extend or build.' },
      { name: 'Configuration & development', body: 'Set up the applications and build apps, flows and reports in a test environment.' },
      { name: 'Integration', body: 'Connect Microsoft products with each other and with your existing systems.' },
      { name: 'Testing', body: 'Test real scenarios with your team before anything goes live.' },
      { name: 'Handover & support', body: 'Train users, document the solution and support it after launch.' },
    ],
    faq: [
      { q: 'Are you a Microsoft partner?', a: 'We are an independent technology company. We plan, configure and build on Microsoft products, and we will always tell you plainly about any partner programme status rather than imply one.' },
      { q: 'Is Business Central the same as Dynamics 365?', a: 'Business Central is one product within the Dynamics 365 family: an all-in-one business management application for small and mid-sized organisations. Other Dynamics 365 apps cover areas such as sales and customer service.' },
      { q: 'Do we need to buy new licences?', a: 'Not necessarily. We start from what you already have and recommend licences only where a requirement genuinely needs them. Licences are purchased in your own name.' },
      { q: 'Can Microsoft products connect to our other systems?', a: 'Usually, through standard connectors or APIs. We confirm what is possible for your specific systems during discovery.' },
    ],
    related: ['erp', 'ai', 'software'],
    ctaLine: 'Planning a Microsoft project? Let’s map it together.',
  },
}

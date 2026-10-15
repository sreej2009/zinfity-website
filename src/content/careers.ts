/**
 * Job listings for /careers and /careers/<slug>.
 *
 * IMPORTANT: every entry below is a SAMPLE listing (`sample: true`) used to
 * demonstrate the careers pages. They are not open vacancies. Samples are shown
 * in a separate, clearly labelled "Example roles" section and cannot be mistaken
 * for real openings.
 *
 * To publish a real vacancy, add an entry with `sample: false` and fill in only
 * verified details (employment type, location, etc.). Leave a field undefined
 * rather than guessing — the page hides empty fields.
 */
export type Job = {
  slug: string
  title: string
  department: 'Engineering' | 'Design' | 'Marketing' | 'Delivery'
  summary: string
  about: string
  responsibilities: string[]
  skills: string[]
  niceToHave?: string[]
  /** Only when verified, e.g. 'Full-time'. */
  employmentType?: string
  /** Only when verified, e.g. 'Chennai · Hybrid'. */
  location?: string
  sample: boolean
}

export const jobs: Job[] = [
  {
    slug: 'frontend-developer-react',
    title: 'Frontend Developer (React)',
    department: 'Engineering',
    summary: 'Build fast, accessible interfaces for websites, platforms and internal tools.',
    about:
      'You will turn designs into responsive, accessible and well-structured interfaces, working closely with designers and backend engineers from the first prototype to production.',
    responsibilities: [
      'Build responsive interfaces with React and TypeScript.',
      'Collaborate with designers to implement and refine design systems.',
      'Write clean, tested and documented code.',
      'Pay attention to performance, accessibility and browser support.',
      'Review code and share knowledge with the team.',
    ],
    skills: [
      'Solid experience with React, TypeScript and modern CSS.',
      'Understanding of accessibility and semantic HTML.',
      'Comfort working with REST or GraphQL APIs.',
      'Clear written and spoken communication.',
    ],
    niceToHave: ['Experience with animation libraries such as GSAP', 'Familiarity with headless CMS platforms'],
    sample: true,
  },
  {
    slug: 'product-designer-ui-ux',
    title: 'Product Designer (UI/UX)',
    department: 'Design',
    summary: 'Research, design and prototype digital products that are clear and useful.',
    about:
      'You will lead design work from understanding users to polished interfaces and design systems, and stay involved through development to make sure the details land.',
    responsibilities: [
      'Plan and run user interviews and usability tests.',
      'Create user flows, wireframes, prototypes and final UI designs.',
      'Build and maintain design systems in Figma.',
      'Work alongside developers during implementation.',
    ],
    skills: [
      'A portfolio showing your process as well as final designs.',
      'Strong interface and typography skills.',
      'Confidence presenting and explaining design decisions.',
      'Working knowledge of accessibility principles.',
    ],
    niceToHave: ['Experience designing complex business software', 'Basic HTML/CSS knowledge'],
    sample: true,
  },
  {
    slug: 'digital-marketing-specialist',
    title: 'Digital Marketing Specialist',
    department: 'Marketing',
    summary: 'Plan and run search, social and content campaigns connected to real business goals.',
    about:
      'You will plan, launch and improve campaigns across search, social and content, and make sure tracking and reporting give clients an honest view of what is working.',
    responsibilities: [
      'Plan campaigns around client goals and audiences.',
      'Manage search and social advertising campaigns.',
      'Set up and verify analytics and conversion tracking.',
      'Prepare clear, honest performance reports.',
    ],
    skills: [
      'Hands-on experience with Google Ads and Meta Ads.',
      'Working knowledge of Google Analytics 4 and Tag Manager.',
      'Good writing skills and attention to detail.',
    ],
    niceToHave: ['SEO experience', 'Experience with email marketing platforms'],
    sample: true,
  },
]

export const openJobs = jobs.filter((j) => !j.sample)
export const sampleJobs = jobs.filter((j) => j.sample)
export const jobDepartments = ['All', ...Array.from(new Set(jobs.map((j) => j.department)))]
export const jobBySlug = (slug: string) => jobs.find((j) => j.slug === slug)
export const jobPath = (j: Pick<Job, 'slug'>) => `/careers/${j.slug}`

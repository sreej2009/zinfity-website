/**
 * Job listings for /careers and /careers/<slug>.
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

/** Add real vacancies here (sample: false). The page shows a "no open roles" state while this is empty. */
export const jobs: Job[] = []

export const openJobs = jobs.filter((j) => !j.sample)
export const sampleJobs = jobs.filter((j) => j.sample)
export const jobDepartments = ['All', ...Array.from(new Set(jobs.map((j) => j.department)))]
export const jobBySlug = (slug: string) => jobs.find((j) => j.slug === slug)
export const jobPath = (j: Pick<Job, 'slug'>) => `/careers/${j.slug}`

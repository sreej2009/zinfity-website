import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { jobPath, type Job } from '@/content/careers'

/** One job listing row; the whole row links to the job page. */
export function JobRow({ job }: { job: Job }) {
  const facts = [job.department, job.employmentType, job.location].filter(Boolean)
  return (
    <li className="group relative border-b border-line">
      <div className="grid gap-4 py-7 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <h3 className="text-[1.45rem] font-medium tracking-[-0.025em]">
            <Link to={jobPath(job)} className="after:absolute after:inset-0 after:content-['']">
              <span className="link-draw">{job.title}</span>
            </Link>
          </h3>
          {job.sample && <span className="badge-sample mt-3">Sample listing — not an open role</span>}
        </div>
        <p className="leading-relaxed text-muted lg:col-span-4">{job.summary}</p>
        <div className="flex items-center justify-between gap-4 lg:col-span-3 lg:justify-end">
          <p className="eyebrow text-subtle">{facts.join(' · ')}</p>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong transition-colors group-hover:border-fg group-hover:bg-fg group-hover:text-canvas">
            <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </div>
      </div>
    </li>
  )
}

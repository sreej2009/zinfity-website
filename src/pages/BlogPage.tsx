import { useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Search, X } from 'lucide-react'
import { Seo } from '@/components/Seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PostMeta, PostThumb } from '@/components/blocks/PostCard'
import { formatDate, postCategories, postPath, posts } from '@/content/blog'
import { useReveal } from '@/hooks/useReveal'

export default function BlogPage() {
  const root = useRef<HTMLDivElement>(null)
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const rawCat = params.get('category') ?? 'All'
  const category = postCategories.includes(rawCat) ? rawCat : 'All'
  const filtering = q.trim() !== '' || category !== 'All'

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    return posts.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (!term || [p.title, p.excerpt, p.category, ...p.tags].some((t) => t.toLowerCase().includes(term))),
    )
  }, [q, category])

  const featured = !filtering ? posts[0] : undefined
  const list = featured ? results.filter((p) => p !== featured) : results
  useReveal(root, [q, category])

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'All') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <div ref={root}>
      <Seo
        title="Blog"
        description="The Zinfity Journal: practical notes on websites, mobile apps, custom software, ERP & CRM, automation and digital transformation."
      />

      {/* Masthead */}
      <header className="container-x pt-[calc(var(--header-h)+3rem)] lg:pt-36">
        <Breadcrumbs items={[{ label: 'Blog' }]} />
        <div className="border-y-[3px] border-double border-fg py-6 text-center">
          <p className="eyebrow text-muted">Zinfity Technologies</p>
          <h1 className="mt-2 font-serif text-[clamp(3.6rem,11vw,10rem)] italic leading-[0.9] tracking-[-0.03em]">The Journal</h1>
        </div>
        <div className="flex flex-col gap-2 border-b border-line py-3 text-[0.82rem] text-muted sm:flex-row sm:justify-between">
          <span>Practical notes on building useful technology</span>
          <span>
            {posts.length} {posts.length === 1 ? 'article' : 'articles'}
            {posts[0] && <> · Latest {formatDate(posts[0].date)}</>}
          </span>
        </div>
      </header>

      {posts.length === 0 ? (
        <section className="container-x py-24">
          <p className="text-center text-2xl font-medium">No articles published yet.</p>
        </section>
      ) : (
        <>
          {featured && (
            <section aria-labelledby="featured" className="container-x py-14 lg:py-20">
              <article className="group relative grid gap-10 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-6">
                  <p className="eyebrow mb-5 text-subtle">Lead story</p>
                  <PostMeta post={featured} />
                  <h2 id="featured" className="mt-5 text-balance text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[1] tracking-[-0.04em]">
                    <Link to={postPath(featured)} className="after:absolute after:inset-0 after:content-['']">
                      <span className="link-draw">{featured.title}</span>
                    </Link>
                  </h2>
                  <p className="mt-6 font-serif text-[1.35rem] italic leading-snug text-muted">{featured.excerpt}</p>
                </div>
                <div className="lg:col-span-6">
                  <PostThumb post={featured} aspect="aspect-[4/3]" />
                </div>
              </article>
            </section>
          )}

          <section aria-labelledby="all-articles" className="container-x pb-28">
            <h2 id="all-articles" className="sr-only">
              All articles
            </h2>
            <div className="flex flex-col gap-4 border-y border-fg py-4 lg:flex-row lg:items-center lg:justify-between">
              <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-x-5 gap-y-2">
                {postCategories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={c === category}
                    onClick={() => set('category', c)}
                    className={`text-[0.92rem] transition-colors ${c === category ? 'text-fg underline decoration-accent-ink decoration-2 underline-offset-8' : 'text-muted hover:text-fg'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="relative w-full lg:w-72">
                <label htmlFor="blog-search" className="sr-only">
                  Search articles
                </label>
                <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-subtle" />
                <input
                  id="blog-search"
                  type="search"
                  value={q}
                  onChange={(e) => set('q', e.target.value)}
                  placeholder="Search the journal"
                  className="h-10 w-full border-b border-line-strong bg-transparent pl-7 pr-8 text-[0.94rem] outline-none placeholder:text-subtle focus:border-accent-ink [&::-webkit-search-cancel-button]:hidden"
                />
                {q && (
                  <button type="button" onClick={() => set('q', '')} aria-label="Clear search" className="absolute right-0 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center">
                    <X size={15} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            <p className="sr-only" aria-live="polite">
              {results.length} {results.length === 1 ? 'article' : 'articles'} found
            </p>

            {list.length === 0 && filtering ? (
              <div className="py-16 text-center">
                <p className="text-xl font-medium">No articles match your search.</p>
                <button type="button" onClick={() => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true })} className="link-draw mt-4 text-accent-ink">
                  Clear filters
                </button>
              </div>
            ) : (
              <ol>
                {list.map((p) => (
                  <li key={p.slug} data-reveal className="group relative border-b border-line">
                    <article className="grid gap-3 py-8 md:grid-cols-12 md:items-baseline">
                      <time dateTime={p.date} className="font-mono text-[0.75rem] text-subtle md:col-span-2">
                        {formatDate(p.date)}
                      </time>
                      <p className="eyebrow text-accent-ink md:col-span-2">{p.category}</p>
                      <div className="md:col-span-6">
                        <h3 className="text-[clamp(1.4rem,2.2vw,2rem)] font-medium leading-tight tracking-[-0.03em]">
                          <Link to={postPath(p)} className="after:absolute after:inset-0 after:content-['']">
                            <span className="link-draw">{p.title}</span>
                          </Link>
                        </h3>
                        <p className="mt-2 line-clamp-2 leading-relaxed text-muted">{p.excerpt}</p>
                      </div>
                      <p className="flex items-center gap-3 text-[0.82rem] text-muted md:col-span-2 md:justify-end">
                        {p.status === 'sample' && <span className="badge-sample">Sample</span>}
                        {p.readingMinutes} min
                      </p>
                    </article>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </>
      )}
    </div>
  )
}

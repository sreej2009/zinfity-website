import { useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { marked } from 'marked'
import { Check, Link2 } from 'lucide-react'
import { Seo } from '@/components/Seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Link } from 'react-router'
import { PostMeta, PostThumb } from '@/components/blocks/PostCard'
import { formatDate, postPath } from '@/content/blog'
import { postBySlug, posts } from '@/content/blog'
import { site } from '@/config/site'
import { useReveal } from '@/hooks/useReveal'
import NotFound from './NotFound'

function ShareLinks({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href.split('#')[0] : ''
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  const links = [
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}` },
    { label: 'Email', href: `mailto:?subject=${t}&body=${u}` },
  ]
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }
  return (
    <div>
      <p className="eyebrow text-subtle">Share</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.label === 'Email' ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="chip transition-colors hover:border-fg"
            >
              {l.label}
              {l.label !== 'Email' && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={copy} className="chip gap-1.5 transition-colors hover:border-fg">
            {copied ? <Check size={13} aria-hidden="true" /> : <Link2 size={13} aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy link'}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? 'Link copied to clipboard' : ''}
          </span>
        </li>
      </ul>
    </div>
  )
}

export default function PostPage() {
  const { slug = '' } = useParams()
  const post = postBySlug(slug)
  const root = useRef<HTMLDivElement>(null)
  useReveal(root, [slug])
  // Content is authored locally in the repository (trusted), so rendered HTML is safe to inject.
  const html = useMemo(() => (post ? (marked.parse(post.body, { async: false }) as string) : ''), [post])

  if (!post)
    return (
      <div ref={root}>
        <NotFound />
      </div>
    )

  const related = [...posts.filter((p) => p !== post && p.category === post.category), ...posts.filter((p) => p !== post && p.category !== post.category)].slice(0, 3)
  const base = site.url?.replace(/\/+$/, '')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: site.name },
    ...(base ? { mainEntityOfPage: `${base}/blog/${post.slug}` } : {}),
  }

  return (
    <div ref={root}>
      <Seo title={post.title} description={post.excerpt} type="article" publishedTime={post.date} noindex={post.status === 'draft'} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <article>
        <header className="pt-[calc(var(--header-h)+3.5rem)] lg:pt-44">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              <Breadcrumbs items={[{ label: 'Blog', to: '/blog' }, { label: post.title }]} />
              <PostMeta post={post} />
              <h1 className="mt-6 text-balance text-[clamp(2.3rem,5vw,4.5rem)] font-medium leading-[1] tracking-[-0.045em]">{post.title}</h1>
              <p className="text-lede mt-6 text-muted">{post.excerpt}</p>
              <p className="mt-6 text-[0.9rem] text-subtle">By {post.author}</p>
            </div>
            <div className="mx-auto mt-14 max-w-5xl">
              <PostThumb post={post} aspect="aspect-[16/9]" className="rounded-[1.5rem]" />
            </div>
          </div>
        </header>

        <div className="container-x py-16 lg:py-24">
          <div className="mx-auto max-w-3xl">
            {post.status === 'sample' && (
              <p className="mb-12 rounded-xl border border-dashed border-accent-ink/60 bg-surface p-5 text-[0.92rem] text-muted">
                <span className="badge-sample mr-2">Sample article</span>
                This article is sample content prepared to demonstrate the blog. It contains general guidance only.
              </p>
            )}
            <div className="prose-z" dangerouslySetInnerHTML={{ __html: html }} />
            {post.tags.length > 0 && (
              <ul className="mt-14 flex flex-wrap gap-2 border-t border-line pt-8" aria-label="Tags">
                {post.tags.map((t) => (
                  <li key={t} className="chip text-muted">
                    #{t}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-10">
              <ShareLinks title={post.title} />
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <aside aria-labelledby="related-posts" className="border-t border-line bg-canvas-alt py-16">
          <div className="container-x mx-auto max-w-3xl">
            <h2 id="related-posts" className="eyebrow text-muted">
              Keep reading
            </h2>
            <ul className="mt-6 border-t border-line">
              {related.map((p) => (
                <li key={p.slug} className="border-b border-line">
                  <Link to={postPath(p)} className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <span className="text-xl font-medium tracking-[-0.02em]">
                      <span className="link-draw">{p.title}</span>
                    </span>
                    <span className="shrink-0 text-[0.82rem] text-muted">
                      {p.category} · {formatDate(p.date)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-[0.98rem] text-muted">
              Want to talk this through for your business?{' '}
              <Link to="/contact" className="link-draw text-fg">
                Start a conversation
              </Link>
              .
            </p>
          </div>
        </aside>
      )}
    </div>
  )
}

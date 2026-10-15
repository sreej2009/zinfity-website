import { formatDate, type Post } from '@/content/blog'
import { ServiceStage } from './ServiceStage'

export function PostMeta({ post, className = '' }: { post: Post; className?: string }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.82rem] text-muted ${className}`}>
      <span className="eyebrow text-accent-ink">{post.category}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden="true">·</span>
      <span>{post.readingMinutes} min read</span>
      {post.status === 'sample' && <span className="badge-sample">Sample article</span>}
      {post.status === 'draft' && <span className="badge-sample">Draft</span>}
    </p>
  )
}

export function PostThumb({ post, className = '', aspect = 'aspect-[16/10]' }: { post: Post; className?: string; aspect?: string }) {
  if (post.image)
    return (
      <div className={`overflow-hidden rounded-2xl ${aspect} ${className}`}>
        <img src={post.image} alt={post.imageAlt ?? ''} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.03]" />
      </div>
    )
  return <ServiceStage visual={post.cover} aspect={aspect} padding="p-6" className={className} />
}

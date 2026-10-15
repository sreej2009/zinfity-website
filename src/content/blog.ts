import { parseFrontMatter, isPublishable } from './frontmatter'
import type { ServiceVisualKey } from './services'

/**
 * Blog posts are Markdown files in ./blog. The file name is the URL slug.
 * See README.md → "Publishing blog articles".
 */
export type PostStatus = 'published' | 'sample' | 'draft'

export type Post = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  cover: ServiceVisualKey
  image?: string
  imageAlt?: string
  tags: string[]
  status: PostStatus
  author: string
  body: string
  readingMinutes: number
}

const files = import.meta.glob('./blog/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback)

export const posts: Post[] = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '')
    const { data, body } = parseFrontMatter(raw)
    const words = body.split(/\s+/).filter(Boolean).length
    return {
      slug,
      title: str(data.title, slug),
      excerpt: str(data.excerpt),
      category: str(data.category, 'Insights'),
      date: str(data.date),
      cover: str(data.cover, 'software') as ServiceVisualKey,
      image: str(data.image) || undefined,
      imageAlt: str(data.imageAlt) || undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      status: (str(data.status, 'published') as PostStatus),
      author: str(data.author, 'Zinfity Technologies'),
      body,
      readingMinutes: Math.max(1, Math.round(words / 220)),
    }
  })
  .filter((p) => isPublishable(p.status, import.meta.env.PROD))
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export const postCategories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))]
export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug)
export const postPath = (p: Pick<Post, 'slug'>) => `/blog/${p.slug}`

export const formatDate = (iso: string) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

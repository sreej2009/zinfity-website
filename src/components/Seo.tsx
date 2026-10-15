import { useLocation } from 'react-router'
import { withBase } from '@/lib/base'
import { site } from '@/config/site'

type Props = {
  title: string
  description: string
  /** Absolute or root-relative image path. */
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  publishedTime?: string
}

/**
 * Per-page metadata. React 19 hoists <title>, <meta> and <link> into <head>.
 * Canonical and absolute URLs are only emitted when VITE_SITE_URL is set.
 */
export function Seo({ title, description, image = withBase('/og-image.jpg'), type = 'website', noindex, publishedTime }: Props) {
  const { pathname } = useLocation()
  const full = title === site.name ? `${site.name} — ${site.tagline.replace(/\.$/, '')}` : `${title} — ${site.name}`
  const base = site.url?.replace(/\/+$/, '')
  const url = base ? `${base}${pathname}` : undefined
  const img = image.startsWith('http') ? image : base ? `${base}${image}` : undefined

  return (
    <>
      <title>{full}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex" />}
      {url && <link rel="canonical" href={url} />}
      <meta property="og:site_name" content={site.name} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      {img && <meta property="og:image" content={img} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      {img && <meta name="twitter:image" content={img} />}
    </>
  )
}

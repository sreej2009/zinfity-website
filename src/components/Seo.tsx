import { useLocation } from 'react-router'
import { withBase } from '@/lib/base'
import { site } from '@/config/site'
import { defaultShareImage, fullTitle, type PageMeta } from '@/content/seo'

/**
 * Per-page metadata. React 19 hoists <title>, <meta> and <link> into <head>.
 * Canonical and absolute URLs are only emitted when VITE_SITE_URL is set.
 * The build writes the same tags into each route's HTML file (see vite.config.ts);
 * main.tsx removes those before React renders, so the head never holds duplicates.
 */
export function Seo({ title, description, image = withBase(defaultShareImage), type = 'website', noindex, publishedTime }: PageMeta) {
  const { pathname } = useLocation()
  const full = fullTitle(title)
  const base = site.url?.replace(/\/+$/, '')
  // Non-indexable pages get no canonical, so they never point search engines elsewhere.
  const url = base && !noindex ? `${base}${pathname}` : undefined
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

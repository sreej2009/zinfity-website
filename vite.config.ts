import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { services } from './src/content/services'
import { projects } from './src/content/work'
import { jobs } from './src/content/careers'
import { parseFrontMatter, isPublishable } from './src/content/frontmatter'
import { brand, defaultShareImage, fullTitle, jobMeta, pageMeta, postMeta, projectMeta, serviceMeta, type PageMeta } from './src/content/seo'

type RouteEntry = { path: string; meta: PageMeta }

/** Every public route with its metadata, derived from the same content the app renders. */
function routeEntries(): RouteEntry[] {
  const blogDir = fileURLToPath(new URL('./src/content/blog', import.meta.url))
  const str = (v: unknown) => (typeof v === 'string' ? v : '')
  const posts = readdirSync(blogDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { data } = parseFrontMatter(readFileSync(`${blogDir}/${f}`, 'utf8'))
      const slug = f.replace(/\.md$/, '')
      return { slug, title: str(data.title) || slug, excerpt: str(data.excerpt), date: str(data.date), status: str(data.status) || 'published' }
    })
    .filter((p) => isPublishable(p.status, true))

  return [
    { path: '/', meta: pageMeta.home },
    { path: '/services', meta: pageMeta.services },
    ...services.map((s) => ({ path: `/services/${s.slug}`, meta: serviceMeta(s.id) })),
    { path: '/solutions', meta: pageMeta.solutions },
    ...projects.map((p) => ({ path: `/work/${p.slug}`, meta: projectMeta(p) })),
    { path: '/about', meta: pageMeta.about },
    { path: '/blog', meta: pageMeta.blog },
    ...posts.map((p) => ({ path: `/blog/${p.slug}`, meta: postMeta(p) })),
    { path: '/careers', meta: pageMeta.careers },
    // Sample job listings get a noindex page and stay out of the sitemap.
    ...jobs.map((j) => ({ path: `/careers/${j.slug}`, meta: jobMeta(j) })),
    { path: '/contact', meta: pageMeta.contact },
    { path: '/admin', meta: pageMeta.admin },
  ]
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** The same tags components/Seo.tsx renders, marked so main.tsx can swap them for the app's own. */
function headTags(meta: PageMeta, path: string, siteUrl: string | undefined, basePath: string) {
  const full = esc(fullTitle(meta.title))
  const description = esc(meta.description)
  const url = siteUrl && !meta.noindex ? esc(`${siteUrl}${path}`) : undefined
  const image = meta.image ?? `${basePath.replace(/\/$/, '')}${defaultShareImage}`
  const img = image.startsWith('http') ? esc(image) : siteUrl ? esc(`${siteUrl}${image}`) : undefined
  return [
    `<title>${full}</title>`,
    `<meta name="description" content="${description}" />`,
    meta.noindex && '<meta name="robots" content="noindex" />',
    url && `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="${esc(brand.name)}" />`,
    `<meta property="og:type" content="${meta.type ?? 'website'}" />`,
    `<meta property="og:title" content="${full}" />`,
    `<meta property="og:description" content="${description}" />`,
    url && `<meta property="og:url" content="${url}" />`,
    img && `<meta property="og:image" content="${img}" />`,
    meta.publishedTime && `<meta property="article:published_time" content="${esc(meta.publishedTime)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${full}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    img && `<meta name="twitter:image" content="${img}" />`,
  ]
    .filter((t): t is string => Boolean(t))
    .map((t) => t.replace(/^<(\w+)/, '<$1 data-static-meta'))
    .join('\n    ')
}

const HEAD_MARKER = '<!-- route-meta -->'

/**
 * GitHub Pages serves `/about` from `about.html` with HTTP 200 (and prefers that file over a
 * `services/` folder for `/services`). So every public route gets its own HTML file — the built
 * app plus that route's title, description, canonical and Open Graph tags — instead of being
 * rendered through 404.html with HTTP 404. Unknown and removed URLs still get 404.html (noindex).
 *
 * Also emits robots.txt, and sitemap.xml when the production domain is known (VITE_SITE_URL) —
 * sitemaps and canonicals require absolute URLs, so no domain is guessed.
 */
function routeFiles(siteUrl: string | undefined, basePath: string): Plugin {
  const base = siteUrl?.trim().replace(/\/+$/, '') || undefined
  return {
    name: 'zinfity-route-files',
    apply: 'build',
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', ...(base ? ['', `Sitemap: ${base}/sitemap.xml`] : [])].join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots + '\n' })

      if (!base) {
        this.warn('VITE_SITE_URL is not set — sitemap.xml was not generated and canonical URLs are disabled.')
        return
      }
      const today = new Date().toISOString().slice(0, 10)
      const urls = routeEntries()
        .filter((r) => !r.meta.noindex)
        .map((r) => `  <url><loc>${base}${r.path}</loc><lastmod>${today}</lastmod></url>`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },
    writeBundle(options, bundle) {
      const index = bundle['index.html']
      const template = index?.type === 'asset' ? String(index.source) : ''
      if (!template.includes(HEAD_MARKER)) this.error(`index.html must contain ${HEAD_MARKER} where route metadata is inserted.`)
      const outDir = options.dir!
      const write = (file: string, meta: PageMeta, path: string) => {
        mkdirSync(dirname(join(outDir, file)), { recursive: true })
        writeFileSync(join(outDir, file), template.replace(HEAD_MARKER, headTags(meta, path, base, basePath)))
      }
      for (const r of routeEntries()) write(r.path === '/' ? 'index.html' : `${r.path.slice(1)}.html`, r.meta, r.path)
      write('404.html', pageMeta.notFound, '/404')
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  // Deploy sub-path, e.g. BASE_PATH=/zinfity-website/ for GitHub Pages project sites.
  const basePath = process.env.BASE_PATH || '/'
  return {
    base: basePath,
    plugins: [react(), tailwindcss(), routeFiles(env.VITE_SITE_URL, basePath)],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    // The 3D hero is lazy-loaded, so the dev server would only discover these mid-session
    // and re-optimise (breaking the in-flight request). Pre-bundle them at startup instead.
    // Separate dev cache folder (the default one was left locked by another process on Windows).
    cacheDir: 'node_modules/.vite-zinfity',
    optimizeDeps: { include: ['three', '@react-three/fiber', 'gsap/Flip'] },
    build: {
      target: 'es2020',
      // The WebGL hero (three + R3F) is one large chunk, lazy-loaded
      // on the home page only and only on capable devices.
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            gsap: ['gsap', 'gsap/ScrollTrigger', 'gsap/SplitText', 'gsap/Flip', '@gsap/react'],
            react: ['react', 'react-dom', 'react-router'],
          },
        },
      },
    },
  }
})

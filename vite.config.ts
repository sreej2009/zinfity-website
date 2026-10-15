import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { services } from './src/content/services'
import { projects } from './src/content/work'
import { jobs } from './src/content/careers'
import { parseFrontMatter, isPublishable } from './src/content/frontmatter'

/** Every indexable route, derived from the same content the app renders. */
function routes() {
  const blogDir = fileURLToPath(new URL('./src/content/blog', import.meta.url))
  const posts = readdirSync(blogDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { status } = parseFrontMatter(readFileSync(`${blogDir}/${f}`, 'utf8')).data
      return { slug: f.replace(/\.md$/, ''), status: typeof status === 'string' ? status : undefined }
    })
    .filter((p) => isPublishable(p.status, true))

  return [
    '/',
    '/services',
    ...services.map((s) => `/services/${s.slug}`),
    '/solutions',
    '/work',
    ...projects.map((p) => `/work/${p.slug}`),
    '/about',
    '/blog',
    ...posts.map((p) => `/blog/${p.slug}`),
    '/careers',
    // Sample job listings are noindex and excluded; real openings are listed.
    ...jobs.filter((j) => !j.sample).map((j) => `/careers/${j.slug}`),
    '/contact',
  ]
}

/**
 * Emits robots.txt always, and sitemap.xml when the production domain is known
 * (VITE_SITE_URL) — sitemaps require absolute URLs, so no domain is guessed.
 */
function seoFiles(siteUrl: string | undefined): Plugin {
  return {
    name: 'zinfity-seo-files',
    apply: 'build',
    generateBundle() {
      const base = siteUrl?.replace(/\/+$/, '')
      const robots = ['User-agent: *', 'Allow: /', ...(base ? ['', `Sitemap: ${base}/sitemap.xml`] : [])].join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots + '\n' })

      if (!base) {
        this.warn('VITE_SITE_URL is not set — sitemap.xml was not generated and canonical URLs are disabled.')
        return
      }
      const today = new Date().toISOString().slice(0, 10)
      const urls = routes()
        .map((r) => `  <url><loc>${base}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod></url>`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    // Deploy sub-path, e.g. BASE_PATH=/zinfity-website/ for GitHub Pages project sites.
    base: process.env.BASE_PATH || '/',
    plugins: [react(), tailwindcss(), seoFiles(env.VITE_SITE_URL)],
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

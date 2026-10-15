/**
 * Minimal front-matter parser for the Markdown content in src/content/blog.
 * Supports `key: value` and `key: [a, b, c]`. Shared with the build-time
 * sitemap generator, so it must stay dependency-free.
 */
export type FrontMatter = Record<string, string | string[]>

export function parseFrontMatter(raw: string): { data: FrontMatter; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
  if (!match) return { data: {}, body: raw }
  const data: FrontMatter = {}
  for (const line of match[1].split(/\r?\n/)) {
    const m = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line.trim())
    if (!m) continue
    const value = m[2].trim()
    data[m[1]] = value.startsWith('[') && value.endsWith(']')
      ? value.slice(1, -1).split(',').map((v) => v.trim()).filter(Boolean)
      : value.replace(/^["']|["']$/g, '')
  }
  return { data, body: match[2] }
}

/** Posts with this status are excluded from production builds. */
export const isPublishable = (status: string | undefined, isProd: boolean) => !(isProd && status === 'draft')

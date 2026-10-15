/**
 * Prefixes a root-relative public asset path with the deploy base
 * (e.g. "/zinfity-website/" on GitHub Pages, "/" elsewhere).
 */
export const withBase = (path: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + path

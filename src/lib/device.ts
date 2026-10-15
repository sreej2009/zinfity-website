/**
 * Decides whether the WebGL hero should run. Falls back to the static,
 * image-based hero when WebGL is unavailable, the visitor prefers reduced
 * motion or data saving, or the device looks low-powered.
 */
let cached: boolean | null = null

export function canRender3D(): boolean {
  if (cached !== null) return cached
  cached = detect()
  return cached
}

function detect(): boolean {
  if (typeof window === 'undefined') return false
  if (new URLSearchParams(window.location.search).has('no3d')) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false

  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number }
  if (nav.connection?.saveData) return false
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return false

  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null
    if (!gl) return false
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    // Software rasterisers are too slow for a smooth scene.
    if (/swiftshader|llvmpipe|software/i.test(renderer)) return false
    return true
  } catch {
    return false
  }
}

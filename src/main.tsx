import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@fontsource/instrument-serif/400-italic.css'
import '@/styles/index.css'
import App from './App'
import { ScrollTrigger } from '@/lib/gsap'

// Each route's HTML file carries static metadata for crawlers and link previews.
// The app renders the same tags itself (components/Seo.tsx), so drop the static set first.
document.head.querySelectorAll('[data-static-meta]').forEach((el) => el.remove())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Re-measure scroll-driven layouts once web fonts settle.
document.fonts?.ready.then(() => ScrollTrigger.refresh())

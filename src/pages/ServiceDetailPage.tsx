import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import { useParams } from 'react-router'
import NotFound from './NotFound'

/**
 * Each service has its own page component with a bespoke composition and
 * interactive demonstration (no shared template). Each loads as its own chunk.
 */
const pages: Record<string, LazyExoticComponent<ComponentType>> = {
  'web-development': lazy(() => import('./services/WebDevelopment')),
  'mobile-app-development': lazy(() => import('./services/MobileApps')),
  'custom-software': lazy(() => import('./services/CustomSoftware')),
  'erp-crm': lazy(() => import('./services/ErpCrm')),
  'digital-marketing': lazy(() => import('./services/DigitalMarketing')),
  'ui-ux-design': lazy(() => import('./services/UiUxDesign')),
  ecommerce: lazy(() => import('./services/Ecommerce')),
  'ai-automation': lazy(() => import('./services/AiAutomation')),
  'microsoft-solutions': lazy(() => import('./services/MicrosoftSolutions')),
}

export default function ServiceDetailPage() {
  const { slug = '' } = useParams()
  const Page = pages[slug]
  return Page ? <Page key={slug} /> : <NotFound />
}

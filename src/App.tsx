import { lazy, Suspense } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RouteCurtain } from '@/components/layout/RouteCurtain'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ScrollProvider } from '@/lib/scroll'
import Home from '@/pages/Home'

const ServicesPage = lazy(() => import('@/pages/ServicesPage'))
const ServiceDetailPage = lazy(() => import('@/pages/ServiceDetailPage'))
const SolutionsPage = lazy(() => import('@/pages/SolutionsPage'))
const WorkPage = lazy(() => import('@/pages/WorkPage'))
const ProjectPage = lazy(() => import('@/pages/ProjectPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const BlogPage = lazy(() => import('@/pages/BlogPage'))
const PostPage = lazy(() => import('@/pages/PostPage'))
const CareersPage = lazy(() => import('@/pages/CareersPage'))
const JobPage = lazy(() => import('@/pages/JobPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function PageFallback() {
  return (
    <div className="grid min-h-[100svh] place-items-center" role="status">
      <span className="h-px w-24 animate-pulse bg-accent" />
      <span className="sr-only">Loading page…</span>
    </div>
  )
}

/** Shown if a page fails to load (e.g. a new deployment replaced its files). */
function PageError() {
  return (
    <div className="container-x grid min-h-[80svh] place-items-center pt-[var(--header-h)] text-center" role="alert">
      <div>
        <p className="text-2xl font-medium tracking-[-0.02em]">This page couldn’t load.</p>
        <p className="mt-3 text-muted">Please check your connection and try again.</p>
        <button type="button" onClick={() => window.location.reload()} className="btn btn-primary mt-8">
          <span>Reload page</span>
        </button>
      </div>
    </div>
  )
}

function SiteLayout() {
  const { pathname } = useLocation()
  return (
    <ScrollProvider>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <ErrorBoundary resetKey={pathname} fallback={<PageError />}>
          <Suspense fallback={<PageFallback />}>
            <div key={pathname} className="page-enter">
              <Outlet />
            </div>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <RouteCurtain />
      <div className="grain" aria-hidden="true" />
    </ScrollProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:slug" element={<ServiceDetailPage />} />
          <Route path="solutions" element={<SolutionsPage />} />
          <Route path="work" element={<WorkPage />} />
          <Route path="work/:slug" element={<ProjectPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<PostPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="careers/:slug" element={<JobPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

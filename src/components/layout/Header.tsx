import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { mobileNav, primaryNav } from '@/content/navigation'
import { services, servicePath } from '@/content/services'
import { serviceIcons } from '@/content/serviceIcons'
import { site } from '@/config/site'
import { Logo } from '@/components/ui/Logo'
import { ButtonLink } from '@/components/ui/Button'
import { useScroll } from '@/lib/scroll'
import { gsap, MOTION, useGSAP } from '@/lib/gsap'

/** Services submenu (desktop): a disclosure toggled by its own button. */
function ServicesMenu({ open, onClose, id }: { open: boolean; onClose: () => void; id: string }) {
  return (
    <div
      id={id}
      hidden={!open}
      className="absolute left-1/2 top-[calc(100%+0.75rem)] w-[min(44rem,90vw)] -translate-x-1/2 rounded-2xl border border-line bg-surface p-3 shadow-[0_30px_80px_-20px_rgb(23_23_23/0.25)]"
    >
      <ul className="grid grid-cols-2 gap-1">
        {services.map((s, i) => {
          const Icon = serviceIcons[s.id]
          return (
            <li key={s.id}>
              <Link
                to={servicePath(s)}
                onClick={onClose}
                className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-canvas-alt focus-visible:bg-canvas-alt"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-panel text-accent">
                  <Icon size={16} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[0.92rem] font-medium leading-snug text-fg">{s.title}</span>
                  <span className="eyebrow mt-1 block text-[0.62rem] text-subtle">0{i + 1}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
      <Link
        to="/services"
        onClick={onClose}
        className="mt-2 flex items-center justify-between rounded-xl border-t border-line px-3 pb-1 pt-4 text-[0.88rem] text-fg"
      >
        <span className="link-draw">All services overview</span>
        <ArrowUpRight size={15} aria-hidden="true" />
      </Link>
    </div>
  )
}

export function Header() {
  const { stop, start } = useScroll()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [svcOpen, setSvcOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const svcRef = useRef<HTMLLIElement>(null)
  const navListRef = useRef<HTMLUListElement>(null)
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)

  // Sliding pill behind the active primary nav item.
  useLayoutEffect(() => {
    const measure = () => {
      const list = navListRef.current
      if (!list) return
      const active = Array.from(list.children).find((li) => li.querySelector('[aria-current="page"]') || (li === svcRef.current && pathname.startsWith('/services'))) as
        | HTMLElement
        | undefined
      setIndicator(active ? { left: active.offsetLeft, width: active.offsetWidth } : null)
    }
    measure()
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [pathname])

  // Close menus whenever the route changes.
  useEffect(() => {
    setOpen(false)
    setSvcOpen(false)
    setHidden(false)
  }, [pathname])

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > window.innerHeight * 0.6)
        if (y > last) setSvcOpen(false)
        last = y
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Desktop services submenu: close on outside click / Escape.
  useEffect(() => {
    if (!svcOpen) return
    const onDown = (e: PointerEvent) => !svcRef.current?.contains(e.target as Node) && setSvcOpen(false)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSvcOpen(false)
        svcRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [svcOpen])

  // Mobile menu: lock scroll, trap focus, close on Escape / resize to desktop.
  useEffect(() => {
    if (!open) return
    stop()
    document.documentElement.style.overflow = 'hidden'
    const menu = menuRef.current!
    const focusables = () => Array.from(menu.querySelectorAll<HTMLElement>('a[href], button'))
    focusables()[0]?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
      if (e.key === 'Tab') {
        const list = [toggleRef.current!, ...focusables()]
        const i = list.indexOf(document.activeElement as HTMLElement)
        const next = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : i === list.length - 1 ? 0 : i + 1
        e.preventDefault()
        list[next].focus()
      }
    }
    const mq = window.matchMedia('(min-width: 1024px)')
    const onMq = () => mq.matches && setOpen(false)
    document.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      start()
      document.documentElement.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open, stop, start])

  useGSAP(
    () => {
      if (!open) return
      gsap.matchMedia().add(MOTION, () => {
        gsap.from('[data-menu-item]', { yPercent: 110, duration: 1, stagger: 0.04, delay: 0.1 })
        gsap.from('[data-menu-foot]', { autoAlpha: 0, y: 12, duration: 0.8, delay: 0.4 })
      })
    },
    { dependencies: [open], scope: menuRef },
  )

  const solid = scrolled || svcOpen

  return (
    <>
      <header
        data-site-header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-700 ease-[var(--ease-out-expo)] ${
          hidden && !open && !svcOpen ? '-translate-y-full' : 'translate-y-0'
        } ${solid && !open ? 'border-b border-line bg-canvas/85 backdrop-blur-xl backdrop-saturate-150' : 'border-b border-transparent'}`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-canvas"
        >
          Skip to content
        </a>
        <div
          className={`container-x flex items-center justify-between gap-6 transition-[height] duration-700 ease-[var(--ease-out-expo)] ${
            scrolled ? 'h-16' : 'h-[4.5rem] lg:h-24'
          }`}
        >
          <Link to="/" aria-label={`${site.name} — home`} className="relative z-[2] shrink-0">
            <Logo variant="logoOnLight" priority className="h-8 w-auto lg:h-10" alt={site.name} />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul ref={navListRef} className="relative flex items-center gap-0.5 rounded-full border border-line bg-surface/70 p-1 backdrop-blur-md">
              <span
                aria-hidden="true"
                className={`absolute top-1 h-[calc(100%-0.5rem)] rounded-full bg-canvas-alt transition-[left,width,opacity] duration-700 ease-[var(--ease-out-expo)] ${
                  indicator ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ left: indicator?.left ?? 0, width: indicator?.width ?? 0 }}
              />
              {primaryNav.map((item) =>
                item.hasServicesMenu ? (
                  <li key={item.to} ref={svcRef} className="relative flex items-center">
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `relative rounded-l-full py-2 pl-3.5 pr-1.5 text-[0.86rem] transition-colors duration-500 ${
                          isActive ? 'text-fg' : 'text-muted hover:text-fg'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                    <button
                      type="button"
                      aria-expanded={svcOpen}
                      aria-controls="services-menu"
                      aria-label="Show services menu"
                      onClick={() => setSvcOpen((o) => !o)}
                      className={`relative grid h-[2.15rem] w-7 place-items-center rounded-r-full transition-colors ${
                        pathname.startsWith('/services') ? 'text-fg' : 'text-muted hover:text-fg'
                      }`}
                    >
                      <ChevronDown
                        size={14}
                        aria-hidden="true"
                        className={`transition-transform duration-500 ${svcOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <ServicesMenu id="services-menu" open={svcOpen} onClose={() => setSvcOpen(false)} />
                  </li>
                ) : (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `relative block rounded-full px-3.5 py-2 text-[0.86rem] transition-colors duration-500 ${
                          isActive ? 'text-fg' : 'text-muted hover:text-fg'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink to="/contact" size="sm" className="hidden sm:inline-flex">
              Start a Project
            </ButtonLink>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative z-[2] grid h-11 w-11 place-items-center rounded-full border border-line-strong bg-canvas/60 lg:hidden"
            >
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 h-px w-5 bg-fg transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                    open ? 'top-1.5 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 h-px bg-fg transition-all duration-500 ease-[var(--ease-out-expo)] ${
                    open ? 'top-1.5 w-5 -rotate-45' : 'top-3 w-3'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — a sibling of <header> so `position: fixed` is relative to the viewport. */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        className="fixed inset-0 z-[45] flex h-[100dvh] flex-col bg-canvas pt-24 lg:hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[140%] -translate-x-1/2 rounded-[50%] bg-accent/20 blur-3xl"
        />
        <nav aria-label="Mobile" className="container-x relative flex-1 overflow-y-auto">
          <ul className="border-t border-line">
            {mobileNav.map((item, i) => (
              <li key={item.to} className="overflow-hidden border-b border-line">
                <NavLink
                  data-menu-item
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-baseline justify-between py-3.5 text-[clamp(1.8rem,8vw,2.75rem)] font-medium leading-none tracking-[-0.04em] ${
                      isActive ? 'text-fg' : 'text-fg/70'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-3">
                        {item.label}
                        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />}
                      </span>
                      <span className="eyebrow text-subtle">{String(i + 1).padStart(2, '0')}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div data-menu-foot className="container-x relative flex flex-col gap-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
          <ButtonLink to="/contact" onClick={() => setOpen(false)} className="w-full">
            Start a Project
          </ButtonLink>
          <p className="text-sm text-muted">{site.tagline}</p>
        </div>
      </div>
    </>
  )
}

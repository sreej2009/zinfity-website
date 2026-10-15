export type NavItem = { to: string; label: string; hasServicesMenu?: boolean }

/** Primary navigation. The logo links home; "Home" is included in the mobile menu. */
export const primaryNav: NavItem[] = [
  { to: '/services', label: 'Services', hasServicesMenu: true },
  { to: '/solutions', label: 'Solutions' },
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
]

export const mobileNav: NavItem[] = [{ to: '/', label: 'Home' }, ...primaryNav]

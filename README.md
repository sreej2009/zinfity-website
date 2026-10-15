# Zinfity Technologies — Website

Multi-page corporate website for **Zinfity Technologies** — *Technology That Works Together.*

React 19 · Vite 6 · TypeScript · Tailwind CSS 4 · React Router 7 · Three.js + React Three Fiber · GSAP (ScrollTrigger, SplitText, Flip) · Lenis · marked · Lucide

Content ownership (which route owns which content) is documented in [`docs/content-ownership.md`](docs/content-ownership.md).

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build (with client-side route fallback)
```

Copy `.env.example` to `.env` and fill in what applies. **All `VITE_*` values end up in the
public JavaScript bundle** — only put public values there (URLs, public form IDs, contact
details). Never put API keys, passwords or SMTP credentials in them.

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Production domain. Enables canonical URLs, absolute Open Graph images, BreadcrumbList URLs and `sitemap.xml`. |
| `VITE_CONTACT_ENDPOINT` | Endpoint accepting a JSON `POST` of project enquiries. |
| `VITE_CAREERS_ENDPOINT` | Endpoint accepting `multipart/form-data` job applications (includes the CV file). |
| `VITE_CAREERS_EMAIL` | Fallback address for applications when no careers endpoint is set. |
| `VITE_CONTACT_EMAIL`, `VITE_CONTACT_PHONE`, `VITE_CONTACT_LOCATION` | Verified contact details, shown when set. `VITE_CONTACT_EMAIL` is also the enquiry fallback. |
| `VITE_SOCIAL_*` | LinkedIn / Instagram / X / GitHub profile URLs, shown in the footer when set. |

Empty values are never rendered, so no unverified details ship.

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/services`, `/services/:slug` | Services overview + 8 detail pages |
| `/solutions` | Solutions |
| `/work`, `/work/:slug` | Portfolio (category filters) + case-study pages |
| `/about` | About (`/about#approach` jumps to the process) |
| `/blog`, `/blog/:slug` | Blog (featured, search, categories) + articles |
| `/careers`, `/careers/:slug` | Careers + job pages |
| `/contact` | Contact & project enquiry |
| `*` | 404 (rendered with `noindex`) |

### Hosting / direct URL access

The site is a single-page app, so the host must serve `index.html` for unknown paths.
Fallback config for the common hosts is included:

- **Netlify / Cloudflare Pages** — `public/_redirects`
- **Vercel** — `vercel.json`
- **Apache (cPanel, Hostinger, etc.)** — `public/.htaccess`
- **Nginx** — add `try_files $uri $uri/ /index.html;` to the `location /` block.

Note: with an SPA fallback, unknown URLs return HTTP 200 and show the in-app 404 page (marked `noindex`).

## Forms

Both forms validate in the browser, keep entered data on failure, and **only report success
after the endpoint returns a 2xx response**.

**Project enquiries** (`/contact`): `VITE_CONTACT_ENDPOINT` → JSON
`{ name, email, company, service, budget, message, context, source }`.
Without an endpoint but with `VITE_CONTACT_EMAIL`, the visitor's email app opens pre-filled
(they must press send). With neither, the form says enquiries are not connected yet.

**Applications** (`/careers`, `/careers/:slug`): `VITE_CAREERS_ENDPOINT` → multipart fields
`role, name, email, phone, location, link, message, cv (file), source`. Falls back to
`VITE_CAREERS_EMAIL` (or the contact email), asking the applicant to attach their CV.

Services such as Formspree, Basin or Getform work, as does a small serverless function that
forwards submissions to your inbox or CRM. Keep provider secrets in that service, not in `.env`.

**Pre-filling the enquiry form** from anywhere: link to `contactHref({ service, project })`
from `src/lib/enquiry.ts`, e.g. `/contact?service=ERP%20%26%20CRM%20Solutions&project=…#enquiry`.

## Content

All copy lives in `src/content/`.

| File | Contents |
| --- | --- |
| `services.ts` | Service overview data and URL slugs |
| `service-details.ts` | Detail-page content per service (hero, problems, benefits, signature block, tech, FAQ…) |
| `solutions.ts` | Solutions diagram and disciplines |
| `work.ts` | Portfolio / case studies |
| `process.ts` | The five-stage approach |
| `careers.ts` | Job listings |
| `enquiry.ts` | Budget ranges (INR by default) |
| `blog/*.md` | Blog articles |

### Publishing blog articles

1. Create `src/content/blog/<url-slug>.md`. The file name becomes `/blog/<url-slug>`.
2. Add front-matter, then write the article in Markdown:

```md
---
title: Your article title
excerpt: One or two sentences used on cards and as the meta description.
category: Websites            # becomes a filter on /blog
date: 2026-11-02              # YYYY-MM-DD; newest article is featured
cover: web                    # web | mobile | software | erp | marketing | uiux | commerce | ai
image: /blog/my-cover.webp    # optional real image in public/blog/ (replaces the cover artwork)
imageAlt: Description of the image
tags: [website, strategy]
status: published             # published | sample | draft
---
```

- `published` — normal article.
- `sample` — shown with a "Sample article" label and notice. **The five included articles are samples**;
  edit them and change `status` to `published`, or delete them.
- `draft` — visible in `npm run dev`, excluded from production builds and the sitemap.

To remove an article, delete its `.md` file. Reading time is calculated automatically.

### Adding real job openings

Every listing in `careers.ts` is currently a **sample** (`sample: true`). Samples appear in a separate
"Example role listings" section, their pages carry a sample banner, are `noindex`, excluded from the
sitemap, and their application form is disabled. To publish a real vacancy, add an entry with
`sample: false` and fill in **only verified** details — `employmentType` and `location` are hidden
or shown as "To be confirmed" when omitted. Delete the samples when real roles exist; the page shows a
clear "no open positions" state when none are listed.

### Publishing a real case study

Entries in `work.ts` are **concept studies** (labelled as such everywhere). For real client work:
add images to `public/work/<slug>/`, set `status: 'case-study'`, `image`, `imageAlt`, optional
`gallery`, and add `results` **only** if the client has verified and approved them.

## 3D hero (home page)

- `src/visuals/three/ZMark3D.tsx` — the Z mark as a real 3D object. Its silhouette is traced from the
  supplied `z-mark.png` alpha channel (`npm run trace-mark` → `src/visuals/three/z-outline.json`,
  ~99% pixel overlap); the front face is textured with the original logo render, unlit and not
  tone-mapped, so brand colours are preserved exactly. Sides/bevel are brushed bronze.
- `src/visuals/three/HeroScene.tsx` — lighting, studio environment, floor reflection, portal frame,
  fragments and the scroll-driven camera (three "shots"). Lazy-loaded as its own chunk.
- `src/sections/home/HomeHero.tsx` — sticky scroll stage, layered typography, entrance sequence and
  pointer input; it shows a static image hero first and keeps it when 3D is not used.

**Safeguards**: `frameloop="demand"` (the scene only renders while something is moving — zero draw calls
when idle); WebGL is skipped for reduced motion, Save-Data, < 4 CPU cores or < 4 GB device memory,
software renderers, missing WebGL, or `?no3d` in the URL (`src/lib/device.ts`). The canvas unmounts
when leaving the home page.

## Design system

`src/styles/index.css` defines semantic tokens (`canvas`, `canvas-alt`, `surface`, `fg`, `muted`,
`subtle`, `line`, `accent`, `accent-ink`, `panel`). The light theme is the default; wrap any element in
`.theme-dark` to re-map the same tokens for dark showcase panels (service illustrations, project
artwork, the hero stage, CTA bands, footer). `accent` (#C79B69) is decorative; `accent-ink` (#8C5E34)
is the accessible accent for text on light backgrounds.

## Brand assets

Originals stay in the project root. `npm run assets` (Python + Pillow) regenerates `public/brand/*`
(WebP + PNG), favicons and `og-image.jpg`. Only transparent padding is cropped — logo pixels are never
recoloured or reshaped.

| File | Use |
| --- | --- |
| `logo-on-light` | Header (from `Zinfity_Logo_ColorOnLight.png`) |
| `lockup-on-dark` | Footer, About |
| `logo-on-dark`, `lockup-on-light` | Available |
| `z-mark` | Hero stage, solutions hub, CTA bands, favicons |

## Structure

```
src/
  App.tsx                 routes + shared layout (lazy-loaded pages)
  pages/                  one component per route
    services/             one bespoke page per service (WebDevelopment, MobileApps, …)
  sections/
    home/                 HomeHero (3D), ServiceDiscovery, FeaturedProject, Philosophy, HomeClosing
    SystemsMap.tsx        /solutions architecture map
    Approach.tsx          five-stage timeline (/about)
  components/
    layout/               Header (services menu, sliding indicator, mobile menu), Footer, RouteCurtain
    ui/                   Logo, Button, Breadcrumbs, Magnetic
    blocks/               ServiceStage, PostCard (meta/thumb), JobRow, ArrowLink
    demos/                interactive service demonstrations (responsive, phone, architecture, ERP, …)
    service/kit.tsx       small primitives shared by the service pages
    forms/                Field, EnquiryForm, ApplicationForm
    Seo.tsx               per-page title, description, canonical, Open Graph
  content/                all editable content (see above)
  lib/                    gsap setup, Lenis scroll manager, form delivery, enquiry links
  hooks/                  useMediaQuery, useReveal
  visuals/                ServiceVisual (SVG line art), ProjectArt (concept artwork), three/ (WebGL hero)
  styles/index.css        tokens, typography, components
scripts/build-assets.py   brand asset exports
scripts/trace-mark.py     Z silhouette for the 3D mark
docs/content-ownership.md
vite.config.ts            also generates robots.txt + sitemap.xml at build time
```

## Motion & accessibility

- Animations are registered under `prefers-reduced-motion: no-preference`. With reduced motion,
  Lenis and WebGL are disabled, the home hero is a single static screen and content renders in its final state.
- Route changes use an ivory curtain transition (skipped with reduced motion); browser back/forward
  restores the previous scroll position, and direct links to `#anchors` wait for lazily loaded pages.
- Skip link, visible focus rings, keyboard-operable services menu and mobile menu (Escape closes,
  focus returns), labelled form controls with inline errors, focus moved to the first invalid field.

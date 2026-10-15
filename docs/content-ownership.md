# Content ownership matrix

Every substantive piece of content has exactly one owning route. Other routes may show a
short teaser (one line + link) but never the full section, its detailed text or its layout.

| Content | Owner | Allowed elsewhere |
| --- | --- | --- |
| Brand headline, 3D Z hero, one-line philosophy | `/` | — |
| Service directory (all 8 summaries, deliverables) | `/services` | Home: names + one-line teaser in the discovery control |
| Engagement models (how to work with us) | `/services` | — |
| Service detail (problems, benefits, capabilities, demo, tech, FAQ) | `/services/:slug` | — |
| System architecture map, solution scenarios, four disciplines | `/solutions` | — |
| Portfolio canvases, category filters | `/work` | Home: one curated project |
| Case-study narrative (problem, approach, solution, deliverables, stack) | `/work/:slug` | Service pages: link to the related study |
| Company position, philosophy, principles, five-step method, working model, commitments | `/about` | — |
| Articles, categories, search | `/blog`, `/blog/:slug` | — |
| Vacancy status, culture, roles, applications | `/careers`, `/careers/:slug` | — |
| Enquiry form, verified contact details, next steps | `/contact` | Pre-fill links from any CTA |

## Removed duplicates (October 2026 upgrade)

- Home: full services index, full solutions diagram, pinned four-project reel, five-step process,
  About statement, three-article blog listing, careers banner, generic CTA band.
- Services directory: process preview (owned by About).
- About: capabilities list of all services (owned by Services).
- Contact: "Explore first" service chips (owned by Services).
- Footer: large tagline band + CTA button that repeated each page's own closing CTA.
- Shared `PageHero` / `CtaBand` on every route: replaced with route-specific openings and closings.

## Page directions

| Route | Composition | Motion |
| --- | --- | --- |
| `/` | Full-bleed 3D stage, layered type, scroll-driven camera | Cinematic first load, scroll scenes |
| `/services` | Numbered directory rail + sticky dark illustration stage | Line-drawn illustrations, rail progress |
| `/services/*` | One bespoke interactive demonstration per service | Demo-specific (reflow, screen transitions, data flow…) |
| `/solutions` | Layered architecture map as the page itself | Path highlighting through layers |
| `/work` | Edge-to-edge project canvases, filter bar | Clip reveals, cursor-follow labels |
| `/work/:slug` | Sticky dark canvas that zooms per chapter | Scroll-driven focus transitions |
| `/about` | Typographic manifesto, chapters I–IV | Word-level reveals, rolling stage numbers |
| `/blog`, `/blog/:slug` | Publication masthead, reading column | Minimal (reading first) |
| `/careers`, `/careers/:slug` | Status-first recruitment interface | Minimal |
| `/contact` | Calm single-focus form | Minimal |

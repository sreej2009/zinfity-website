import { clients, type Client } from '@/content/clients'
import { LogoMarquee } from '@/components/blocks/LogoMarquee'

function ClientLogo({ c }: { c: Client }) {
  const img = (
    <img
      src={c.logo}
      alt={c.name}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`w-auto object-contain opacity-70 mix-blend-multiply grayscale transition-[filter,opacity,transform] duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0 ${c.square ? 'h-24 lg:h-32' : 'h-12 max-w-[12rem] lg:h-16 lg:max-w-[14rem]'}`}
    />
  )
  return c.url ? (
    <a href={c.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
      {img}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    img
  )
}

/**
 * Home: client logo wall. Renders nothing until clients are listed in
 * src/content/clients.ts. Up to 12 logos: a framed wall. More: a gentle marquee.
 */
export function OurClients() {
  if (clients.length === 0) return null

  return (
    <section aria-labelledby="clients-title" className="border-y border-line py-20 lg:py-28">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-3 text-muted">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              Our clients
            </p>
            <h2 id="clients-title" className="mt-6 text-[clamp(2rem,4vw,3.8rem)] font-medium leading-[1] tracking-[-0.045em]">
              Teams we <span className="serif-accent metal-text pr-[0.04em]">build</span> with.
            </h2>
          </div>
          <p className="text-lede text-muted lg:col-span-4 lg:col-start-9 lg:pb-1">
            Businesses that trust us with their websites, platforms and everyday systems.
          </p>
        </div>
      </div>

      <div className="mt-12 lg:mt-16">
        {clients.length > 12 ? (
          <LogoMarquee label="Clients" duration={55}>
            {clients.map((c) => (
              <li key={c.name} className="group flex shrink-0 items-center px-10 sm:px-14">
                <ClientLogo c={c} />
              </li>
            ))}
          </LogoMarquee>
        ) : (
          <div className="container-x">
            <ul
              aria-label="Clients"
              className={`grid gap-px overflow-hidden rounded-2xl border border-line bg-line ${clients.length <= 3 ? 'sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'}`}
            >
              {clients.map((c) => (
                <li
                  key={c.name}
                  className="group relative flex h-32 items-center justify-center bg-canvas px-8 transition-colors duration-700 hover:bg-surface sm:h-40 lg:h-48"
                >
                  {/* Warm wash and corner accent on hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_100%,rgb(199_155_105/0.14),transparent)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-accent-ink transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:w-full"
                  />
                  <span className="relative">
                    <ClientLogo c={c} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

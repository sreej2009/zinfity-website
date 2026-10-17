import { Seo } from '@/components/Seo'
import { pageMeta } from '@/content/seo'
import { HomeHero } from '@/sections/home/HomeHero'
import { OurTechnologies } from '@/sections/home/OurTechnologies'
import { ServiceDiscovery } from '@/sections/home/ServiceDiscovery'
import { FeaturedProject } from '@/sections/home/FeaturedProject'
import { OurClients } from '@/sections/home/OurClients'
import { Philosophy } from '@/sections/home/Philosophy'
import { HomeClosing } from '@/sections/home/HomeClosing'
import { HomeFaq } from '@/sections/home/HomeFaq'

/**
 * Home is a brand impression, not a summary of the site:
 * 3D hero → service discovery → one curated project → one philosophy line → FAQ → closing.
 * Full content lives on its owning routes (see docs/content-ownership.md).
 */
export default function Home() {
  return (
    <>
      <Seo {...pageMeta.home} />
      <HomeHero />
      <OurTechnologies />
      <ServiceDiscovery />
      <FeaturedProject />
      <OurClients />
      <Philosophy />
      <HomeFaq />
      <HomeClosing />
    </>
  )
}

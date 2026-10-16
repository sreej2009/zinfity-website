import { Seo } from '@/components/Seo'
import { site } from '@/config/site'
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
      <Seo
        title={site.name}
        description="Zinfity Technologies designs and builds digital experiences, intelligent software and connected systems that help businesses move from ideas to impact."
      />
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

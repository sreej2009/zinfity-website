import { withBase } from '@/lib/base'

/**
 * Technologies shown on the home page ("Our technologies").
 *
 * Logos are official brand marks stored in /public/tech/, unmodified except
 * that the Dynamics 365 and Shopify files are cropped (viewBox only) to their
 * icon so they fit the hexagon tiles.
 * Sources: devicon v2.16.0 / v2.17.0 (open-source and cloud tools) and
 * Wikimedia Commons (Power BI, Power Apps, Power Automate, Dynamics 365, Shopify).
 * Brand names and logos belong to their respective owners.
 *
 * Note: Apple does not publish a separate SwiftUI logo, so SwiftUI uses the
 * official Swift mark.
 *
 * Keep this list to tools the company genuinely delivers with.
 */
export type Technology = { name: string; logo: string }
export type TechCategory = { id: string; label: string; items: Technology[] }

const t = (name: string, file: string): Technology => ({ name, logo: withBase(`/tech/${file}.svg`) })

export const techCategories: TechCategory[] = [
  {
    id: 'languages',
    label: 'Languages',
    items: [t('JavaScript', 'javascript'), t('TypeScript', 'typescript'), t('PHP', 'hypertext-preprocessor'), t('Java', 'java'), t('Python', 'python'), t('C++', 'cplusplus'), t('Swift', 'swift')],
  },
  { id: 'frontend', label: 'Frontend', items: [t('React', 'react'), t('Vue.js', 'vuejs'), t('Next.js', 'nextjs'), t('HTML5', 'html5'), t('CSS3', 'css3')] },
  { id: 'backend', label: 'Backend', items: [t('Node.js', 'nodejs'), t('Express.js', 'express'), t('Laravel', 'laravel')] },
  { id: 'mobile', label: 'Mobile', items: [t('React Native', 'react-native'), t('Expo', 'expo'), t('Flutter', 'flutter'), t('SwiftUI', 'swift')] },
  { id: 'databases', label: 'Databases', items: [t('MySQL', 'mysql'), t('PostgreSQL', 'postgresql'), t('MongoDB', 'mongodb'), t('SQL Server', 'sql-server')] },
  {
    id: 'microsoft',
    label: 'Microsoft',
    items: [t('Power BI', 'power-bi'), t('Power Apps', 'power-apps'), t('Power Automate', 'power-automate'), t('Dynamics 365', 'dynamics-365')],
  },
  { id: 'cloud', label: 'Cloud & deployment', items: [t('AWS', 'aws'), t('Microsoft Azure', 'azure'), t('Vercel', 'vercel'), t('Docker', 'docker'), t('Git', 'git')] },
  { id: 'commerce', label: 'E-commerce & CMS', items: [t('Shopify', 'shopify'), t('WordPress', 'wordpress')] },
]

/**
 * Technologies shown as floating panels in the 3D scene when "All" is selected.
 * (Category filters show that category's own technologies instead.)
 */
export const featuredTechnologies = [
  'React',
  'JavaScript',
  'Node.js',
  'PHP',
  'Laravel',
  'Flutter',
  'Swift',
  'MySQL',
  'Power BI',
  'AWS',
  'Microsoft Azure',
  'Power Automate',
]

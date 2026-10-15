export type ProcessStep = {
  index: string
  title: string
  summary: string
  activities: string[]
}

export const processSteps: ProcessStep[] = [
  {
    index: '01',
    title: 'Discover',
    summary:
      'We learn how your business works today — the people, the processes, the systems and the goals behind the request.',
    activities: ['Stakeholder conversations', 'Process & systems audit', 'Goals and constraints'],
  },
  {
    index: '02',
    title: 'Define',
    summary:
      'We turn what we learned into a clear scope: priorities, architecture, milestones and what success should look like.',
    activities: ['Scope & priorities', 'Technical approach', 'Roadmap & estimates'],
  },
  {
    index: '03',
    title: 'Design',
    summary:
      'Flows, interfaces and system design take shape together, validated early with prototypes rather than assumptions.',
    activities: ['User flows', 'Interface design', 'Interactive prototypes'],
  },
  {
    index: '04',
    title: 'Develop',
    summary:
      'We build in short, visible iterations with clean, tested, documented code — so progress is always something you can see.',
    activities: ['Iterative delivery', 'Quality assurance', 'Integrations & data'],
  },
  {
    index: '05',
    title: 'Launch & Evolve',
    summary:
      'A careful release, then continuous improvement: monitoring, support and new capabilities as your business grows.',
    activities: ['Release & handover', 'Monitoring & support', 'Continuous improvement'],
  },
]

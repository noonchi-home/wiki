import { defineConfig } from 'vitepress'

const repository = process.env.GITHUB_REPOSITORY?.split('/').at(-1)
const base = process.env.GITHUB_ACTIONS === 'true' && repository ? '/' + repository + '/' : '/'

const milestones = [
  { text: 'A. Proposal and Requirements', link: '/submissions/a' },
  { text: 'B. Specification', link: '/submissions/b' },
  { text: 'C. Design', link: '/submissions/c' },
  { text: 'D. Implementation and Integration', link: '/submissions/d' },
  { text: 'E. Final Paper and User Guide', link: '/submissions/e' },
]

export default defineConfig({
  lang: 'en',
  title: 'NOONCHI',
  description: 'A smart-home agent that assists residents during everyday activities.',
  base,
  head: [['link', { rel: 'icon', type: 'image/png', href: base + 'brand/mascot.png' }]],
  themeConfig: {
    logo: '/brand/header-icon.png',
    nav: [
      { text: 'Overview', link: '/' },
      { text: 'Architecture', link: '/guide/system' },
      { text: 'Case Studies', link: '/guide/scenarios' },
      { text: 'Docs', link: '/submissions/a', activeMatch: '^/submissions/' },
    ],
    sidebar: [
      {
        text: 'Project',
        items: [
          { text: 'Project Overview', link: '/' },
          { text: 'System Architecture', link: '/guide/system' },
          { text: 'Technical Case Studies', link: '/guide/scenarios' },
          { text: 'Run Guide', link: '/guide/run' },
          { text: 'Development Notes', link: '/guide/development-notes' },
        ],
      },
      { text: 'Docs', items: milestones },
    ],
    search: { provider: 'local' },
    outline: { level: [2, 3], label: 'On this page' },
  },
})

import { defineConfig } from 'vitepress'

const repository = process.env.GITHUB_REPOSITORY?.split('/').at(-1)
const base = process.env.GITHUB_ACTIONS === 'true' && repository ? '/' + repository + '/' : '/'

const docs = [{ text: 'Project Paper', link: '/submissions/project-paper' }]

export default defineConfig({
  lang: 'ko-KR',
  title: 'NOONCHI',
  description: '거주자의 일상을 관찰하고 필요한 순간에 먼저 돕는 눈치 프로젝트.',
  locales: {
    submissions: {
      lang: 'en',
      label: 'Docs',
      description: 'A smart-home agent that assists residents during everyday activities.',
      themeConfig: { outline: { level: [2, 3], label: 'On this page' } },
    },
  },
  base,
  head: [['link', { rel: 'icon', type: 'image/png', href: base + 'brand/mascot.png' }]],
  themeConfig: {
    i18nRouting: false,
    logo: '/brand/header-icon.png',
    nav: [
      { text: '프로젝트 개요', link: '/' },
      { text: '시스템 구조', link: '/guide/system' },
      { text: '시연과 실험', link: '/guide/scenarios' },
      { text: 'Docs', link: '/submissions/project-paper', activeMatch: '^/submissions/' },
    ],
    sidebar: [
      {
        text: '프로젝트',
        items: [
          { text: '프로젝트 개요', link: '/' },
          { text: '시스템 구조', link: '/guide/system' },
          { text: '시연과 실험', link: '/guide/scenarios' },
          { text: '실행 안내', link: '/guide/run' },
          { text: '개발 노트', link: '/guide/development-notes' },
        ],
      },
      { text: 'Docs', items: docs },
    ],
    search: { provider: 'local' },
    outline: { level: [2, 3], label: '이 페이지에서' },
  },
})

import { defineConfig } from 'vitepress'

const repository = process.env.GITHUB_REPOSITORY?.split('/').at(-1)
const base = process.env.GITHUB_ACTIONS === 'true' && repository ? '/' + repository + '/' : '/'

const docs = [{ text: 'Project Paper', link: '/submissions/project-paper' }]

export default defineConfig({
  lang: 'ko-KR',
  title: 'NOONCHI',
  description: '눈치(NOONCHI)는 LG의 홈 로봇 클로이드(CLOiD)를 위한 의사결정 시스템 프로토타입이다.',
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
      { text: '개요', link: '/' },
      { text: '작동 방식', link: '/guide/how-it-works' },
      { text: '결과', link: '/guide/results' },
      { text: 'Docs', link: '/submissions/project-paper', activeMatch: '^/submissions/' },
    ],
    sidebar: [
      {
        text: '프로젝트',
        items: [
          { text: '개요', link: '/' },
          { text: 'I. 배경', link: '/guide/background' },
          { text: 'II. 데이터', link: '/guide/data' },
          { text: 'III. 작동 방식', link: '/guide/how-it-works' },
          { text: 'IV. 결과', link: '/guide/results' },
          { text: 'V. 기존 연구와 비교', link: '/guide/prior-work' },
          { text: 'VI. 한계와 다음 단계', link: '/guide/limitations' },
          { text: '팀', link: '/guide/team' },
          { text: '저장소 구조', link: '/guide/repository' },
          { text: '출처', link: '/guide/sources' },
          { text: '라이선스', link: '/guide/license' },
          { text: '시작하기', link: '/guide/getting-started' },
        ],
      },
      { text: 'Docs', items: docs },
    ],
    search: { provider: 'local' },
    outline: { level: [2, 3], label: '이 페이지에서' },
  },
})

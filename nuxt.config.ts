// https://nuxt.com/docs/api/configuration/nuxt-config

// GitHub Pages 프로젝트 사이트는 /<repo>/ 하위에 서빙된다.
// 배포 워크플로에서만 NUXT_APP_BASE_URL을 넘기고, 로컬 dev는 '/'로 둔다.
const baseURL = process.env.NUXT_APP_BASE_URL || '/'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],

  // 클라이언트 전용 SPA (타이머·인트로가 있어 SSR 하이드레이션 불필요)
  ssr: false,

  css: ['~/assets/css/main.css'],

  app: {
    baseURL,

    head: {
      title: '2026 하계 워크샵',
      meta: [
        // viewport-fit=cover: 노치 기기에서 env(safe-area-inset-*) 적용을 위해 필요
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { charset: 'utf-8' },
      ],
      // 브라우저 기본 동작은 도메인 루트의 /favicon.ico를 찾으므로
      // 서브경로 배포에서는 명시적으로 링크해야 한다
      link: [
        { rel: 'icon', type: 'image/x-icon', href: `${baseURL}favicon.ico` },
      ],
    },
  },
})

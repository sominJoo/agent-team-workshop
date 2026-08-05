// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],

  // 클라이언트 전용 SPA (타이머·인트로가 있어 SSR 하이드레이션 불필요)
  ssr: false,

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: '2026 하계 워크샵',
      meta: [
        // viewport-fit=cover: 노치 기기에서 env(safe-area-inset-*) 적용을 위해 필요
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { charset: 'utf-8' },
      ],
    },
  },
})

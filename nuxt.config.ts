// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: [
    '@/assets/styles/main.scss',
    'primevue/resources/themes/lara-light-purple/theme.css',
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
    'primeflex/primeflex.css',
  ],
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-lodash',
    'nuxt-viewport',
  ],
  build: {
    transpile: ['primevue']
  },
  watch: ['.env', '~/config/*'],
  runtimeConfig: {
    public: {
      selfUrl: process.env.NUXT_SELF_URL,
      apiUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
    },
  },
  nitro: {
    routeRules: {
      '/**/*.png': { headers: { 'Content-Type': 'image/png' } },
      '/**/*.jpeg': { headers: { 'Content-Type': 'image/jpeg' } },
      '/**/*.jpg': { headers: { 'Content-Type': 'image/jpeg' } },
      '/**/*.webp': { headers: { 'Content-Type': 'image/webp' } },
    },
  },
  viewport: {
    breakpoints: {
      desktop: 1024,
      desktopMedium: 1280,
      desktopWide: 1600,
      tablet: 768,
      mobileWide: 480,
      mobileMedium: 375,
      mobile: 320,
    },
    defaultBreakpoints: {
      desktop: 'desktop',
      mobile: 'mobile',
      tablet: 'tablet',
    },
    fallbackBreakpoint: 'desktop',
  },
  pages: true,
})

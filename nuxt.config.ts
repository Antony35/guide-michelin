export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
  ],

  googleFonts: {
    families: {
      'Cormorant Garamond': [300, 400, 600],
      'Didact Gothic': [400],
    },
    display: 'swap',
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/fav-icon.png' }],
    },
  },

  css: ['~/assets/css/main.css'],
})

export default defineNuxtConfig({
  extends: [
    'docus'
  ],

  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },

  ui: {
    theme: {
      colors: [
        'manta-primary', 'manta-secondary', 'manta-accent',
        'primary',
        'secondary',
        'accent',
        'info',
        'success',
        'warning',
        'error'
      ]
    }
  },

  compatibilityDate: "2026-03-12",

  modules: [
    "@nuxt/icon",
    '@nuxt/ui',
    '@nuxtjs/mdc'
  ],

  mdc: {
    highlight: {
      theme: {
        default: 'material-theme-lighter',
        dark: 'material-theme-palenight'
      },
      langs: ['bash', 'shell', 'typescript', 'javascript', 'vue', 'json', 'yaml', 'markdown', 'mermaid']
    }
  },

  components: true,

  vite: {
    optimizeDeps: {
      include: ['mermaid']
    }
  }
})
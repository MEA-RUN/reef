export default defineNuxtConfig({
  extends: [
    'docus'
  ],

  devtools: {
    enabled: false,

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

  // tailwindcss: {
  //   config: {
  //     theme: {
  //       extend: {
  //         colors: {
  //           'manta-primary': {
  //             50: '#f0fdfc',
  //             100: '#ccfbf6',
  //             200: '#99f6ed',
  //             300: '#5eeadf',
  //             400: '#2dd4c7',
  //             500: '#1fc1b6',
  //             600: '#149b93',
  //             700: '#147b76',
  //             800: '#15625f',
  //             900: '#16514f',
  //             950: '#063230',
  //           },
  //           'manta-secondary': {
  //             50: '#f0f4fe',
  //             100: '#dde6fc',
  //             200: '#c2d4fa',
  //             300: '#96b1e3',
  //             400: '#7a96d9',
  //             500: '#5a76c9',
  //             600: '#455bbe',
  //             700: '#3a4aae',
  //             800: '#34408d',
  //             900: '#2f3970',
  //             950: '#202545',
  //           },
  //           'manta-accent': {
  //             50: '#f8fafc',
  //             100: '#f1f5f9',
  //             200: '#e2e8f0',
  //             300: '#cbd5e1',
  //             400: '#94a3b8',
  //             500: '#64748b',
  //             600: '#475569',
  //             700: '#334155',
  //             800: '#1e293b',
  //             900: '#0f172a',
  //             950: '#0d2045',
  //           }
  //         }
  //       }
  //     }
  //   }
  // },

  compatibilityDate: "2025-12-29",
  modules: [
    "@nuxt/icon",
    '@nuxt/ui',
    '@nuxtjs/mdc'
  ]
})
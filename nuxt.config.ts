import { defineNuxtConfig } from "nuxt/config";
import { configureI18n } from './config/i18n'

const modules = [
  "@nuxt/icon",
  '@nuxt/ui',
  '@nuxtjs/mdc',
  '@nuxt/fonts',
]

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    'docus'
  ],

  css: [
    '~/assets/css/reef.css',
  ],

  // devtools: {
  //   enabled: true,

  //   timeline: {
  //     enabled: true
  //   }
  // },

  ui: {
    theme: {
      colors: [
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

  modules,

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

  hooks: {
    'modules:before': () => configureI18n(modules),

    'app:templates'(app) {
      const docusCss = app.templates.find(template => template.filename === 'docus.css')

      if (docusCss)
        docusCss.write = true
    },
  },

  robots: {
    robotsTxt: false,
  },

  vite: {
    plugins: [
      {
        name: 'docus-og-raster-logo',
        enforce: 'pre',
        transform(code, id) {
          if (!id.includes('/docus/app/components/OgImage/Landing.takumi.vue'))
            return

          const transformed = code.replace(
            "if (!path) return ''",
            "if (!path || !path.endsWith('.svg')) return ''",
          )

          if (transformed !== code)
            return { code: transformed, map: null }
        },
      },
    ],
    optimizeDeps: {
      include: [
        'mermaid',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@vueuse/core',
      ]
    }
  }
})

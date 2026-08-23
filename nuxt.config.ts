import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    'docus'
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

  modules: ["@nuxt/icon", '@nuxt/ui', '@nuxtjs/mdc', '@nuxt/fonts'],

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
      ]
    }
  }
})

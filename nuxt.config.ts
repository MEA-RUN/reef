export default defineNuxtConfig({
  extends: ['docus'],

  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },

  compatibilityDate: "2025-12-29",
  modules: ["@nuxt/icon"]
})
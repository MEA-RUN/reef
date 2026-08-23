export default defineNuxtRouteMiddleware((to) => {
  to.meta.footer = false
})

export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.layout === 'docs') {
    setPageLayout('reef-docs')
  }
})

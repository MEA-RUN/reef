import { defineNuxtRouteMiddleware, setPageLayout } from '#imports';

export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.layout === 'docs')
    setPageLayout('reef-docs');
});

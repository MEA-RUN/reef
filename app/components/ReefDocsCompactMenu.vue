<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[] | null | undefined>>('navigation', ref([]))
const fallback = useTemplateRef<HTMLElement>('fallback')
const target = shallowRef<HTMLElement>()
const open = ref(false)
const route = useRoute()
const nuxtApp = useNuxtApp()

function updateTarget() {
  target.value = document.querySelector<HTMLElement>(
    '.reef-docs-pane main [data-slot="right"] > nav > [data-slot="container"]',
  ) ?? fallback.value ?? undefined
}

onMounted(() => {
  nextTick(updateTarget)
})

const unregisterPageHook = nuxtApp.hooks.hook('page:loading:end', () => {
  nextTick(updateTarget)
})

watch(() => route.fullPath, () => {
  open.value = false
  nextTick(updateTarget)
})

onBeforeUnmount(unregisterPageHook)
</script>

<template>
  <div
    ref="fallback"
    class="reef-docs-navigation-fallback"
  />

  <Teleport
    v-if="target"
    :to="target"
  >
    <UDrawer
      v-model:open="open"
      direction="left"
      title="Navigation"
      description="Navigation entre les pages de la documentation"
      :handle="false"
      inset
      :ui="{
        content: 'w-full max-w-[min(24rem,calc(100vw-2rem))]',
      }"
    >
      <UButton
        label="Menu"
        icon="i-lucide-menu"
        color="neutral"
        variant="link"
        size="sm"
        class="reef-docs-menu-trigger -mt-1.5"
        aria-label="Ouvrir le menu de navigation"
      />

      <template #body>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          class="absolute end-4 top-4"
          aria-label="Fermer le menu de navigation"
          @click="open = false"
        />

        <UContentNavigation
          :navigation="navigation || []"
          default-open
          :ui="{
            link: 'min-w-0 items-start',
            linkTitle: 'min-w-0 flex-1 text-left whitespace-normal break-normal overflow-visible leading-snug',
          }"
        />
      </template>
    </UDrawer>
  </Teleport>
</template>

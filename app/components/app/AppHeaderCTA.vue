<script setup lang="ts">
const route = useRoute()
const { isOpen, toggleSidePanel } = useSidePanel()
const { isMobileLayout } = useMobileLayout()

const isDocsLayout = computed(() => {
  return route.meta.layout === 'docs' || route.meta.layout === 'reef-docs'
})
</script>

<template>
  <ClientOnly>
    <UButton
      v-if="isDocsLayout && !isMobileLayout"
      :icon="isOpen ? 'lucide:panel-right-open' : 'lucide:panel-right-close'"
      aria-label="Toggle tool panel"
      color="neutral"
      variant="ghost"
      class="hidden lg:inline-flex"
      @click="toggleSidePanel(!isOpen)"
    />

    <template #fallback>
      <div
        v-if="isDocsLayout"
        class="hidden lg:block size-8 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800"
      />
    </template>
  </ClientOnly>
</template>

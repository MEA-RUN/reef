<script setup lang="ts">
const route = useRoute()
const { watchScrollToTarget, watchScrollToTop } = useSidePanel()
const { isOverlayLayout, checkWidth } = useMobileLayout()

usePageTool()
watchScrollToTop(route, checkWidth)
watchScrollToTarget(route)
</script>

<template>
  <ReefSplitView :overlay="isOverlayLayout">
    <NuxtLayout name="docs">
      <slot />
    </NuxtLayout>
    <AppFooter />
  </ReefSplitView>
</template>

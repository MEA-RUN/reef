<script setup lang="ts">
const route = useRoute()
const { isOpen, toggleSidePanel, watchScrollToTarget, watchScrollToTop } = useSidePanel()
const { isMobileLayout, checkWidth, watchIsMobileLayout } = useMobileLayout()

usePageTool()
watchScrollToTop(route, checkWidth)
watchScrollToTarget(route)
watchIsMobileLayout(isOpen, toggleSidePanel)
</script>

<template>
  <ReefSplitView :enabled="!isMobileLayout">
    <NuxtLayout name="docs">
      <slot />
    </NuxtLayout>
    <AppFooter />
  </ReefSplitView>
</template>

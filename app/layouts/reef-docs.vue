<script setup lang="ts">
import { usePageTool } from '~/composables/usePageTool';
import { useSidePanel } from '~/composables/useSidePanel';
import { useMobileLayout } from '~/composables/useMobileLayout';
import { useRoute } from '#imports';

const route = useRoute();
const { watchScrollToTarget, watchScrollToTop } = useSidePanel();
const { isOverlayLayout, checkWidth } = useMobileLayout();

usePageTool();
watchScrollToTop(route, checkWidth);
watchScrollToTarget(route);
</script>

<template>
  <ReefSplitView :overlay="isOverlayLayout">
    <NuxtLayout name="docs">
      <slot />
    </NuxtLayout>
    <AppFooter />
  </ReefSplitView>
</template>

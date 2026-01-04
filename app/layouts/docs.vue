<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSidePanel } from "../composables/useSidePanel";

const { isOpen } = useSidePanel();

const route = useRoute();
watch(() => route.path, () => {
  const scrollContainer = document.querySelector('.scroll-container');
  if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0  });
  }
}, { immediate: false });

watch(() => route.hash, (newHash) => {
  if (newHash) {
    const target = document.getElementById(newHash.slice(1));
    const scrollContainer = document.querySelector('.scroll-container');
    if (target && scrollContainer) {
      setTimeout(() => {
        scrollContainer.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }, 100);
    }
  }
}, { immediate: true });
</script>

<style>
html, body {
  height: 100vh;
  overflow: hidden;
}

#__nuxt {
  height: 100%;
}

.scroll-container {
  height: 93.5dvh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>

<template>
  <UMain class="h-screen">
    <SplitterGroup id="splitter-group-1" direction="horizontal" class="h-full">

      <SplitterPanel
          id="splitter-group-1-panel-1"
          :min-size="35"
      >
        <div class="scroll-container">
          <UContainer>
            <UPage>
              <template #left>
                <UPageAside
                    class="w-64 lg:w-72 lg:sticky lg:top-[calc(var(--ui-header-height)-64px)] lg:overflow-y-auto"
                >
                  <DocsAsideLeftTop />
                  <DocsAsideLeftBody />
                </UPageAside>
              </template>
              <slot/>
            </UPage>
            <AppFooter/>
          </UContainer>
        </div>
      </SplitterPanel>

      <SplitterResizeHandle v-show="isOpen" id="splitter-group-1-resize-handle-1" class="w-2 border" style="border-color: #27272a;" />

      <SplitterPanel
          v-show="isOpen"
          id="splitter-group-1-panel-2"
          collapsible
          class="h-full overflow-y-auto"
      >
        <UContainer class="h-full flex items-center justify-center">
          <img src="https://i.pinimg.com/736x/8a/a8/a2/8aa8a28423469f1e0debd6dcaa62cabe.jpg" class="max-w-full h-auto" />
        </UContainer>
      </SplitterPanel>

    </SplitterGroup>
  </UMain>
</template>
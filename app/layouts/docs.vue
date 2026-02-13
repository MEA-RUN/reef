<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSidePanel } from "../composables/useSidePanel";
import { useMobileLayout } from "../composables/useMobileLayout";
import { useSubjectTools } from "../composables/useSubjectTools";

const { isOpen, isFullscreen, toggleSidePanel, toggleFullscreen } = useSidePanel();
const { isMobileLayout, checkWidth } = useMobileLayout();
const { activeTool, getToolUrl, clearActiveTool } = useSubjectTools();

const route = useRoute();
watch(() => route.path, async () => {
  const scrollContainer = document.querySelector('.scroll-container');
  if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0  });
  }
  setTimeout(checkWidth, 100);
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

watch(isMobileLayout, (newValue) => {
  console.log('Layout changed to mobile:', newValue);
  // Close active tool and side panel when switching to mobile
  if (newValue && isOpen.value) {
    toggleSidePanel(false);
  }
});

// Exit fullscreen when closing the active tool
watch(activeTool, (newValue) => {
  if (!newValue && isFullscreen.value) {
    toggleFullscreen(false);
  }
});

// Exit fullscreen when closing the side panel
watch(isOpen, (newValue) => {
  if (!newValue && isFullscreen.value) {
    toggleFullscreen(false);
  }
});
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
          v-show="!isFullscreen"
          id="splitter-group-1-panel-1"
          :min-size="35"
      >
        <div class="scroll-container">
          <UContainer>
            <slot />
            <AppFooter/>
          </UContainer>
        </div>
      </SplitterPanel>

      <template v-if="!isMobileLayout">
        <SplitterResizeHandle
            v-show="isOpen && !isFullscreen"
            id="splitter-group-1-resize-handle-1"
            class="border border-default"
        />

        <SplitterPanel
            v-show="isOpen"
            id="splitter-group-1-panel-2"
            collapsible
            class="h-full overflow-hidden"
        >
          <!-- Show iframe if a tool is active -->
          <div v-if="activeTool" class="h-full flex flex-col bg-background">
            <div class="p-4 border-b border-default flex items-center justify-between">
              <div class="flex items-center gap-3">
                <UIcon v-if="activeTool.icon" :name="activeTool.icon" class="w-6 h-6" />
                <div>
                  <h3 class="font-semibold">{{ activeTool.name }}</h3>
                  <p class="text-xs text-muted">v{{ activeTool.version }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <UButton
                    size="sm"
                    color="gray"
                    variant="ghost"
                    :icon="isFullscreen ? 'i-heroicons-arrows-pointing-in' : 'i-heroicons-arrows-pointing-out'"
                    :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
                    @click="toggleFullscreen()"
                />
                <UButton
                    size="sm"
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-x-mark"
                    @click="clearActiveTool"
                />
              </div>
            </div>
            <iframe
                :src="getToolUrl(activeTool)"
                class="flex-1 w-full border-0"
                :title="activeTool.name"
            />
          </div>

          <!-- Show ToolSelector if no active tool -->
          <ToolSelector v-else class="h-full" />
        </SplitterPanel>
      </template>

    </SplitterGroup>
  </UMain>
</template>
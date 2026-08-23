<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "reka-ui";
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSidePanel } from "../composables/useSidePanel";
import { useMobileLayout } from "../composables/useMobileLayout";
import { useSubjectTools } from "../composables/useSubjectTools";

const { isOpen, isFullscreen, toggleSidePanel, toggleFullscreen, watchScrollToTop, watchScrollToTarget, watchIsOpen } = useSidePanel();
const { isMobileLayout, checkWidth, watchIsMobileLayout } = useMobileLayout();
const { activeTool, getToolUrl, clearActiveTool, watchActiveTool } = useSubjectTools();

const route = useRoute();

watchScrollToTop(route, checkWidth);
watchScrollToTarget(route);
watchIsMobileLayout(isOpen, toggleSidePanel);
watchActiveTool(isFullscreen, toggleFullscreen);
watchIsOpen();

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
  overflow-x: auto;
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
                    color="neutral"
                    variant="ghost"
                    :icon="isFullscreen ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
                    :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
                    @click="toggleFullscreen()"
                />
                <UButton
                    size="sm"
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
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

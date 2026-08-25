<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'

const props = withDefaults(defineProps<{
  enabled?: boolean
}>(), {
  enabled: true,
})

const {
  isOpen,
  isFullscreen,
  toggleSidePanel,
  toggleFullscreen,
  watchIsOpen,
} = useSidePanel()
const { activeTool, getToolUrl, clearActiveTool, watchActiveTool } = useSubjectTools()

const confirmCloseTool = ref(false)

watchActiveTool(isFullscreen, toggleFullscreen)
watchIsOpen()

function requestCloseTool() {
  confirmCloseTool.value = true
}

function confirmClose() {
  confirmCloseTool.value = false
  clearActiveTool()
}
</script>

<template>
  <div class="reef-split-view">
    <SplitterGroup
      direction="horizontal"
      class="h-full"
    >
      <SplitterPanel
        v-show="!isFullscreen"
        :min-size="35"
      >
        <div class="reef-scroll-container">
          <slot />
        </div>
      </SplitterPanel>

      <template v-if="props.enabled">
        <SplitterResizeHandle
          v-show="isOpen && !isFullscreen"
          class="border border-default"
        />

        <SplitterPanel
          v-show="isOpen"
          collapsible
          class="h-full overflow-hidden"
        >
          <div
            v-if="activeTool"
            class="h-full flex flex-col bg-background"
          >
            <div class="p-4 border-b border-default flex items-center justify-between">
              <div class="flex items-center gap-3">
                <UIcon
                  v-if="activeTool.icon"
                  :name="activeTool.icon"
                  class="size-6"
                />
                <div>
                  <h3 class="font-semibold">
                    {{ activeTool.name }}
                  </h3>
                  <p class="text-xs text-muted">
                    v{{ activeTool.version }}
                  </p>
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
                  aria-label="Close tool"
                  @click="requestCloseTool"
                />
              </div>
            </div>

            <iframe
              :src="getToolUrl(activeTool)"
              class="flex-1 w-full border-0"
              :title="activeTool.name"
            />
          </div>

          <ToolSelector
            v-else
            class="h-full"
          />
        </SplitterPanel>
      </template>
    </SplitterGroup>

    <UModal
      v-model:open="confirmCloseTool"
      title="Close this tool?"
      description="If you close this tool, all of its content will be lost. This cannot be undone."
      :ui="{ footer: 'justify-end' }"
    >
      <template #footer="{ close }">
        <UButton
          label="Cancel"
          color="neutral"
          variant="outline"
          @click="close"
        />
        <UButton
          label="Close tool"
          color="error"
          @click="confirmClose"
        />
      </template>
    </UModal>
  </div>
</template>

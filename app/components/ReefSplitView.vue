<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'

const props = withDefaults(defineProps<{
  overlay?: boolean
}>(), {
  overlay: true,
})

const {
  isOpen,
  isFullscreen,
  toggleSidePanel,
  watchIsOpen,
} = useSidePanel()
watchIsOpen()

function updateOverlay(open: boolean) {
  toggleSidePanel(open)
}
</script>

<template>
  <div class="reef-split-view">
    <SplitterGroup
      v-if="!props.overlay"
      direction="horizontal"
      class="h-full"
    >
      <SplitterPanel
        v-show="!isFullscreen"
        :default-size="50"
        :min-size="33"
      >
        <div class="reef-scroll-container">
          <slot />
        </div>
      </SplitterPanel>

      <SplitterResizeHandle
        v-show="isOpen && !isFullscreen"
        class="border border-default"
      />

      <SplitterPanel
        v-show="isOpen"
        :default-size="50"
        :min-size="22"
        collapsible
        class="h-full overflow-hidden"
      >
        <ToolPanel />
      </SplitterPanel>
    </SplitterGroup>

    <div
      v-else
      class="reef-scroll-container"
    >
      <slot />
    </div>

    <USlideover
      v-if="props.overlay"
      :open="isOpen"
      side="right"
      :close="false"
      title="Interactive tools"
      description="Tool panel displayed over the documentation"
      :ui="{
        overlay: 'bg-black/35',
        content: isFullscreen ? 'w-full max-w-none' : 'w-full sm:max-w-[min(48rem,92vw)]',
      }"
      @update:open="updateOverlay"
    >
      <template #content>
        <ToolPanel />
      </template>
    </USlideover>
  </div>
</template>

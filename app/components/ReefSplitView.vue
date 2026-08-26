<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'

const props = withDefaults(defineProps<{
  overlay?: boolean
}>(), {
  overlay: true,
})

const docsPane = useTemplateRef<HTMLElement>('docsPane')
let docsPaneObserver: ResizeObserver | undefined

const {
  isOpen,
  isFullscreen,
  toggleSidePanel,
  watchIsOpen,
} = useSidePanel()
const { manifest } = useSubjectTools()

const toolMinSize = computed(() => {
  const configuredSize = manifest.value?.splitView?.toolMinSizePercent

  if (typeof configuredSize !== 'number' || !Number.isFinite(configuredSize)) {
    return 0
  }

  return Math.min(Math.max(configuredSize, 0), 67)
})

watchIsOpen()

onMounted(() => {
  docsPaneObserver = new ResizeObserver(([entry]) => {
    document.documentElement.classList.toggle('reef-docs-compact', (entry?.contentRect.width ?? 0) < 1024)
  })

  watch(docsPane, (pane) => {
    docsPaneObserver?.disconnect()

    if (pane) {
      docsPaneObserver?.observe(pane)
    }
  }, { immediate: true })
})

onBeforeUnmount(() => {
  docsPaneObserver?.disconnect()
  document.documentElement.classList.remove('reef-docs-compact')
})

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
        <div
          ref="docsPane"
          class="reef-scroll-container reef-docs-pane"
        >
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
        :min-size="toolMinSize"
        class="h-full overflow-hidden"
      >
        <ToolPanel />
      </SplitterPanel>
    </SplitterGroup>

    <div
      v-else
      ref="docsPane"
      class="reef-scroll-container reef-docs-pane"
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

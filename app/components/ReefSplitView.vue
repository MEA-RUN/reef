<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'

const props = withDefaults(defineProps<{
  overlay?: boolean
}>(), {
  overlay: true,
})

const docsPane = useTemplateRef<HTMLElement>('docsPane')
let docsPaneObserver: ResizeObserver | undefined
let compactFrame = 0
let stopWatchingPane: (() => void) | undefined

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

const isHandleEnabled = computed(() => isOpen.value && !isFullscreen.value)

function updateCompactClass(width: number) {
  document.documentElement.classList.toggle('reef-docs-compact', width > 0 && width < 1024)
}

onMounted(() => {
  docsPaneObserver = new ResizeObserver(([entry]) => {
    const width = entry?.contentRect.width ?? 0
    cancelAnimationFrame(compactFrame)
    compactFrame = requestAnimationFrame(() => {
      updateCompactClass(width)
    })
  })

  stopWatchingPane = watch(docsPane, (pane) => {
    docsPaneObserver?.disconnect()

    if (pane)
      docsPaneObserver.observe(pane)
  }, { immediate: true })
})

onBeforeUnmount(() => {
  stopWatchingPane?.()
  cancelAnimationFrame(compactFrame)
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
        id="reef-docs"
        v-show="!isFullscreen"
        :order="1"
        :default-size="50"
        :min-size="33"
        class="min-h-0 min-w-0"
      >
        <div
          ref="docsPane"
          class="reef-docs-pane"
        >
          <div class="reef-scroll-container">
            <ReefDocsCompactMenu />
            <slot />
          </div>
        </div>
      </SplitterPanel>

      <SplitterResizeHandle
        id="reef-docs-tools"
        v-show="isHandleEnabled"
        :disabled="!isHandleEnabled"
        class="reef-split-handle"
      />

      <SplitterPanel
        id="reef-tools"
        v-show="isOpen"
        :order="2"
        :default-size="50"
        :min-size="toolMinSize"
        class="h-full min-h-0 min-w-0 overflow-hidden"
      >
        <ToolPanel />
      </SplitterPanel>
    </SplitterGroup>

    <div
      v-else
      ref="docsPane"
      class="reef-docs-pane"
    >
      <div class="reef-scroll-container">
        <ReefDocsCompactMenu />
        <slot />
      </div>
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

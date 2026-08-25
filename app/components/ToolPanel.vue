<script setup lang="ts">
const { isOpen, isFullscreen, toggleSidePanel, toggleFullscreen } = useSidePanel()
const { activeTool, getToolUrl, clearActiveTool, watchActiveTool } = useSubjectTools()

const confirmCloseTool = ref(false)

watchActiveTool(isFullscreen, toggleFullscreen)

function requestClosePanel() {
  if (activeTool.value) {
    confirmCloseTool.value = true
    return
  }

  toggleSidePanel(false)
}

function confirmClose() {
  confirmCloseTool.value = false
  clearActiveTool()
  toggleSidePanel(false)
}
</script>

<template>
  <section
    class="h-full min-h-0 flex flex-col bg-background"
    aria-label="Interactive tools"
  >
    <header class="min-h-16 px-4 border-b border-default flex items-center justify-between gap-4">
      <div class="min-w-0 flex items-center gap-3">
        <UIcon
          :name="activeTool?.icon || 'i-lucide-wrench'"
          class="size-5 shrink-0 text-muted"
        />
        <div class="min-w-0">
          <h2 class="font-semibold truncate">
            {{ activeTool?.name || 'Interactive tools' }}
          </h2>
          <p
            v-if="activeTool?.version"
            class="text-xs text-muted"
          >
            v{{ activeTool.version }}
          </p>
        </div>
      </div>

      <div class="shrink-0 flex items-center gap-1">
        <UButton
          v-if="activeTool"
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
          aria-label="Close tool panel"
          @click="requestClosePanel"
        />
      </div>
    </header>

    <iframe
      v-if="activeTool"
      :src="getToolUrl(activeTool)"
      class="min-h-0 flex-1 w-full border-0"
      :title="activeTool.name"
    />

    <ToolSelector
      v-else
      :show-header="false"
      class="min-h-0 flex-1"
    />

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
  </section>
</template>

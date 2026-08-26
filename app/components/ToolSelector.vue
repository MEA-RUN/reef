<template>
  <div class="tool-selector h-full flex flex-col bg-background">
    <!-- Header -->
    <div
      v-if="showHeader"
      class="p-6 border-b border-default"
    >
      <h2 class="text-2xl font-bold mb-2">Available Tools</h2>
      <p v-if="manifest?.title" class="text-sm font-medium text-primary mb-1">{{ manifest.title }}</p>
      <p class="text-sm text-muted">Click a tool to open it in the viewer</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-primary mb-2" />
        <p class="text-sm text-muted">Loading tools...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center p-6">
      <div class="text-center">
        <UIcon name="i-lucide-triangle-alert" class="w-12 h-12 text-error mb-4" />
        <p class="text-error font-semibold mb-2">Failed to load tools</p>
        <p class="text-sm text-muted">{{ error }}</p>
        <UButton
            class="mt-4"
            @click="loadManifest('/tools/manifests.json')"
        >
          Retry
        </UButton>
      </div>
    </div>

    <!-- Tools list -->
    <div v-else-if="manifest?.tools" class="flex-1 overflow-y-auto p-6">
      <div class="grid gap-4">
        <UButton
            v-for="tool in manifest.tools"
            :key="tool.id"
            variant="outline"
            size="xl"
            class="tool-card h-auto min-h-20 justify-start"
            :class="{
              'bg-primary/5 ring-2 ring-primary': activeTool?.id === tool.id
            }"
            @click="handleToolClick(tool.id)"
        >
          <template #leading>
            <UIcon v-if="tool.icon" :name="tool.icon" class="w-8 h-8" />
          </template>

          <div class="flex-1 text-left">
            <div class="font-semibold text-base flex items-center gap-2">
              {{ tool.name }}
              <UBadge v-if="activeTool?.id === tool.id" size="xs" color="primary">Active</UBadge>
            </div>
            <div v-if="tool.description" class="text-sm text-muted mt-1">
              {{ tool.description }}
            </div>
            <div v-if="tool.version" class="text-xs text-muted mt-1">
              v{{ tool.version }}
            </div>
          </div>

          <template #trailing>
            <UIcon
                v-if="activeTool?.id === tool.id"
                name="i-lucide-chevron-right"
                class="w-6 h-6 text-primary"
            />
          </template>
        </UButton>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex-1 flex items-center justify-center p-6">
      <div class="text-center">
        <UIcon name="i-lucide-box" class="w-12 h-12 text-muted mb-4" />
        <p class="text-muted">No tools available</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSubjectTools } from "~/composables/useSubjectTools"

withDefaults(defineProps<{
  showHeader?: boolean
}>(), {
  showHeader: true,
})

const {
  manifest,
  activeTool,
  loading,
  error,
  loadManifest,
  setActiveTool,
  clearActiveTool
} = useSubjectTools()

// Load metadata on mount
onMounted(async () => {
  // Only load if not already loaded (shared state with page)
  if (!manifest.value) {
    await loadManifest('/tools/manifests.json')
  }
})

const handleToolClick = (toolId: string) => {
  // Set as active tool to display in iframe
  setActiveTool(toolId)
}

// Expose for parent components
defineExpose({
  manifest,
  activeTool,
  setActiveTool,
  clearActiveTool
})
</script>

<style scoped>
.tool-card {
  transition: all 0.2s;
}

.tool-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>

<template>
  <div class="tool-selector h-full flex flex-col bg-background">
    <!-- Header -->
    <div class="p-6 border-b border-default">
      <h2 class="text-2xl font-bold mb-2">Available Tools</h2>
      <p v-if="metadata?.title" class="text-sm font-medium text-primary mb-1">{{ metadata.title }}</p>
      <p class="text-sm text-muted">Click a tool to open it in the viewer</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary mb-2" />
        <p class="text-sm text-muted">Loading tools...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center p-6">
      <div class="text-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-error mb-4" />
        <p class="text-error font-semibold mb-2">Failed to load tools</p>
        <p class="text-sm text-muted">{{ error }}</p>
        <UButton
            class="mt-4"
            @click="loadMetadata('/tools.json')"
        >
          Retry
        </UButton>
      </div>
    </div>

    <!-- Tools list -->
    <div v-else-if="metadata?.tools" class="flex-1 overflow-y-auto p-6">
      <div class="grid gap-4">
        <UButton
            v-for="tool in metadata.tools"
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
                name="i-heroicons-chevron-right"
                class="w-6 h-6 text-primary"
            />
          </template>
        </UButton>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex-1 flex items-center justify-center p-6">
      <div class="text-center">
        <UIcon name="i-heroicons-cube" class="w-12 h-12 text-muted mb-4" />
        <p class="text-muted">No tools available</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSubjectTools } from '../composables/useSubjectTools'

const {
  metadata,
  activeTool,
  loading,
  error,
  loadMetadata,
  setActiveTool,
  clearActiveTool
} = useSubjectTools()

// Load metadata on mount
onMounted(async () => {
  // Only load if not already loaded (shared state with page)
  if (!metadata.value) {
    await loadMetadata('/tools.json')
  }
})

const handleToolClick = (toolId: string) => {
  // Set as active tool to display in iframe
  setActiveTool(toolId)
}

// Expose for parent components
defineExpose({
  metadata,
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

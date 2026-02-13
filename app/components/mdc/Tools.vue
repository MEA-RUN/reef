<template>
  <div class="tool-button-wrapper my-6">
    <UButton
        :icon="toolIcon"
        size="lg"
        color="primary"
        variant="solid"
        class="tool-button"
        @click="openTool"
    >
      <slot>{{ buttonText }}</slot>
    </UButton>
    <p v-if="toolNotFound" class="text-sm text-error mt-2">
      Tool "{{ actualToolId }}" not found
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSubjectTools } from '../../composables/useSubjectTools'
import { useSidePanel } from '../../composables/useSidePanel'

// MDC passes the first parameter as an unnamed prop or id
// :::tools match => id='match' or first unnamed param
const props = defineProps<{
  id?: string          // MDC unnamed parameter (:::tools match)
  toolId?: string      // Alternative explicit prop
}>()
const { metadata, loadMetadata, setActiveTool } = useSubjectTools()
const { toggleSidePanel, isOpen } = useSidePanel()

const toolNotFound = ref(false)

// Get the actual tool ID from either prop
const actualToolId = computed(() => props.id || props.toolId)

// Get button text from slot or use default
const buttonText = computed(() => {
  return actualToolId.value ? `Open ${actualToolId.value}` : 'Open Tool'
})

// Get tool icon from metadata
const toolIcon = computed(() => {
  if (!metadata.value || !actualToolId.value) return 'i-heroicons-cube'

  const tool = metadata.value.tools.find(t => t.id === actualToolId.value)
  return tool?.icon || 'i-heroicons-cube'
})

// Load metadata on mount
onMounted(async () => {
  if (!metadata.value) {
    await loadMetadata('/tools.json')
  }
})

const openTool = () => {
  const toolId = actualToolId.value

  if (!toolId) {
    console.warn('[ToolButton] No tool ID specified')
    return
  }

  if (!metadata.value) {
    console.warn('[ToolButton] Metadata not loaded')
    return
  }

  const tool = metadata.value.tools.find(t => t.id === toolId)

  if (!tool) {
    console.warn('[ToolButton] Tool not found:', toolId)
    toolNotFound.value = true
    return
  }

  // Open side panel if not already open
  if (!isOpen.value) {
    toggleSidePanel(true)
  }

  // Activate the tool
  setActiveTool(toolId)

  console.log('[ToolButton] Opened tool:', toolId)
}
</script>

<style scoped>
.tool-button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.tool-button {
  min-width: 200px;
  transition: transform 0.2s ease;
}

.tool-button:hover {
  transform: translateY(-2px);
}

.tool-button:active {
  transform: translateY(0);
}
</style>

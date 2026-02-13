<template>
  <div class="mermaid-chart-container border border-muted bg-default rounded-md p-4 overflow-auto">
    <div :id="chartId" ref="root" class="mermaid-chart"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import mermaid from 'mermaid'

const props = defineProps<{ code: string; id?: string; theme?: string }>()

const root = ref<HTMLElement | null>(null)
const chartId = props.id ?? `mermaid-${Math.random().toString(36).slice(2, 9)}`

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  theme: 'base',
  themeVariables: {
    primaryColor: '#1fc1b6',
    primaryTextColor: '#fff',
    primaryBorderColor: '#149b93',
    lineColor: '#5a76c9',
    secondaryColor: '#96b1e3',
    tertiaryColor: '#0d2045'
  }
})

async function render() {
  if (!root.value || !props.code) return

  try {
    // Generate a unique chartId for each render to avoid conflicts
    const uniqueChartId = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

    // Clear previous content
    root.value.innerHTML = ''

    // Render the diagram with unique ID
    const { svg } = await mermaid.render(uniqueChartId, props.code)
    if (root.value) {
      root.value.innerHTML = svg
    }
  } catch (e) {
    console.error('Mermaid render error:', e)
    // Fallback: show error
    if (root.value) {
      root.value.innerHTML = `<pre class="text-error text-sm">${String(e)}</pre>`
    }
  }
}

onMounted(() => {
  render()
})

watch(() => props.code, () => {
  render()
})
</script>

<style scoped>
.mermaid-chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}

.mermaid-chart {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mermaid-chart :deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>

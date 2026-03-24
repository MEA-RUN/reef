import { ref, watch, nextTick } from 'vue'

export interface Tool {
  id: string
  name: string
  icon?: string
  description?: string
  githubUrl: string
  version: string
  category?: string
  path?: string  // Path to tool's index.html for iframe
  localPath?: string  // Local path in public/ directory
}

export interface SubjectMetadata {
  title: string
  description?: string
  tools: Tool[]
  assets?: {
    logo?: string
    images?: string[]
  }
}

const metadata = ref<SubjectMetadata | null>(null)
const activeTool = ref<Tool | null>(null)  // Currently displayed tool in iframe
const loading = ref(false)
const error = ref<string | null>(null)

export const useSubjectTools = () => {
  /**
   * Load metadata from a subject repository
   * @param repoUrl - GitHub repository URL or path to metadata.json
   */
  const loadMetadata = async (repoUrl: string) => {
    // Only load on client side
    if (import.meta.server) {
      console.log('[useSubjectTools] Skipping metadata load on server')
      return
    }

    loading.value = true
    error.value = null

    try {
      // Fetch from static tools.json file
      // Use $fetch from Nuxt which handles SSR correctly
      metadata.value = await $fetch<SubjectMetadata>(repoUrl)
    } catch (err: any) {
      error.value = err?.message || 'Failed to load tools'
      console.error('[useSubjectTools] Failed to load metadata:', err)
    } finally {
      loading.value = false
    }
  }


  /**
   * Set the active tool to display in iframe
   */
  const setActiveTool = (toolId: string) => {
    if (!metadata.value) return
    const tool = metadata.value.tools.find(t => t.id === toolId)
    if (tool) {
      activeTool.value = tool
    }
  }

  /**
   * Clear the active tool (close iframe)
   */
  const clearActiveTool = () => {
    activeTool.value = null
  }

  /**
   * Get the iframe URL for a tool
   */
  const getToolUrl = (tool: Tool): string => {
    // If tool has explicit path, use it
    if (tool.path) {
      return tool.path
    }
    // Otherwise, construct path from id
    return `/tools/${tool.id}/index.html`
  }

  /**
   * Get subject title from metadata
   */
  const getSubjectTitle = (): string | undefined => {
    return metadata.value?.title
  }

  /**
   * Get subject description from metadata
   */
  const getSubjectDescription = (): string | undefined => {
    return metadata.value?.description
  }

  // Exit fullscreen when closing the active tool
  const watchActiveTool = (isFullscreen: any, toggleFullscreen: any) => {
    watch(activeTool, (newValue) => {
      if (!newValue && isFullscreen.value) {
        toggleFullscreen(false);
      }
    });
  }

  return {
    metadata,
    activeTool,
    loading,
    error,
    loadMetadata,
    setActiveTool,
    clearActiveTool,
    getToolUrl,
    getSubjectTitle,
    getSubjectDescription,
    watchActiveTool
  }
}

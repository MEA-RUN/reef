import { ref, watch } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { withBase } from 'ufo'

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

export interface SubjectManifest {
  title: string
  description?: string
  tools: Tool[]
  assets?: {
    logo?: string
    images?: string[]
  }
}

const manifest = ref<SubjectManifest | null>(null)
const activeTool = ref<Tool | null>(null)  // Currently displayed tool in iframe
const loading = ref(false)
const error = ref<string | null>(null)

export const useSubjectTools = () => {
  const baseURL = useRuntimeConfig().app.baseURL
  const resolvePublicPath = (path: string) => path.startsWith('http') ? path : withBase(path, baseURL)

  /**
   * Load manifest from a subject repository
   * @param repoUrl - GitHub repository URL or path to manifest.json
   */
  const loadManifest = async (repoUrl: string) => {
    // Only load on client side
    if (import.meta.server) {
      console.log('[useSubjectTools] Skipping manifest load on server')
      return
    }

    loading.value = true
    error.value = null

    try {
      // Fetch from static tools.json file
      // Use $fetch from Nuxt which handles SSR correctly
      const data = await $fetch<SubjectManifest>(resolvePublicPath(repoUrl))
      manifest.value = {
        ...data,
        tools: Array.isArray(data.tools) ? data.tools : [],
      }
    } catch (err: any) {
      error.value = err?.message || 'Failed to load tools'
      console.error('[useSubjectTools] Failed to load manifest:', err)
    } finally {
      loading.value = false
    }
  }


  /**
   * Set the active tool to display in iframe
   */
  const setActiveTool = (toolId: string) => {
    if (!manifest.value) return
    const tool = manifest.value.tools.find(t => t.id === toolId)
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
      return resolvePublicPath(tool.path)
    }
    // Otherwise, construct path from id
    return resolvePublicPath(`/tools/${tool.id}/index.html`)
  }

  /**
   * Get subject title from manifest
   */
  const getSubjectTitle = (): string | undefined => {
    return manifest.value?.title
  }

  /**
   * Get subject description from manifest
   */
  const getSubjectDescription = (): string | undefined => {
    return manifest.value?.description
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
    manifest,
    activeTool,
    loading,
    error,
    loadManifest,
    setActiveTool,
    clearActiveTool,
    getToolUrl,
    getSubjectTitle,
    getSubjectDescription,
    watchActiveTool
  }
}

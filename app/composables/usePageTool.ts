import type { Collections } from '@nuxt/content'

export function usePageTool() {
  const route = useRoute()
  const { locale, isEnabled } = useDocusI18n()
  const { isMobileLayout } = useMobileLayout()
  const { isOpen, toggleSidePanel } = useSidePanel()
  const { manifest, loadManifest, setActiveTool } = useSubjectTools()

  const collectionName = computed(() => isEnabled.value ? `docs_${locale.value}` : 'docs')

  async function openPageTool() {
    if (import.meta.server || isMobileLayout.value) {
      return
    }

    const page = await queryCollection(collectionName.value as keyof Collections)
      .path(route.path)
      .first()
    const toolId = (page?.meta as Record<string, unknown> | undefined)?.tool

    if (typeof toolId !== 'string' || !toolId) {
      return
    }

    if (!manifest.value) {
      await loadManifest('/tools/manifests.json')
    }

    const toolExists = manifest.value?.tools.some(tool => tool.id === toolId)
    if (!toolExists) {
      console.warn(`[Reef] Tool "${toolId}" from page frontmatter was not found.`)
      return
    }

    setActiveTool(toolId)
    if (!isOpen.value) {
      toggleSidePanel(true)
    }
  }

  watch(
    [() => route.path, () => locale.value, isMobileLayout],
    openPageTool,
    { immediate: true },
  )
}

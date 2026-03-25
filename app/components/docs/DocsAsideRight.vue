<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from 'nuxt/app'
import { useAssistant, useDocusI18n } from '#imports'

const props = withDefaults(defineProps<{
  page?: any
  showLeftFallback?: boolean
  ui?: Record<string, string>
}>(), {
  showLeftFallback: false,
  ui: () => ({})
})

const links = computed(() => props.page?.body?.toc?.links || [])
const tocUi = computed(() => ({
  container: 'py-3 mt-1',
  linkText: 'whitespace-normal break-words',
  ...props.ui
}))

const { shouldPushContent: shouldHideToc } = useAssistant()
const appConfig = useAppConfig()
const { t } = useDocusI18n()
const tocTitle = computed(() => (appConfig as any)?.toc?.title || t('docs.toc'))
</script>

<template>
  <div>
    <UContentToc
      v-if="links.length && !shouldHideToc"
      highlight
      :title="tocTitle"
      :links="links"
      :class="'hidden lg:block'"
      :ui="tocUi"
    >
      <template #bottom>
        <DocsAsideLeftBody v-if="props.showLeftFallback" class="pb-3" />
        <DocsAsideRightBottom />
      </template>
    </UContentToc>

    <DocsAsideMobileBar :links="links" />
  </div>
</template>
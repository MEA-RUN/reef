
<script setup lang="ts">
import { kebabCase } from 'scule'
import type { ContentNavigationItem, Collections } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'
import {
  addPrerenderPath,
  definePageMeta,
  inject,
  useDocusI18n
} from "../../../.nuxt/imports";
import { computed, ref} from "vue";
import { useMobileLayout } from "../../composables/useMobileLayout";
import { useRoute } from "vue-router";
import { createError, useAppConfig, useAsyncData } from "nuxt/app";

const { isMobileLayout } = useMobileLayout();

watch(isMobileLayout, (newValue, oldValue) => {
  console.log('Page - isMobileLayout changed:', { old: oldValue, new: newValue });
}, { immediate: true });

definePageMeta({
  layout: 'docs',
})

const route = useRoute()
const { locale, isEnabled, t } = useDocusI18n()
const appConfig = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const collectionName = computed(() => isEnabled.value ? `docs_${locale.value}` : 'docs')

const [{ data: page }, { data: surround }] = await Promise.all([
  useAsyncData(kebabCase(route.path), () => queryCollection(collectionName.value as keyof Collections).path(route.path).first() as Promise<DocsCollectionItem>),
  useAsyncData(`${kebabCase(route.path)}-surround`, () => {
    return queryCollectionItemSurroundings(collectionName.value as keyof Collections, route.path, {
      fields: ['description'],
    })
  }),
])

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

// Add the page path to the prerender list
addPrerenderPath(`/raw${route.path}.md`)

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
})

const headline = ref(findPageHeadline(navigation?.value, page.value?.path))
watch(() => navigation?.value, () => {
  headline.value = findPageHeadline(navigation?.value, page.value?.path) || headline.value
})

defineOgImageComponent('Docs', {
  headline: headline.value,
})

const github = computed(() => appConfig.github ? appConfig.github : null)

const editLink = computed(() => {
  if (!github.value) {
    return
  }

  return [
    github.value.url,
    'edit',
    github.value.branch,
    github.value.rootDir,
    'content',
    `${page.value?.stem}.${page.value?.extension}`,
  ].filter(Boolean).join('/')
})
const pageUi = computed(() => ({
  center: isMobileLayout.value ? 'lg:col-span-8' : 'lg:col-span-6'
}));
</script>
<template>
  <UPage v-if="page" class="lg:grid-cols-10" :ui="pageUi">

    <template #left v-if="!isMobileLayout">
      <UPageAside
          class="w-64 lg:sticky lg:top-[calc(var(--ui-header-height)-64px)] lg:overflow-y-auto"
      >
        <DocsAsideLeftTop />
        <DocsAsideLeftBody />
      </UPageAside>
    </template>

    <UPageHeader
        :title="page.title"
        :description="page.description"
        :headline="headline"
    >
      <template #links>
        <UButton
            v-for="(link, index) in (page as DocsCollectionItem).links"
            :key="index"
            size="sm"
            v-bind="link"
        />

        <DocsPageHeaderLinks />
      </template>
    </UPageHeader>

    <UPageBody>

      <ContentRenderer
          v-if="page"
          :value="page"
      />

      <USeparator>
        <div
            v-if="github"
            class="flex items-center gap-2 text-sm text-muted"
        >
          <UButton
              variant="link"
              color="neutral"
              :to="editLink"
              target="_blank"
              icon="i-lucide-pen"
              :ui="{ leadingIcon: 'size-4' }"
          >
            {{ t('docs.edit') }}
          </UButton>
          <span>{{ t('common.or') }}</span>
          <UButton
              variant="link"
              color="neutral"
              :to="`${github.url}/issues/new/choose`"
              target="_blank"
              icon="i-lucide-alert-circle"
              :ui="{ leadingIcon: 'size-4' }"
          >
            {{ t('docs.report') }}
          </UButton>
        </div>
      </USeparator>
      <UContentSurround :surround="surround" />
    </UPageBody>

<!--    sticky z-10 bg-default/75 lg:bg-[initial] backdrop-blur -mx-4 px-4 sm:px-6 sm:-mx-6 overflow-y-auto max-h-[calc(100vh-var(--ui-header-height))] lg:col-span-2 order-first lg:order-last border-b border-dashed border-default top-[calc(var(--ui-header-height)-64px)] lg:backdrop-blur-none! lg:overflow-y-auto -->
    <template
        v-if="page?.body?.toc?.links?.length"
        #right
    >
      <UContentToc
          highlight
          :title="appConfig.toc?.title || t('docs.toc')"
          :links="page.body?.toc?.links"
          class="border-b border-dashed border-default top-[calc(var(--ui-header-height)-64px)] lg:backdrop-blur-none! lg:overflow-y-auto"
      >
        <template #bottom>
          <template v-if="isMobileLayout">
            <DocsAsideLeftBody />
          </template>
          <DocsAsideRightBottom />
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
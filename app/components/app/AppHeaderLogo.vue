<script setup lang="ts">
import { withBase } from 'ufo'

const appConfig = useAppConfig()
const { hasLogo, headerLightUrl, headerDarkUrl, contextMenuItems } = useLogoAssets()
const baseURL = useRuntimeConfig().app.baseURL
const lightSrc = computed(() => withBase(headerLightUrl.value, baseURL))
const darkSrc = computed(() => withBase(headerDarkUrl.value, baseURL))
</script>

<template>
  <UContextMenu
    v-if="hasLogo"
    :items="contextMenuItems"
  >
    <img
      :src="lightSrc"
      :alt="appConfig.header?.logo?.alt || appConfig.header?.title"
      :class="['h-6 w-auto shrink-0 dark:hidden', appConfig.header?.logo?.class]"
    >
    <img
      :src="darkSrc"
      :alt="appConfig.header?.logo?.alt || appConfig.header?.title"
      :class="['hidden h-6 w-auto shrink-0 dark:block', appConfig.header?.logo?.class]"
    />
  </UContextMenu>
  <span v-else>
    {{ appConfig.header?.title || '{appConfig.header.title}' }}
  </span>
</template>

<script lang="ts">
// Define theme in a separate script block like the original Pre.vue
const theme = {
  slots: {
    root: 'relative group [&>pre]:rounded-t-none [&>pre]:my-0 my-5',
    header: 'flex items-center gap-1.5 border border-muted bg-default border-b-0 relative rounded-t-md px-4 py-3',
    icon: 'iconify i-lucide:copy shrink-0 size-4',
    filename: 'text-default text-sm/6',
    copy: 'rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 text-xs gap-1.5 ring ring-inset ring-accented text-default bg-default hover:bg-elevated active:bg-elevated disabled:bg-default aria-disabled:bg-default focus:outline-none focus-visible:ring-2 focus-visible:ring-inverted p-1.5 absolute top-[11px] right-[11px] lg:opacity-0 lg:group-hover:opacity-100 transition',
    base: 'group font-mono text-sm/6 border border-muted bg-muted rounded-md px-4 py-3 whitespace-pre-wrap break-words overflow-x-auto focus:outline-none language-bash shiki shiki-themes material-theme-lighter material-theme material-theme-palenight'
  },
  variants: {
    filename: {
      true: {
        base: 'pt-0'
      }
    }
  }
}
</script>

<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { useLocale } from "@nuxt/ui/composables/useLocale";
import { useAppConfig } from "nuxt/app";
import { computed, ref, watch, nextTick } from "vue";
import { tv } from "@nuxt/ui/utils/tv";

import Pre from "@nuxt/ui/components/prose/Pre.vue";
import UButton from "@nuxt/ui/components/Button.vue";
import UCodeIcon from "@nuxt/ui/components/prose/CodeIcon.vue";
import MermaidChart from "../MermaidChart.vue";

const props = defineProps({
  icon: { type: null, required: false },
  code: { type: String, required: false },
  language: { type: String, required: false },
  filename: { type: String, required: false },
  highlights: { type: Array, required: false },
  hideHeader: { type: Boolean, required: false },
  showLines: { type: Boolean, required: false, default: false },
  meta: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false }
});

const slotRef = ref<HTMLElement | null>(null);
const extractedCode = ref<string>('');
const renderKey = ref(0);

const isMermaid = computed(() => {
  return props.language === 'mermaid'
})

// Extract code from slot - reactive to DOM updates
const mermaidCode = computed(() => {
  if (props.code) return props.code
  return extractedCode.value
})

// Extract code from slot after mounting
const extractCodeFromSlot = () => {
  if (slotRef.value) {
    const textContent = slotRef.value.textContent || slotRef.value.innerText || ''
    const trimmed = textContent.trim()
    if (trimmed && trimmed !== extractedCode.value) {
      extractedCode.value = trimmed
    }
  }
}

// Watch slot ref and extract immediately when available
watch(slotRef, async (newVal) => {
  if (newVal && isMermaid.value) {
    await nextTick()
    extractCodeFromSlot()
  }
}, { immediate: true })

// Watch for language/code changes
watch([() => props.language, () => props.code], async ([lang, code]) => {
  if (lang === 'mermaid') {
    renderKey.value++ // Force re-render
    if (code) {
      extractedCode.value = code
    } else {
      await nextTick()
      await nextTick()
      extractCodeFromSlot()
    }
  } else {
    extractedCode.value = ''
  }
}, { immediate: true })

const showLinesEnabled = computed(() => {
  return props.showLines || props.meta?.includes('show-lines') || false
})

const { t } = useLocale();
const { copy, copied } = useClipboard();
const appConfig = useAppConfig();

const ui = computed(() => tv({
  extend: tv(theme),
  ...appConfig.ui?.prose?.pre || {}
})());
</script>

<style lang="scss">

.show-lines .shiki span.line{
  display:block;
  &::before{
    content: attr(line);
    padding-right: 1.25rem;
    display: inline-block;
    opacity: 0.8;
  }
}

.shiki span.line{
  display:block;
}

.shiki span.line.highlight{
  margin:0 -16px;
  padding:0 16px;
  background-color: color-mix(in oklab, var(--ui-bg-accented) 50%, transparent);
}
</style>

<template>
  <!-- Render mermaid chart if language is mermaid -->
  <div v-if="isMermaid" class="my-5">
    <div v-if="filename && !hideHeader" :class="ui.header({ class: props.ui?.header })">
      <UCodeIcon :icon="icon" :filename="filename" :class="ui.icon({ class: props.ui?.icon })" />
      <span :class="ui.filename({ class: props.ui?.filename })">{{ filename }}</span>
    </div>

    <!-- Hidden slot ref for code extraction -->
    <div ref="slotRef" style="display: none;">
      <slot />
    </div>

    <!-- Show mermaid diagram -->
    <ClientOnly>
      <MermaidChart v-if="mermaidCode" :key="`mermaid-${renderKey}`" :code="mermaidCode" />
      <template #fallback>
        <div class="mermaid-loading border border-muted bg-default rounded-md p-4">
          <p class="text-sm text-muted">Loading diagram...</p>
        </div>
      </template>
    </ClientOnly>
  </div>

  <!-- Otherwise render as normal code block -->
  <div v-else :class="ui.root({ class: [props.ui?.root, { 'show-lines': showLinesEnabled }], filename: !!filename })">
    <div v-if="filename && !hideHeader" :class="ui.header({ class: props.ui?.header })">
      <UCodeIcon :icon="icon" :filename="filename" :class="ui.icon({ class: props.ui?.icon })" />

      <span :class="ui.filename({ class: props.ui?.filename })">{{ filename }}</span>
    </div>

    <UButton
        :icon="copied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
        color="neutral"
        variant="outline"
        size="sm"
        :aria-label="t('prose.pre.copy')"
        :class="ui.copy({ class: props.ui?.copy })"
        tabindex="-1"
        @click="copy(props.code || '')"
    />

    <pre :class="ui.base({ class: [props.ui?.base, props.class] })" v-bind="$attrs"><slot /></pre>
  </div>
</template>

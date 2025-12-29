<script setup lang="ts">
import {SplitterGroup, SplitterPanel, SplitterResizeHandle, ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport, ScrollAreaCorner } from "reka-ui";
</script>

<style>
body {
  overflow: hidden;
}
</style>

<template>
  <div class="w-full h-full text-green9 font-semibold text-sm overflow-visible">

    <SplitterGroup id="splitter-group-1" direction="horizontal">

      <SplitterPanel
          id="splitter-group-1-panel-1"
          :min-size="35"
          class="flex items-center justify-center"
      >
        <ScrollAreaRoot
            class="w-full h-[90dvh] relative overflow-hidden"
            style="--scrollbar-size: 10px"
        >
          <ScrollAreaViewport class="w-full h-full rounded">
            <UPage>
              <template #left>
                <UPageAside>
                  <DocsAsideLeftTop/>
                  <DocsAsideLeftBody/>
                </UPageAside>
              </template>

              <slot/>

            </UPage>
          </ScrollAreaViewport>
          <ScrollAreaScrollbar
              class="flex select-none touch-none p-0.5 z-20 bg-blackA1 transition-colors duration-[160ms] ease-out hover:bg-blackA2 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
              orientation="vertical"
          >
            <ScrollAreaThumb
                class="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
            />
          </ScrollAreaScrollbar>
          <ScrollAreaScrollbar
              class="flex select-none touch-none p-0.5 bg-blackA6 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
              orientation="horizontal"
          >
            <ScrollAreaThumb
                class="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
            />
          </ScrollAreaScrollbar>

        </ScrollAreaRoot>

      </SplitterPanel>


      <SplitterResizeHandle id="splitter-group-1-resize-handle-1" class="w-2 border" style="border-color: #27272a;">
      </SplitterResizeHandle>

      <SplitterPanel
          id="splitter-group-1-panel-2"
          class=" flex items-center justify-center"
          collapsible
      >
        <img src="https://i.pinimg.com/736x/8a/a8/a2/8aa8a28423469f1e0debd6dcaa62cabe.jpg"/>
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>
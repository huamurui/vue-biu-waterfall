<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, onUpdated, ref, shallowRef } from 'vue'
import type { CSSProperties } from 'vue'
import type { WaterfallCellProps } from './component-types'
import type { WaterfallRect } from './types'
import { waterfallKey } from './context'

const props = defineProps<WaterfallCellProps>()
const context = inject(waterfallKey)
if (!context) {
  throw new Error('[vue-biu-waterfall] WaterfallCell must be inside WaterfallContainer.')
}
const { columnWidth, register, reflow } = context
const element = ref<HTMLElement>()
const rect = shallowRef<WaterfallRect>()
const style = computed<CSSProperties>(() => {
  const width = columnWidth.value
  const fixedRatio = Number.isFinite(props.width) && Number.isFinite(props.height)
    && props.width! > 0 && props.height! > 0
  return {
    width: width === undefined ? '100%' : `${width}px`,
    height: fixedRatio && width !== undefined ? `${width * props.height! / props.width!}px` : undefined,
    aspectRatio: fixedRatio ? `${props.width} / ${props.height}` : undefined,
    position: rect.value ? 'absolute' : 'relative',
    left: rect.value ? '0' : undefined,
    top: rect.value ? '0' : undefined,
    transform: rect.value ? `translate(${rect.value.left}px, ${rect.value.top}px)` : undefined,
  }
})

let unregister: (() => void) | undefined
onMounted(() => {
  unregister = register({
    element: element.value!,
    setRect(next) {
      const previous = rect.value
      if (!previous || Object.keys(next).some(key => next[key as keyof WaterfallRect] !== previous[key as keyof WaterfallRect])) {
        rect.value = next
      }
    },
  })
})
// Covers keyed reordering, prop updates and slot updates even without ResizeObserver.
onUpdated(reflow)
onBeforeUnmount(() => unregister?.())
</script>

<template>
  <div ref="element" class="biu-waterfall-cell" :style="style"><slot /></div>
</template>

<style>
:where(.biu-waterfall-cell) {
  box-sizing: border-box;
  display: flow-root;
  min-width: 0;
}
</style>

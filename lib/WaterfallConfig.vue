<script setup lang="ts">
import { watch, reactive, onMounted, onUnmounted, onBeforeUpdate } from 'vue'
import { mediatorRects } from "./stores/useWaterStore";
import { getLayoutStrategy } from "./utils/calculate";
import { adjustCells, setRect } from './utils/render'
const props = defineProps<{
  waterfallConfig: WaterfallConfig
}>()
const emit = defineEmits<{
  (event: 'scrollToBottom'): void
  (event: 'allThingDone'): void
}>()

watch(() => mediatorRects.length, () => {
  onResize()
})
const onResize = () => {
  let { columnCount, columnWidth } = getLayoutStrategy(document.documentElement.clientWidth, props.waterfallConfig)
  let columnHeights: Array<number> = new Array(columnCount).fill(0)
  setRect(columnWidth)
  adjustCells(mediatorRects, columnHeights, columnWidth, true)
  emit('allThingDone')
}
const onScroll = () => {
  let scrollTop = document.documentElement.scrollTop
  let windowHeight = document.documentElement.clientHeight
  let scrollHeight = document.documentElement.scrollHeight
  if (scrollTop + windowHeight + 3 >= scrollHeight) {
    emit('scrollToBottom')
  }
}


onMounted(() => {
  addEventListener('resize', onResize)
  addEventListener('scroll', onScroll)
  onResize()
})
onUnmounted(() => {
  removeEventListener('resize', onResize)
  removeEventListener('scroll', onScroll)
})

</script>

<template>
  <slot></slot>
</template>

<style scoped>

</style>

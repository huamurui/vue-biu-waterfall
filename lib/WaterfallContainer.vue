<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import { mediatorRects } from "./stores/useWaterStore";
import { getLayoutStrategy } from "./utils/calculate";
import { adjustCells, setRects } from './utils/render'

//due to this... https://github.com/vuejs/core/issues/4294
//I have to copy the interface here, and also no able to combine them into an object..fuck...
interface WaterfallConfig {
  interval: number
  lineGap: number
  minLineGap: number
  maxLineGap: number
  singleMaxWidth: number
}

const props = withDefaults(
  defineProps<WaterfallConfig>(),
  {
    interval: 200,
    lineGap: 250,
    minLineGap: 100,
    maxLineGap: 320,
    singleMaxWidth: 300,
  }

)
const emit = defineEmits<{
  (event: 'scrollToBottom', columnCount: number): void
  (event: 'allThingDone'): void
}>()



const onResize = () => {
  let { columnCount, columnWidth } = getLayoutStrategy(document.documentElement.clientWidth, props)
  let columnHeights: Array<number> = new Array(columnCount).fill(0)
  setRects(columnWidth)
  adjustCells(mediatorRects, columnHeights, columnWidth, true)
  emit('allThingDone')
}
const onScroll = () => {
  let scrollTop = document.documentElement.scrollTop
  let windowHeight = document.documentElement.clientHeight
  let scrollHeight = document.documentElement.scrollHeight
  if (scrollTop + windowHeight + 3 >= scrollHeight) {
    let { columnCount, columnWidth } = getLayoutStrategy(document.documentElement.clientWidth, props)
    emit('scrollToBottom', columnCount)
  }
}

watch(() => mediatorRects.length, () => {
  onResize()
})
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
  <div class="biu">
    <slot></slot>
  </div>
</template>

<style scoped>
/* .biu {
  position: relative
} */
</style>

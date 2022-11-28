<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, onBeforeUpdate } from 'vue'
import { mediatorRects, setRect } from "./useWaterStore";
import { getLayoutStrategy } from "../utils/calculate";
import { adjustCells } from '../utils/render'
// import { adjustCells, manageCells } from "../utils/render";
const props = defineProps<{ waterfallConfig: WaterfallConfig }>()
const emit = defineEmits<{
  (event: 'scrollToBottom'): void
}>()

let layout = getLayoutStrategy(document.body.clientWidth, props.waterfallConfig)
let columnCount = layout.count
let columnWidth = layout.width[0]
// let columnHeights: Array<number> = new Array(columnCount).fill(0)

// adjustCells(mediatorRects, columnHeights, columnWidth, true)


const getAdaptedRect = () => {
  // console.log(mediatorRects)
}





const getLayout = () => {
  layout = getLayoutStrategy(document.body.clientWidth, props.waterfallConfig)
  columnWidth = layout.width[0]
}
const onResize = () => {
  getLayout()
  columnCount = layout.count
  columnWidth = layout.width[0]
  let columnHeights: Array<number> = new Array(columnCount).fill(0)
  setRect(layout.width[0])
  adjustCells(mediatorRects, columnHeights, columnWidth, true)
  // columnHeights.length = 0
}
const onScroll = () => {
  console.log(document.body.scrollTop)
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop + window.innerHeight >= document.body.clientHeight) {
    setTimeout(() => {
      // emit('scrollToBottom')
    }, 1000)
    console.log('scrollToBottom')
  }
}


onMounted(() => {
  setRect(layout.width[0])
  addEventListener('resize', onResize)
  addEventListener('scroll', onScroll)
  onResize()
})
onUnmounted(() => {
  removeEventListener('resize', onResize)
  removeEventListener('scroll', onScroll)
})
onBeforeUpdate(() => {
  getAdaptedRect()
})



</script>

<template>
  <slot></slot>
</template>

<style scoped>

</style>

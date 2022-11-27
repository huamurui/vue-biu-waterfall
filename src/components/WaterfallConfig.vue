<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, onBeforeUpdate } from 'vue'
import { mediatorRects, setRect } from "./useWaterStore";
import { getLayoutStrategy } from "../utils/calculate";
import { adjustCells, manageCells } from "../utils/render";
const props = defineProps<{ waterfallConfig: WaterfallConfig }>()
const emit = defineEmits<{
  (event: 'scrollToBottom'): void
}>()

let layout = getLayoutStrategy(document.body.clientWidth, props.waterfallConfig)
let columnCount = layout.count
let columnWidth = layout.width[0]
let columnHeights: Array<number> = []

//adjustCells(mediatorRects, columnHeights, true)


const getAdaptedRect = () => {
  console.log(mediatorRects)
}





const getLayout = () => {
  layout = getLayoutStrategy(document.body.clientWidth, props.waterfallConfig)
  columnWidth = layout.width[0]
}
const onResize = () => {
  getLayout()
  setRect(layout.width[0])
  console.log(layout.width[0])
}
const onScroll = () => {
  console.log(document.body.scrollTop)
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop + window.innerHeight >= document.body.clientHeight) {
    emit('scrollToBottom')
    console.log('scrollToBottom')
  }
}


onMounted(() => {
  addEventListener('resize', onResize)
  addEventListener('scroll', onScroll)
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

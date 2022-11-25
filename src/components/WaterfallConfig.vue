<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, } from 'vue'
import getLayoutStrategy from "../utils/getLayoutStrategy";


const props = defineProps<{ waterfallConfig: WaterfallConfig }>()

const layoutStrategy = () => {
  getLayoutStrategy(document.body.clientWidth, props.waterfallConfig)
  console.log('layoutStrategy', getLayoutStrategy(document.body.clientWidth, props.waterfallConfig))
}
const onResize = () => {
  console.log(document.body.clientWidth)
  layoutStrategy()
}
const onScroll = () => {
  console.log(document.body.scrollTop)
}
onMounted(() => {
  addEventListener('resize', onResize)
  addEventListener('scroll', onScroll)
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

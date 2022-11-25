<script setup lang="ts">
import { ref, onMounted, onUnmounted, } from 'vue'
import getLayoutStrategy from "../utils/getLayoutStrategy";


const props = defineProps<{ waterfallConfig: WaterfallConfig }>()
const emit = defineEmits<{ (event: 'scrollToBottom'): void }>()

let layout = getLayoutStrategy(document.body.clientWidth, props.waterfallConfig)

let columnCount = layout.count
let columnWidth = layout.width[0]


const getLayout = () => {
  layout = getLayoutStrategy(document.body.clientWidth, props.waterfallConfig)
}

const onResize = () => {
  getLayout()
  console.log(layout)
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




</script>

<template>
  <slot></slot>
</template>

<style scoped>

</style>

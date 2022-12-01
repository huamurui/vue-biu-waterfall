<script setup lang="ts">

import { mediatorRects, getRect } from "./stores/useWaterStore";
import { watch, onMounted, ref } from 'vue'
const props = defineProps<{
  waterCell: WaterfallCell
}>()


let metaRect = {
  index: props.waterCell.index,
  width: props.waterCell.width,
  height: props.waterCell.height,
  style: ''
}
getRect(metaRect)
let adaptedRect = mediatorRects[metaRect.index]
let margin: number = 5
watch(() => adaptedRect.width, () => {
  props.waterCell.style.height = adaptedRect.height - margin + 'px'
  props.waterCell.style.width = adaptedRect.width - margin + 'px'
  props.waterCell.style.left = adaptedRect.left + margin + 'px'
  props.waterCell.style.top = adaptedRect.top + margin + 'px'
})

//https://cn.vuejs.org/guide/essentials/class-and-style.html
//https://cn.vuejs.org/guide/built-ins/transition.html
//https://cn.vuejs.org/guide/built-ins/transition.html#the-transition-component
// this might be what you need
let readyToGo = ref(false)
onMounted(() => {
  readyToGo.value = true
})

</script>

<template>
  <Transition name="cell">
    <div v-if="readyToGo" :style="props.waterCell.style" class="cell">
      <slot></slot>
    </div>
  </Transition>
</template>

<style scoped>
/* cell */

.cell {
  position: absolute;
  transition:
    opacity 1s ease-in-out,
    box-shadow 300ms ease-in-out,
    left 700ms ease-in-out,
    top 700ms ease-in-out,
    transform 700ms ease-in-out;
}

.cell-enter-active {
  transform: scale(0.5);
}

.cell-enter-to {
  transform: scale(1);
}


.shadow {
  visibility: hidden;
}
</style>

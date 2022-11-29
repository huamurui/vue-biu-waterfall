<script setup lang="ts">

import { mediatorRects, getRect } from "./stores/useWaterStore";
import { watch } from 'vue'
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
watch(() => adaptedRect.width, () => {
  props.waterCell.style.height = adaptedRect.height + 'px'
  props.waterCell.style.width = adaptedRect.width + 'px'
  props.waterCell.style.left = adaptedRect.left + 'px'
  props.waterCell.style.top = adaptedRect.top + 'px'
})

// create a space to add the animation
let cellState = {
  pending: false,
  ready: true,
  shadow: false
}

const auto = () => {
  let viewportTop = document.body.scrollTop || document.documentElement.scrollTop
  let viewportBottom = (window.innerHeight || document.documentElement.clientHeight) + viewportTop
  if (props.waterCell.style.top + props.waterCell.style.height - 500 > viewportBottom) {
    cellState.shadow = true
  }
}

//https://cn.vuejs.org/guide/essentials/class-and-style.html

</script>

<template >
  <div class="ready" :style="props.waterCell.style" style="position:absolute;margin: 5px;">
    <slot></slot>
  </div>
</template>

<style scoped>
/* cell */
.pending {
  opacity: 0;
  transform: translateY(50px);
}

.ready {
  transition:
    opacity 1s ease-in-out,
    box-shadow 300ms ease-in-out,
    left 700ms ease-in-out,
    top 700ms ease-in-out,
    transform 700ms ease-in-out;
}

.shadow {
  visibility: hidden;
}
</style>

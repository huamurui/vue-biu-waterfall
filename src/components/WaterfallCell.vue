<script setup lang="ts">

import { mediatorRects, getRect } from "./useWaterStore";
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


let isActive = true

//https://cn.vuejs.org/guide/essentials/class-and-style.html

</script>

<template>
  <slot :style="{}"></slot>
</template>

<style scoped>
/* cell */

.cell {
  background: #fff;
  border: 1px solid #ddd;
  padding: 14px 14px 10px;
  width: 190px;
  position: absolute;
}

.cell:hover {
  box-shadow: 0 0 10px #aaa;
}

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

.cell p {
  margin: 0 0 10px;
}


.cell h2 {
  font-size: 12px;
  margin: 0;
  height: 14px;
  line-height: 14px;
}

.cell a {
  color: #666;
  text-decoration: none;
}

.cell a:hover {
  color: #f3c;
}
</style>

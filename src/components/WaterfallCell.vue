<script setup lang="ts">
import { getAdaptedRect } from "../utils/calculate";
import { mediatorRects, getRect } from "./useWaterStore";
import { reactive, watch, onBeforeMount } from 'vue'
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

let adaptedRect = reactive(getAdaptedRect(mediatorRects[metaRect.index], mediatorRects[0].width))
watch(() => mediatorRects[0].width, (newVal) => {
  adaptedRect = getAdaptedRect(mediatorRects[0], newVal)
  console.log('aaaa', newVal)
  console.log(adaptedRect.width)
})
let isActive = true

//https://cn.vuejs.org/guide/essentials/class-and-style.html

</script>

<template>
  <div class="testal" :class="{ ready: isActive }">lala</div>
  <slot :style="{}"></slot>
  <div>{{ adaptedRect }} {{ }}</div>
</template>

<style scoped>
.testal {
  width: 100px;
  height: 100px;
  background-color: olivedrab;
}


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

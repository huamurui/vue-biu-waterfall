//here is a demo of how to use the component
<script setup lang="ts">

import WaterfallConfig from './components/WaterfallConfig.vue'
import WaterfallCell from './components/WaterfallCell.vue'

import ItemFactory from './mock/ItemFactory'
import { reactive, ref } from 'vue'
const config = {
  interval: 200,
  lineGap: 250,
  minLineGap: 100,
  maxLineGap: 320,
  singleMaxWidth: 300,
}


let items = reactive(ItemFactory.get(18))
let isReflowing = false
const reflow = () => {
  isReflowing = true
  if (isReflowing) {
    items.push(...ItemFactory.get(6))
    setTimeout(() => {
    }, 500)
  }
}
const reflowed = () => {
  console.log('reflowed')
  isReflowing = false
}
// let set = reactive({ ultraSetColumnCount: NaN })
let isReady: boolean = true
let isPending: boolean = false

</script>

<template>
  <div>
    <WaterfallConfig :waterfallConfig="config" @scrollToBottom="reflow" @allThingDone="reflowed">
      <WaterfallCell :waterCell="item" v-for="item in items" :key="item.index">
        <div :class="{ ready: isReady, pending: isPending }" :style="item.style" style="position:absolute;margin: 5px">
          {{
    item
          }} </div>

      </WaterfallCell>
    </WaterfallConfig>
  </div>

</template>

<style >
/* really bad design, the class change should be in the every single WaterfallCell component, but I don't know how to do it. */
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
</style>
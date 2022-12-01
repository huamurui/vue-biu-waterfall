//here is a demo of how to use the component
<script setup lang="ts">

import { WaterfallConfig, WaterfallCell } from '../lib'
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

// items.push(...ItemFactory.get(6))
let isReflowing = false
const reflow = () => {
  isReflowing = true
  if (isReflowing) {
    items.push(...ItemFactory.get(6))
  }
}
const reflowed = () => {
  isReflowing = false
}
// let set = reactive({ ultraSetColumnCount: NaN })


</script>

<template>
  <div>
    <WaterfallConfig :waterfallConfig="config" @scrollToBottom="reflow" @allThingDone="reflowed">
      <WaterfallCell :waterCell="item" v-for="item in items" :key="item.index">
        <div style="color:grey;"> {{ item.index }} </div>
      </WaterfallCell>
    </WaterfallConfig>
  </div>

</template>

<style scoped>

</style>
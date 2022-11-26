//here is a demo of how to use the component
<script setup lang="ts">

import WaterfallConfig from './components/WaterfallConfig.vue'
import WaterfallCell from './components/WaterfallCell.vue'

import ItemFactory from './mock/ItemFactory'
import { reactive, } from 'vue'
const config = {
  interval: 200,
  lineGap: 250,
  minLineGap: 100,
  maxLineGap: 320,
  singleMaxWidth: 300,
}

let items = reactive(ItemFactory.get(50))
const reflow = () => {
  items.push(...ItemFactory.get(50))
}


let set = reactive({ ultraSetColumnCount: NaN })


</script>

<template>
  <div>
    <WaterfallConfig :waterfallConfig="config" @scrollToBottom="reflow">
      <input v-model="set.ultraSetColumnCount">{{ set.ultraSetColumnCount }}
      <WaterfallCell :waterCell="item" v-for="item in items" :key="item.index">
        <div :style="item.style"> {{ item }} lala </div>
      </WaterfallCell>
    </WaterfallConfig>
  </div>

</template>

<style scoped>

</style>

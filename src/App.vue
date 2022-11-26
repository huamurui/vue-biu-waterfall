//here is a demo of how to use the component
<script setup lang="ts">

import WaterfallConfig from './components/WaterfallConfig.vue'
import WaterfallCell from './components/WaterfallCell.vue'

import ItemFactory from './mock/ItemFactory'
import { reactive, } from 'vue'
let items = reactive(ItemFactory.get(50))
const config = {
  interval: 200,
  lineGap: 250,
  minLineGap: 100,
  maxLineGap: 320,
  singleMaxWidth: 300,
}

const reflow = () => {
  items.push(...ItemFactory.get(50))
}
let columnWidth0 = reactive({ width: NaN })
const passWidth = (columnWidth: number) => {
  console.log(columnWidth)
  columnWidth0.width = columnWidth
  console.log(columnWidth0)
}

//你知道吗...这种实现方式，如果作为工具，是tm不可接受的。你暴露了太多...不需要关心或者说无法的内容 
let ultraSetColumnCount: number = NaN


</script>

<template>
  <div>
    <WaterfallConfig :waterfallConfig="config" @scrollToBottom="reflow" @getWidth="passWidth">
      <input v-model="ultraSetColumnCount">{{ ultraSetColumnCount }}
      <WaterfallCell :waterCell="item" :adaptedWidth="columnWidth0.width" v-for="item in items" :key="item.index">
        <div :style="item.style"> {{ item }} lala {{ columnWidth0.width }}</div>
      </WaterfallCell>
    </WaterfallConfig>
  </div>

</template>

<style scoped>

</style>

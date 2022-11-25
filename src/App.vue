//here is a demo of how to use the component
<script setup lang="ts">

import WaterfallConfig from './components/WaterfallConfig.vue'
import WaterfallCell from './components/WaterfallCell.vue'

import ItemFactory from './mock/ItemFactory'

let items = ItemFactory.get(50)
const config = {
  interval: 200,
  lineGap: 250,
  minLineGap: 100,
  maxLineGap: 320,
  singleMaxWidth: 300,
}

</script>

<template>
  <div>
    <WaterfallConfig :waterfallConfig="config">
      <WaterfallCell :waterCell="item" v-for="item in items" :key="item.index">
        <div :style="item.style"> {{ item }} lala </div>
      </WaterfallCell>
    </WaterfallConfig>
  </div>

</template>

<style scoped>

</style>

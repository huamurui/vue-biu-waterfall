//here is a demo of how to use the component
<script setup lang="ts">

import { WaterfallConfig, WaterfallCell } from '../lib'
import UrlFactory from './mock/UrlFactory'
import { reactive } from 'vue'

let items = reactive(UrlFactory.get(40))


let isReflowing = false
const reflow = () => {
  isReflowing = true
  if (isReflowing) {
    items.push(...UrlFactory.get(6))
  }
}
const reflowed = () => {
  isReflowing = false
}
// let set = reactive({ ultraSetColumnCount: NaN })


</script>

<template>
  <div>
    <WaterfallConfig @scrollToBottom="reflow" @allThingDone="reflowed">
      <WaterfallCell :waterCell="item" v-for="item in items" :key="item.index">
        <img :src="item.url" style="height: 100%;width:100%;" />
      </WaterfallCell>
    </WaterfallConfig>
  </div>

</template>

<style scoped>

</style>
//here is a demo of how to use the component
<script setup lang="ts">

import { WaterfallContainer, WaterfallCell } from '../lib'
import ItemFactory from './mock/ItemFactory'
import { reactive, ref } from 'vue'

let items = reactive(ItemFactory.get(18))
// items.push(...ItemFactory.get(6))
let isReflowing = false
const reflow = (count: number) => {
  isReflowing = true
  if (isReflowing) {
    items.push(...ItemFactory.get(count))
  }
}
const reflowed = () => {
  isReflowing = false
}
// let set = reactive({ ultraSetColumnCount: NaN })


</script>

<template>
  <div>
    <WaterfallContainer @scrollToBottom="reflow" @allThingDone="reflowed">
      <WaterfallCell :waterCell="item" v-for="item in items" :key="item.index">
        <div style="color:grey;"> {{ item.index }} </div>
      </WaterfallCell>
    </WaterfallContainer>
  </div>
</template>

<style scoped></style>
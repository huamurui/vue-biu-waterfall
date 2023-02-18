//here is a demo of how to use the component
<script setup lang="ts">

import { WaterfallContainer, WaterfallCell } from '../lib'
import ImageCenter from './mock/ImageCenter'
import { reactive, onMounted } from 'vue'

let items: any = reactive([])
onMounted(async () => {
  items.push(...await ImageCenter.get(16))
})

let isReflowing = false
const reflow = async (columnCount) => {
  if (!isReflowing) {
    isReflowing = true
    items.push(...await ImageCenter.get(columnCount))
  }
}

const reflowed = () => {
  isReflowing = false
}

</script>

<template>
  <div>
    <WaterfallContainer @scrollToBottom="reflow" @allThingDone="reflowed">
      <WaterfallCell :waterCell="item" v-for="item in items" :key="item.index">
        <img :src="item.url" class="cell" />
      </WaterfallCell>
    </WaterfallContainer>
  </div>
</template>

<style scoped>
.cell {
  height: 98%;
  width: 98%;
  border-radius: 8px;
  display: flex;
  /* 垂直居中 */
  align-items: center;
  /* 水平居中 */
  justify-content: center;
}
</style>
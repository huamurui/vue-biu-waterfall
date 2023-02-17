//here is a demo of how to use the component
<script setup lang="ts">

import { WaterfallContainer, WaterfallCell } from '../lib'
import ImageCenter from './mock/ImageCenter'
import { reactive, onMounted } from 'vue'


let items: any = reactive([])
onMounted(async () => {
  let mediator = await ImageCenter.get(16)
  console.log(mediator)
  items.push(...mediator)
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
        <img :src="item.url" style="height: 98%;width:98%;" />
      </WaterfallCell>
    </WaterfallContainer>
  </div>
</template>

<style scoped></style>
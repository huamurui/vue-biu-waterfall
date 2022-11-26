<script setup lang="ts">
import getAdaptedRect from "../utils/getAdaptedRect"
import { reactive, watch, onBeforeMount } from 'vue'
const props = defineProps<{
  waterCell: WaterfallCell
  adaptedWidth: number
}>()
const emit = defineEmits<{
  // (event: 'getWidth'): void
}>()

console.log(props.adaptedWidth)

let metaRect = {
  index: props.waterCell.index,
  width: props.waterCell.width,
  height: props.waterCell.height,
  top: 0,
  left: 0
}

let adaptedRect = getAdaptedRect(metaRect, props.adaptedWidth)
props.waterCell.style = {
  background: props.waterCell.style.background,
  width: adaptedRect.width + 'px',
  height: adaptedRect.height + 'px',
}

watch(
  () => props.adaptedWidth,
  (newVal, oldVal) => {
    adaptedRect = getAdaptedRect(metaRect, newVal)
    console.log('watch')
    props.waterCell.style = {
      background: props.waterCell.style.background,
      width: adaptedRect.width + 'px',
      height: adaptedRect.height + 'px',
    }
  }
)

</script>

<template>
  <slot></slot>
  <div>biu {{ adaptedRect.width }} {{ props.waterCell.style }}</div>
</template>

<style scoped>
/* global */

body {
  background: #eee;
  border: 0 none;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  font-size: 12px;
  line-height: 1;
  overflow-y: scroll;
}

h1 {
  margin: 0;
  height: 100px;
  line-height: 100px;
  font-size: 48px;
  text-align: center;
}

#cells {
  margin: 0 auto;
  position: relative;
}

#loader {
  margin: 0 auto;
  text-align: center;
}


/* notice */

#notice {
  background: #fefec1;
  border: 1px solid #d9ccb4;
  padding: 0 10px;
  height: 28px;
  color: #333;
  font-size: 12px;
  line-height: 28px;
  position: fixed;
  left: 0px;
  z-index: 9600;
  /* -webkit-transition: top 500ms ease-in-out;
  -moz-transition: top 500ms ease-in-out;
  -o-transition: top 500ms ease-in-out; */
  transition: top 500ms ease-in-out;
}

#notice.off {
  top: -36px;
}

#notice.on {
  top: 0px;
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


/* user actions */

.cell span {
  background-color: #f5f5f5;
  background-position: 5px center;
  background-repeat: no-repeat;
  border: 1px solid #999;
  border-radius: 2px;
  padding: 0 7px 0 26px;
  height: 24px;
  font-size: 14px;
  line-height: 24px;
  cursor: pointer;
  position: absolute;
  top: 20px;
  z-index: 9000;
  visibility: hidden;
}

.ready:hover span {
  visibility: visible;
}

.cell span:hover {
  background-color: #fff;
  border: 1px solid #39f;
}
</style>

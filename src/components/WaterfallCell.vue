<script setup lang="ts">
const props = defineProps<{
  waterCell: WaterfallCell;
}>()
let item = props.waterCell

</script>

<template>
  <slot></slot>
  <div> {{ item.width }}</div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { ref } from 'vue'
import { WaterfallCell, WaterfallContainer } from '../lib'
import { createImageFactory } from './mock/ImageCenter'

const imageFactory = createImageFactory()
const images = ref(imageFactory.get(6))
</script>

<template>
  <section class="gallery-demo" aria-labelledby="gallery-title">
    <h2 id="gallery-title">图片</h2>
    <WaterfallContainer :column-width="110" :gap="10" :has-more="false">
      <WaterfallCell
        v-for="image in images"
        :key="image.id"
        :width="image.width"
        :height="image.height"
        class="gallery-cell"
      >
        <img
          :src="image.url"
          :alt="image.description"
          :width="image.width"
          :height="image.height"
        />
      </WaterfallCell>
    </WaterfallContainer>
    <button type="button" class="gallery-button" aria-label="倒序图片" @click="images.reverse()">倒序 <span aria-hidden="true">↔</span></button>
  </section>
</template>

<style scoped>
.gallery-demo { padding: 22px; border: 1px solid #e4e5dd; border-radius: 18px; background: #fff; }
h2 { margin: 0 0 18px; font-size: 16px; line-height: 1.5; font-weight: 600; }
.gallery-cell { border-radius: 10px; overflow: hidden; }
.gallery-cell img { display: block; width: 100%; height: 100%; object-fit: cover; }
.gallery-button { margin-top: 20px; display: flex; width: 100%; align-items: center; justify-content: space-between; padding: 11px 0 0; border: 0; border-top: 1px solid #eeeee8; background: transparent; color: #5d694a; font: inherit; font-size: 12px; cursor: pointer; }
.gallery-button:hover { color: #253c17; }
</style>

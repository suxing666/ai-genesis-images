<template>
  <div v-if="images.length > 0" class="results-container active">
    <h3 class="results-title">生成结果</h3>
    <div class="image-grid">
      <div
        v-for="(img, index) in images"
        :key="index"
        class="image-item"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <img :src="img.url || img" :alt="`生成的图片 ${index + 1}`">
        <div class="image-overlay">
          <a :href="img.url || img" :download="`image-${Date.now()}-${index + 1}.png`" class="download-btn">
            下载图片
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  images: { type: Array, default: () => [] },
});
</script>

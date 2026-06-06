<template>
  <div v-if="images.length > 0" class="results-container mt-10 border-t-4 border-ink pt-8">
    <h3 class="mb-6 font-display text-base text-ink md:text-lg">生成结果</h3>
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(img, index) in images"
        :key="index"
        class="group pixel-card relative overflow-hidden transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_#ff77a8]"
      >
        <img :src="img.url || img" :alt="`生成的图片 ${index + 1}`" class="block w-full">
        <div class="absolute inset-0 flex items-end justify-center bg-bg/80 p-5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <a
            :href="img.url || img"
            :download="`image-${Date.now()}-${index + 1}.png`"
            class="pixel-btn pixel-btn-yellow px-4 py-2 text-xs no-underline"
          >下载图片</a>
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

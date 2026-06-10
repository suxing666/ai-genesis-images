<template>
  <div v-if="images.length > 0" class="results-container mt-10 border-t border-line pt-8">
    <h3 class="mb-6 text-lg font-semibold text-ink">生成结果</h3>
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(img, index) in images"
        :key="index"
        class="group card card-interactive relative overflow-hidden"
      >
        <img :src="img.url || img" :alt="`生成的图片 ${index + 1}`" class="block w-full">
        <div class="absolute inset-0 flex items-end justify-center bg-ink/60 p-5 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
          <a
            :href="img.url || img"
            :download="`image-${Date.now()}-${index + 1}.png`"
            class="btn btn-primary h-9 px-4 text-sm no-underline"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
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

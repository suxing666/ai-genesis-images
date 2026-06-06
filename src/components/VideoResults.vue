<template>
  <div v-if="videoUrl" class="results-container mt-10 border-t-4 border-ink pt-8">
    <h3 class="mb-6 font-display text-base text-ink md:text-lg">生成结果</h3>
    <div class="mx-auto max-w-3xl">
      <div class="pixel-card overflow-hidden">
        <video controls preload="metadata" class="block w-full">
          <source :src="videoUrl" type="video/mp4">
          您的浏览器不支持视频播放
        </video>
      </div>
      <div class="mt-5 text-center">
        <a
          :href="videoUrl"
          :download="`generated-video-${Date.now()}.mp4`"
          class="pixel-btn pixel-btn-yellow px-5 py-2 text-xs no-underline"
        >下载视频</a>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  videoUrl: { type: String, default: null },
});
</script>

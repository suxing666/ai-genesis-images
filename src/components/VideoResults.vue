<template>
  <div v-if="videoUrl" class="results-container mt-10 border-t border-line pt-8">
    <h3 class="mb-6 text-lg font-semibold text-ink">生成结果</h3>
    <div class="mx-auto max-w-3xl">
      <div class="card overflow-hidden">
        <video controls preload="metadata" class="block w-full">
          <source :src="videoUrl" type="video/mp4">
          您的浏览器不支持视频播放
        </video>
      </div>
      <div class="mt-5 text-center">
        <a
          :href="videoUrl"
          :download="`generated-video-${Date.now()}.mp4`"
          class="btn btn-secondary h-10 px-5 text-sm no-underline"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          下载视频
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  videoUrl: { type: String, default: null },
});
</script>

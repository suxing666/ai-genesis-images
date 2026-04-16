<template>
  <div v-if="videoUrl" class="results-container active">
    <h3 class="results-title">生成结果</h3>
    <div class="video-container">
      <div class="video-wrapper">
        <video controls preload="metadata">
          <source :src="videoUrl" type="video/mp4">
          您的浏览器不支持视频播放
        </video>
      </div>
      <div class="video-actions">
        <a :href="videoUrl" :download="`generated-video-${Date.now()}.mp4`" class="download-btn">
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

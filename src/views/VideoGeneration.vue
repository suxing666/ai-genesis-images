<template>
  <section class="panel">
    <div class="pixel-card p-5 md:p-8">
      <div class="card-header mb-6 flex items-center gap-3 md:mb-8">
        <span class="h-6 w-6 border-2 border-ink bg-[#29adff]"></span>
        <h2 class="font-display text-base text-ink md:text-lg">视频创作</h2>
      </div>

      <div class="form-container">
        <!-- 提示词 -->
        <div class="mb-6">
          <label class="mb-2 block font-pixel text-xs uppercase tracking-[0.15em] text-ink">描述你的创意</label>
          <textarea
            v-model="prompt"
            rows="4"
            class="pixel-input resize-none leading-relaxed"
            placeholder="例如：海浪轻柔地拍打着金色沙滩，夕阳将天空染成橙红色，海鸥在远处飞翔"
          ></textarea>
        </div>

        <!-- 首帧 / 尾帧 -->
        <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="flex flex-col">
            <label class="mb-2 flex items-center gap-2 font-pixel text-xs uppercase tracking-[0.15em] text-ink">
              首帧图片
              <span class="border-2 border-ink bg-[#29adff] px-1.5 py-0.5 text-[0.625rem] text-white">可选</span>
            </label>
            <FileUpload
              v-model="firstFrameData"
              label="拖拽或点击上传首帧"
              hint="设置视频的起始画面"
            />
          </div>
          <div class="flex flex-col">
            <label class="mb-2 flex items-center gap-2 font-pixel text-xs uppercase tracking-[0.15em] text-ink">
              尾帧图片
              <span class="border-2 border-ink bg-[#29adff] px-1.5 py-0.5 text-[0.625rem] text-white">可选</span>
            </label>
            <FileUpload
              v-model="lastFrameData"
              label="拖拽或点击上传尾帧"
              hint="设置视频的结束画面"
            />
          </div>
        </div>

        <!-- 参数 -->
        <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-2 block font-pixel text-xs uppercase tracking-[0.15em] text-ink">时长</label>
            <select v-model="duration" class="pixel-select">
              <option value="5">5 秒</option>
              <option value="10">10 秒</option>
              <option value="15">15 秒</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block font-pixel text-xs uppercase tracking-[0.15em] text-ink">分辨率</label>
            <select v-model="resolution" class="pixel-select">
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </select>
          </div>
        </div>

        <!-- 生成按钮 -->
        <button class="pixel-btn pixel-btn-red w-full py-4 text-sm" :disabled="isLoading" @click="generateVideo">
          <span>开始创作</span>
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-show="isLoading" class="loading-state py-10 text-center">
        <div class="pixel-spinner mb-6">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="pixel-blink font-pixel text-sm text-ink">正在生成视频，请稍候...</p>
      </div>

      <!-- 结果 -->
      <VideoResults :video-url="videoUrl" />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useConfigStore } from '../stores/config.js';
import { useNotification } from '../composables/useNotification.js';
import FileUpload from '../components/FileUpload.vue';
import VideoResults from '../components/VideoResults.vue';

const configStore = useConfigStore();
const { showNotification } = useNotification();

const prompt = ref('');
const duration = ref('5');
const resolution = ref('720p');
const firstFrameData = ref(null);
const lastFrameData = ref(null);
const isLoading = ref(false);
const videoUrl = ref(null);

async function generateVideo() {
  const text = prompt.value.trim();

  if (!text) {
    showNotification('请输入视频描述', 'error');
    return;
  }

  if (!configStore.videoEndpoint || !configStore.videoApiKey) {
    showNotification('请先配置视频生成 API', 'error');
    return;
  }

  isLoading.value = true;
  videoUrl.value = null;

  try {
    const requestBody = {
      prompt: text,
      duration: parseInt(duration.value),
      resolution: resolution.value,
    };

    if (firstFrameData.value) {
      requestBody.first_frame_image = firstFrameData.value;
    }
    if (lastFrameData.value) {
      requestBody.last_frame_image = lastFrameData.value;
    }

    const response = await fetch(configStore.videoEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${configStore.videoApiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(configStore.timeout),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || `API 请求失败: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    videoUrl.value = data.url || data.video_url || data.output;

    if (!videoUrl.value) {
      showNotification('未生成视频', 'error');
    }
  } catch (error) {
    console.error('生成视频失败:', error);
    showNotification(`生成失败: ${error.message}`, 'error');
  } finally {
    isLoading.value = false;
  }
}
</script>

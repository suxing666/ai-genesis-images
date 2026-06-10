<template>
  <section class="panel">
    <div class="card p-6 md:p-8">
      <div class="mb-7 flex items-center gap-3 md:mb-8">
        <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-muted text-accent">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="5" width="14" height="14" rx="2"></rect>
            <path d="m22 8-6 4 6 4V8z"></path>
          </svg>
        </span>
        <h2 class="text-lg font-semibold text-ink md:text-xl">视频创作</h2>
      </div>

      <div class="form-container">
        <!-- 提示词 -->
        <div class="mb-6">
          <label class="field-label mb-2">描述你的创意</label>
          <textarea
            v-model="prompt"
            rows="4"
            class="input resize-none leading-relaxed"
            placeholder="例如：海浪轻柔地拍打着金色沙滩，夕阳将天空染成橙红色，海鸥在远处飞翔"
          ></textarea>
        </div>

        <!-- 首帧 / 尾帧 -->
        <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="flex flex-col">
            <label class="field-label mb-2 flex items-center gap-2">
              首帧图片
              <span class="badge">可选</span>
            </label>
            <FileUpload
              v-model="firstFrameData"
              label="拖拽或点击上传首帧"
              hint="设置视频的起始画面"
            />
          </div>
          <div class="flex flex-col">
            <label class="field-label mb-2 flex items-center gap-2">
              尾帧图片
              <span class="badge">可选</span>
            </label>
            <FileUpload
              v-model="lastFrameData"
              label="拖拽或点击上传尾帧"
              hint="设置视频的结束画面"
            />
          </div>
        </div>

        <!-- 参数 -->
        <div class="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="field-label mb-2">时长</label>
            <select v-model="duration" class="select num">
              <option value="5">5 秒</option>
              <option value="10">10 秒</option>
              <option value="15">15 秒</option>
            </select>
          </div>
          <div>
            <label class="field-label mb-2">分辨率</label>
            <select v-model="resolution" class="select num">
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </select>
          </div>
        </div>

        <!-- 生成按钮 -->
        <button class="btn btn-primary h-12 w-full text-md" :disabled="isLoading" @click="generateVideo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4"></path><path d="M13 3 16 9l6 3-6 3-3 6-3-6-6-3 6-3 3-6Z"></path></svg>
          <span>开始创作</span>
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-show="isLoading" class="py-12 text-center">
        <div class="spinner mx-auto mb-5"></div>
        <p class="text-sm text-ink-soft">正在生成视频，请稍候...</p>
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

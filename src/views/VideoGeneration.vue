<template>
  <section class="panel active">
    <div class="panel-card">
      <div class="card-header">
        <h2>视频创作</h2>
      </div>

      <div class="form-container">
        <!-- 提示词 -->
        <div class="input-wrapper">
          <label class="input-label">描述你的创意</label>
          <textarea
            v-model="prompt"
            rows="4"
            placeholder="例如：海浪轻柔地拍打着金色沙滩，夕阳将天空染成橙红色，海鸥在远处飞翔"
          ></textarea>
        </div>

        <!-- 首帧 / 尾帧 -->
        <div class="frame-inputs">
          <div class="frame-item">
            <label class="input-label">首帧图片 <span class="optional-tag">可选</span></label>
            <FileUpload
              v-model="firstFrameData"
              label="拖拽或点击上传首帧"
              hint="设置视频的起始画面"
            />
          </div>
          <div class="frame-item">
            <label class="input-label">尾帧图片 <span class="optional-tag">可选</span></label>
            <FileUpload
              v-model="lastFrameData"
              label="拖拽或点击上传尾帧"
              hint="设置视频的结束画面"
            />
          </div>
        </div>

        <!-- 参数 -->
        <div class="params-grid">
          <div class="param-item">
            <label>时长</label>
            <select v-model="duration">
              <option value="5">5 秒</option>
              <option value="10">10 秒</option>
              <option value="15">15 秒</option>
            </select>
          </div>
          <div class="param-item">
            <label>分辨率</label>
            <select v-model="resolution">
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </select>
          </div>
        </div>

        <!-- 生成按钮 -->
        <button class="generate-btn" :disabled="isLoading" @click="generateVideo">
          <span class="btn-text">开始创作</span>
        </button>
      </div>

      <!-- 加载状态 -->
      <div class="loading-state" :class="{ active: isLoading }">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">正在生成视频，请稍候...</p>
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

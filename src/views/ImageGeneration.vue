<template>
  <section class="panel active">
    <div class="panel-card">
      <div class="card-header">
        <h2>图片创作</h2>
      </div>

      <div class="form-container">
        <!-- 模式切换 -->
        <div class="mode-switcher">
          <button
            class="mode-btn"
            :class="{ active: currentMode === 'text2img' }"
            @click="currentMode = 'text2img'"
          >文字生图</button>
          <button
            class="mode-btn"
            :class="{ active: currentMode === 'img2img' }"
            @click="currentMode = 'img2img'"
          >图生图</button>
        </div>

        <!-- 提示词 -->
        <div class="input-wrapper">
          <label class="input-label">描述你的创意</label>
          <textarea
            v-model="prompt"
            rows="4"
            placeholder="例如：一只优雅的黑猫坐在霓虹灯闪烁的东京街头，赛博朋克风格，电影级光影"
          ></textarea>
        </div>

        <!-- 参考图片（图生图模式） -->
        <div v-show="currentMode === 'img2img'" class="ref-image-section">
          <label class="input-label">参考图片</label>
          <FileUpload
            v-model="refImageData"
            label="拖拽或点击上传参考图片"
            hint="上传一张图片作为生成参考"
          />
        </div>

        <!-- 尺寸选择器 -->
        <SizeSelector v-model="selectedSize" />

        <!-- 风格选择器 -->
        <StyleSelector
          v-model="selectedStyle"
          @style-applied="onStyleApplied"
          @style-removed="onStyleRemoved"
        />

        <!-- 参数设置 -->
        <div class="params-grid">
          <div class="param-item">
            <label>数量</label>
            <select v-model="imageCount">
              <option value="1">1 张</option>
              <option value="2">2 张</option>
              <option value="4">4 张</option>
            </select>
          </div>
        </div>

        <!-- 生成按钮 -->
        <button class="generate-btn" :disabled="isLoading" @click="generateImage">
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
        <p class="loading-text">正在生成图片...</p>
      </div>

      <!-- 结果 -->
      <ImageResults :images="results" />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useNotification } from '../composables/useNotification.js';
import { generateImage as generateImageApi } from '../services/imageService.js';
import FileUpload from '../components/FileUpload.vue';
import SizeSelector from '../components/SizeSelector.vue';
import StyleSelector from '../components/StyleSelector.vue';
import ImageResults from '../components/ImageResults.vue';

const { showNotification } = useNotification();

const prompt = ref('');
const currentMode = ref('text2img');
const selectedSize = ref('1920x1080');
const selectedStyle = ref('');
const imageCount = ref('1');
const refImageData = ref(null);
const isLoading = ref(false);
const results = ref([]);

function onStyleApplied(stylePrompt) {
  const text = prompt.value.trim();
  if (!text) {
    prompt.value = stylePrompt;
  } else {
    prompt.value = text + ', ' + stylePrompt;
  }
}

function onStyleRemoved(stylePrompt) {
  if (!stylePrompt) return;
  const text = prompt.value;
  if (text.endsWith(', ' + stylePrompt)) {
    prompt.value = text.slice(0, -(', ' + stylePrompt).length);
  } else if (text === stylePrompt) {
    prompt.value = '';
  }
}

async function generateImage() {
  const text = prompt.value.trim();

  if (!text) {
    showNotification('请输入图片描述', 'error');
    return;
  }

  if (currentMode.value === 'img2img' && !refImageData.value) {
    showNotification('请上传参考图片', 'error');
    return;
  }

  isLoading.value = true;
  results.value = [];

  try {
    const result = await generateImageApi({
      prompt: text,
      size: selectedSize.value,
      n: parseInt(imageCount.value),
      style: selectedStyle.value,
      image: currentMode.value === 'img2img' ? refImageData.value : null,
    });

    results.value = result.images;

    if (results.value.length === 0) {
      showNotification('未生成任何图片', 'error');
    }
  } catch (error) {
    console.error('生成图片失败:', error);
    showNotification(`生成失败: ${error.message}`, 'error');
  } finally {
    isLoading.value = false;
  }
}
</script>

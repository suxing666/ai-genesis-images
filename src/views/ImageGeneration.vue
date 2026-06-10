<template>
  <section class="panel">
    <div class="card p-6 md:p-8">
      <div class="mb-7 flex items-center gap-3 md:mb-8">
        <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-muted text-accent">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </span>
        <h2 class="text-lg font-semibold text-ink md:text-xl">图片创作</h2>
      </div>

      <div class="form-container">
        <!-- 模式切换 -->
        <div class="mb-6 inline-flex w-full gap-1 rounded-full border border-line p-1 sm:w-auto">
          <button
            class="tab flex-1 justify-center sm:flex-initial sm:px-6"
            :class="currentMode === 'text2img' ? 'tab-active' : ''"
            @click="currentMode = 'text2img'"
          >文字生图</button>
          <button
            class="tab flex-1 justify-center sm:flex-initial sm:px-6"
            :class="currentMode === 'img2img' ? 'tab-active' : ''"
            @click="currentMode = 'img2img'"
          >图生图</button>
        </div>

        <!-- 提示词 -->
        <div class="mb-6">
          <label class="field-label mb-2">描述你的创意</label>
          <textarea
            v-model="prompt"
            rows="4"
            class="input resize-none leading-relaxed"
            placeholder="例如：一只优雅的黑猫坐在霓虹灯闪烁的东京街头，赛博朋克风格，电影级光影"
          ></textarea>
        </div>

        <!-- 参考图片（图生图模式） -->
        <div v-show="currentMode === 'img2img'" class="mb-6">
          <label class="field-label mb-2">参考图片</label>
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
        <div class="mb-7">
          <label class="field-label mb-2">数量</label>
          <select v-model="imageCount" class="select num sm:max-w-[14rem]">
            <option value="1">1 张</option>
            <option value="2">2 张</option>
            <option value="4">4 张</option>
          </select>
        </div>

        <!-- 生成按钮 -->
        <button class="btn btn-primary h-12 w-full text-md" :disabled="isLoading" @click="generateImage">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4"></path><path d="M13 3 16 9l6 3-6 3-3 6-3-6-6-3 6-3 3-6Z"></path></svg>
          <span>开始创作</span>
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-show="isLoading" class="py-12 text-center">
        <div class="spinner mx-auto mb-5"></div>
        <p class="text-sm text-ink-soft">正在生成图片...</p>
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

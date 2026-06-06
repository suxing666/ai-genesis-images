<template>
  <section class="panel">
    <div class="pixel-card p-5 md:p-8">
      <div class="card-header mb-6 flex items-center gap-3 md:mb-8">
        <span class="h-6 w-6 border-2 border-ink bg-[#ff004d]"></span>
        <h2 class="font-display text-base text-ink md:text-lg">图片创作</h2>
      </div>

      <div class="form-container">
        <!-- 模式切换 -->
        <div class="mb-6 grid grid-cols-2 gap-3">
          <button
            class="pixel-btn py-3 text-xs"
            :class="currentMode === 'text2img' ? 'bg-[#ffec27] text-bg' : 'bg-surface text-ink'"
            @click="currentMode = 'text2img'"
          >文字生图</button>
          <button
            class="pixel-btn py-3 text-xs"
            :class="currentMode === 'img2img' ? 'bg-[#ffec27] text-bg' : 'bg-surface text-ink'"
            @click="currentMode = 'img2img'"
          >图生图</button>
        </div>

        <!-- 提示词 -->
        <div class="mb-6">
          <label class="mb-2 block font-pixel text-xs uppercase tracking-[0.15em] text-ink">描述你的创意</label>
          <textarea
            v-model="prompt"
            rows="4"
            class="pixel-input resize-none leading-relaxed"
            placeholder="例如：一只优雅的黑猫坐在霓虹灯闪烁的东京街头，赛博朋克风格，电影级光影"
          ></textarea>
        </div>

        <!-- 参考图片（图生图模式） -->
        <div v-show="currentMode === 'img2img'" class="mb-6">
          <label class="mb-2 block font-pixel text-xs uppercase tracking-[0.15em] text-ink">参考图片</label>
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
        <div class="mb-6">
          <label class="mb-2 block font-pixel text-xs uppercase tracking-[0.15em] text-ink">数量</label>
          <select v-model="imageCount" class="pixel-select sm:max-w-[14rem]">
            <option value="1">1 张</option>
            <option value="2">2 张</option>
            <option value="4">4 张</option>
          </select>
        </div>

        <!-- 生成按钮 -->
        <button class="pixel-btn pixel-btn-red w-full py-4 text-sm" :disabled="isLoading" @click="generateImage">
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
        <p class="pixel-blink font-pixel text-sm text-ink">正在生成图片...</p>
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

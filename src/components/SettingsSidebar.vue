<template>
  <!-- 设置按钮（悬浮，可拖拽，useDraggable 依赖 .settings-btn 类名与 fixed 定位） -->
  <button
    ref="settingsBtnRef"
    class="settings-btn fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[color:var(--color-on-accent)] shadow-elevated transition-all duration-200 hover:bg-accent-hover hover:-translate-y-0.5"
    :class="{ 'pointer-events-none opacity-0': uiStore.settingsOpen }"
    aria-label="打开设置"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  </button>

  <!-- 侧边栏 -->
  <aside
    class="fixed right-0 top-0 z-[90] h-screen w-full max-w-[420px] overflow-y-auto border-l border-line bg-canvas shadow-elevated transition-transform duration-300"
    :class="uiStore.settingsOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="p-6 md:p-8">
      <div class="mb-7 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-ink md:text-xl">配置中心</h2>
        <button
          class="flex h-9 w-9 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-surface-hover hover:text-ink"
          aria-label="关闭侧边栏"
          @click="closeSidebar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- 图片 API 配置 -->
      <div class="mb-6 border-b border-line pb-6">
        <h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
          <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>图片生成 API
        </h3>
        <div class="mb-4">
          <label class="field-label mb-1.5">提供商</label>
          <select v-model="formImageProvider" class="select">
            <option value="generic">通用</option>
            <option value="openai">GPT (OpenAI)</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>
        <template v-if="formImageProvider === 'generic'">
          <div class="mb-4">
            <label class="field-label mb-1.5">API 端点</label>
            <input v-model="formImageEndpoint" type="text" class="input num text-sm" placeholder="https://api.openai.com/v1/images/generations">
          </div>
          <div class="mb-4">
            <label class="field-label mb-1.5">API 密钥</label>
            <input v-model="formImageApiKey" type="password" class="input num text-sm" placeholder="sk-...">
          </div>
        </template>
        <template v-else-if="formImageProvider === 'openai'">
          <div class="mb-4">
            <label class="field-label mb-1.5">API 端点</label>
            <input v-model="formOpenaiEndpoint" type="text" class="input num text-sm" placeholder="https://api.openai.com">
          </div>
          <div class="mb-4">
            <label class="field-label mb-1.5">API 密钥</label>
            <input v-model="formOpenaiApiKey" type="password" class="input num text-sm" placeholder="sk-...">
          </div>
          <div class="mb-4">
            <label class="field-label mb-1.5">模型</label>
            <select v-model="formOpenaiImageModel" class="select num text-sm">
              <option value="gpt-image-2">gpt-image-2</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="field-label mb-1.5">质量</label>
            <select v-model="formOpenaiQuality" class="select num text-sm">
              <option value="auto">自动</option>
              <option value="low">低（最快）</option>
              <option value="medium">中</option>
              <option value="high">高（最慢，启用推理）</option>
            </select>
          </div>
        </template>
        <template v-else>
          <div class="mb-4">
            <label class="field-label mb-1.5">API 端点</label>
            <input v-model="formGeminiEndpoint" type="text" class="input num text-sm" placeholder="https://generativelanguage.googleapis.com">
          </div>
          <div class="mb-4">
            <label class="field-label mb-1.5">API 密钥</label>
            <input v-model="formGeminiApiKey" type="password" class="input num text-sm" placeholder="AIza...">
          </div>
          <div class="mb-4">
            <label class="field-label mb-1.5">模型</label>
            <select v-model="formGeminiImageModel" class="select num text-sm">
              <option value="gemini-3-pro-image">gemini-3-pro-image（Nano Banana Pro）</option>
              <option value="gemini-3.1-flash-image">gemini-3.1-flash-image（Nano Banana 2）</option>
              <option value="gemini-2.5-flash-image">gemini-2.5-flash-image（Nano Banana）</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="field-label mb-1.5">分辨率</label>
            <select v-model="formGeminiResolution" class="select num text-sm">
              <option value="auto">自动</option>
              <option value="1K">1K</option>
              <option value="2K">2K</option>
              <option value="4K">4K（仅 3.x 模型）</option>
            </select>
          </div>
        </template>
      </div>

      <!-- 视频 API 配置 -->
      <div class="mb-6 border-b border-line pb-6">
        <h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
          <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>视频生成 API
        </h3>
        <div class="mb-4">
          <label class="field-label mb-1.5">API 端点</label>
          <input v-model="formVideoEndpoint" type="text" class="input num text-sm" placeholder="https://api.runwayml.com/v1/generate">
        </div>
        <div class="mb-4">
          <label class="field-label mb-1.5">API 密钥</label>
          <input v-model="formVideoApiKey" type="password" class="input num text-sm" placeholder="your-api-key">
        </div>
      </div>

      <!-- 高级设置 -->
      <div class="mb-6 border-b border-line pb-6">
        <h3 class="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
          <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>高级设置
        </h3>
        <div>
          <label class="field-label mb-1.5">请求超时（秒）</label>
          <div class="relative">
            <input
              v-model.number="formTimeout"
              type="number"
              min="1"
              max="600"
              class="input num pr-14 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            >
            <div class="absolute bottom-1 right-1 top-1 flex w-10 flex-col overflow-hidden rounded-md border border-line">
              <button type="button" class="flex flex-1 items-center justify-center text-ink-soft transition-colors hover:bg-accent-muted hover:text-accent" aria-label="增加" @click="formTimeout = Math.min(600, formTimeout + 1)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
              <button type="button" class="flex flex-1 items-center justify-center border-t border-line text-ink-soft transition-colors hover:bg-accent-muted hover:text-accent" aria-label="减少" @click="formTimeout = Math.max(1, formTimeout - 1)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <button class="btn btn-primary mb-3 h-11 w-full" @click="saveSettings">保存配置</button>
      <button class="btn btn-danger h-11 w-full" @click="clearCache">清空缓存</button>

      <div class="mt-5 flex items-start gap-2.5 rounded-md border border-line bg-canvas-2 p-3 text-xs leading-relaxed text-ink-soft">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mt-0.5 flex-shrink-0 text-ink-muted">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span>配置将保存在浏览器本地存储中</span>
      </div>
    </div>
  </aside>

  <!-- 遮罩层 -->
  <div
    class="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm transition-opacity duration-300"
    :class="uiStore.settingsOpen ? 'opacity-100' : 'pointer-events-none opacity-0'"
    @click="closeSidebar"
  ></div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useConfigStore } from '../stores/config.js';
import { useUiStore } from '../stores/ui.js';
import { useNotification } from '../composables/useNotification.js';
import { useDraggable } from '../composables/useDraggable.js';

const configStore = useConfigStore();
const uiStore = useUiStore();
const { showNotification } = useNotification();

const settingsBtnRef = ref(null);

// 表单字段
const formImageEndpoint = ref('');
const formImageApiKey = ref('');
const formVideoEndpoint = ref('');
const formVideoApiKey = ref('');
const formTimeout = ref(60);
const formImageProvider = ref('generic');
const formOpenaiEndpoint = ref('');
const formOpenaiApiKey = ref('');
const formOpenaiImageModel = ref('gpt-image-2');
const formOpenaiQuality = ref('auto');
const formGeminiEndpoint = ref('');
const formGeminiApiKey = ref('');
const formGeminiImageModel = ref('gemini-2.5-flash-image');
const formGeminiResolution = ref('auto');

// 从 store 加载当前值到表单
function loadForm() {
  configStore.loadFromStorage();
  formImageEndpoint.value = configStore.imageEndpoint;
  formImageApiKey.value = configStore.imageApiKey;
  formVideoEndpoint.value = configStore.videoEndpoint;
  formVideoApiKey.value = configStore.videoApiKey;
  formTimeout.value = configStore.timeout / 1000;
  formImageProvider.value = configStore.imageProvider;
  formOpenaiEndpoint.value = configStore.openaiEndpoint;
  formOpenaiApiKey.value = configStore.openaiApiKey;
  formOpenaiImageModel.value = configStore.openaiImageModel;
  formOpenaiQuality.value = configStore.openaiQuality;
  formGeminiEndpoint.value = configStore.geminiEndpoint;
  formGeminiApiKey.value = configStore.geminiApiKey;
  formGeminiImageModel.value = configStore.geminiImageModel;
  formGeminiResolution.value = configStore.geminiResolution;
}

// 监听全局开关：打开时回填表单并锁定背景滚动，关闭时复原
watch(
  () => uiStore.settingsOpen,
  (open) => {
    if (open) {
      loadForm();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
);

function closeSidebar() {
  uiStore.closeSettings();
}

function saveSettings() {
  configStore.imageEndpoint = formImageEndpoint.value;
  configStore.imageApiKey = formImageApiKey.value;
  configStore.videoEndpoint = formVideoEndpoint.value;
  configStore.videoApiKey = formVideoApiKey.value;
  configStore.timeout = formTimeout.value * 1000;
  configStore.imageProvider = formImageProvider.value;
  configStore.openaiEndpoint = formOpenaiEndpoint.value;
  configStore.openaiApiKey = formOpenaiApiKey.value;
  configStore.openaiImageModel = formOpenaiImageModel.value;
  configStore.openaiQuality = formOpenaiQuality.value;
  configStore.geminiEndpoint = formGeminiEndpoint.value;
  configStore.geminiApiKey = formGeminiApiKey.value;
  configStore.geminiImageModel = formGeminiImageModel.value;
  configStore.geminiResolution = formGeminiResolution.value;
  configStore.saveToStorage();
  showNotification('配置已保存', 'success');
  closeSidebar();
}

function clearCache() {
  if (confirm('确定要清空所有缓存吗？这将删除所有保存的配置和数据。')) {
    configStore.clearAll();
    showNotification('缓存已清空', 'success');
    closeSidebar();
    window.location.reload();
  }
}

// 初始化拖拽功能：单击悬浮按钮打开设置
useDraggable(settingsBtnRef, () => uiStore.openSettings());
</script>

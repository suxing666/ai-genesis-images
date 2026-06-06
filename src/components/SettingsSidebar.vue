<template>
  <!-- 设置按钮（悬浮，可拖拽，useDraggable 依赖 .settings-btn 类名与 fixed 定位） -->
  <button
    ref="settingsBtnRef"
    class="settings-btn fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center border-4 border-ink bg-[#ffec27] text-bg shadow-pixel transition-opacity duration-300"
    :class="{ 'pointer-events-none opacity-0': uiStore.settingsOpen }"
    aria-label="打开设置"
  >
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  </button>

  <!-- 侧边栏 -->
  <aside
    class="fixed right-0 top-0 z-[90] h-screen w-full max-w-[420px] overflow-y-auto border-l-4 border-ink bg-surface shadow-[-6px_0_0_var(--color-ink)] transition-transform duration-300"
    :class="uiStore.settingsOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="p-6 md:p-8">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="font-display text-base text-ink md:text-lg">配置中心</h2>
        <button
          class="flex h-9 w-9 items-center justify-center border-4 border-ink bg-surface text-ink shadow-pixel-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none cursor-pointer"
          aria-label="关闭侧边栏"
          @click="closeSidebar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- 图片 API 配置 -->
      <div class="mb-6 border-b-4 border-ink pb-6">
        <h3 class="mb-3 font-pixel text-xs uppercase tracking-[0.15em] text-ink">图片生成 API</h3>
        <div class="mb-4">
          <label class="mb-1.5 block font-pixel text-[0.6875rem] uppercase tracking-wider text-muted">提供商</label>
          <select v-model="formImageProvider" class="pixel-select">
            <option value="generic">通用</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>
        <template v-if="formImageProvider === 'generic'">
          <div class="mb-4">
            <label class="mb-1.5 block font-pixel text-[0.6875rem] uppercase tracking-wider text-muted">API 端点</label>
            <input v-model="formImageEndpoint" type="text" class="pixel-input" placeholder="https://api.openai.com/v1/images/generations">
          </div>
          <div class="mb-4">
            <label class="mb-1.5 block font-pixel text-[0.6875rem] uppercase tracking-wider text-muted">API 密钥</label>
            <input v-model="formImageApiKey" type="password" class="pixel-input" placeholder="sk-...">
          </div>
        </template>
        <template v-else>
          <div class="mb-4">
            <label class="mb-1.5 block font-pixel text-[0.6875rem] uppercase tracking-wider text-muted">API 端点</label>
            <input v-model="formGeminiEndpoint" type="text" class="pixel-input" placeholder="https://generativelanguage.googleapis.com">
          </div>
          <div class="mb-4">
            <label class="mb-1.5 block font-pixel text-[0.6875rem] uppercase tracking-wider text-muted">API 密钥</label>
            <input v-model="formGeminiApiKey" type="password" class="pixel-input" placeholder="AIza...">
          </div>
          <div class="mb-4">
            <label class="mb-1.5 block font-pixel text-[0.6875rem] uppercase tracking-wider text-muted">模型</label>
            <select v-model="formGeminiImageModel" class="pixel-select">
              <option value="gemini-2.0-flash-exp-image-generation">gemini-2.0-flash-exp-image-generation</option>
              <option value="gemini-2.5-flash-preview-image-generation">gemini-2.5-flash-preview-image-generation</option>
            </select>
          </div>
        </template>
      </div>

      <!-- 视频 API 配置 -->
      <div class="mb-6 border-b-4 border-ink pb-6">
        <h3 class="mb-3 font-pixel text-xs uppercase tracking-[0.15em] text-ink">视频生成 API</h3>
        <div class="mb-4">
          <label class="mb-1.5 block font-pixel text-[0.6875rem] uppercase tracking-wider text-muted">API 端点</label>
          <input v-model="formVideoEndpoint" type="text" class="pixel-input" placeholder="https://api.runwayml.com/v1/generate">
        </div>
        <div class="mb-4">
          <label class="mb-1.5 block font-pixel text-[0.6875rem] uppercase tracking-wider text-muted">API 密钥</label>
          <input v-model="formVideoApiKey" type="password" class="pixel-input" placeholder="your-api-key">
        </div>
      </div>

      <!-- 高级设置 -->
      <div class="mb-6 border-b-4 border-ink pb-6">
        <h3 class="mb-3 font-pixel text-xs uppercase tracking-[0.15em] text-ink">高级设置</h3>
        <div class="mb-4">
          <label class="mb-1.5 block font-pixel text-[0.6875rem] uppercase tracking-wider text-muted">请求超时（秒）</label>
          <div class="relative">
            <input
              v-model.number="formTimeout"
              type="number"
              min="1"
              max="600"
              class="pixel-input pr-12 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            >
            <div class="absolute right-0 top-0 flex h-full w-10 flex-col border-l-4 border-ink">
              <button type="button" class="increment flex flex-1 items-center justify-center bg-surface text-ink transition-colors hover:bg-[#ffec27] hover:text-bg" aria-label="增加" @click="formTimeout = Math.min(600, formTimeout + 1)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
              <button type="button" class="decrement flex flex-1 items-center justify-center border-t-2 border-ink bg-surface text-ink transition-colors hover:bg-[#ffec27] hover:text-bg" aria-label="减少" @click="formTimeout = Math.max(1, formTimeout - 1)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <button class="pixel-btn pixel-btn-red mb-3 w-full py-3 text-xs" @click="saveSettings">保存配置</button>
      <button
        class="mb-2 w-full cursor-pointer border-4 border-[#ff004d] bg-surface px-4 py-3 font-display text-xs uppercase tracking-wider text-[#ff004d] shadow-[4px_4px_0_#ff004d] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#ff004d] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
        @click="clearCache"
      >清空缓存</button>

      <div class="mt-4 flex items-start gap-2 border-2 border-ink bg-bg p-3 font-pixel text-[0.6875rem] text-ink">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mt-0.5 flex-shrink-0">
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
    class="fixed inset-0 z-[80] bg-bg/70 transition-opacity duration-300"
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
const formGeminiEndpoint = ref('https://generativelanguage.googleapis.com');
const formGeminiApiKey = ref('');
const formGeminiImageModel = ref('gemini-2.0-flash-exp-image-generation');

// 从 store 加载当前值到表单
function loadForm() {
  configStore.loadFromStorage();
  formImageEndpoint.value = configStore.imageEndpoint;
  formImageApiKey.value = configStore.imageApiKey;
  formVideoEndpoint.value = configStore.videoEndpoint;
  formVideoApiKey.value = configStore.videoApiKey;
  formTimeout.value = configStore.timeout / 1000;
  formImageProvider.value = configStore.imageProvider;
  formGeminiEndpoint.value = configStore.geminiEndpoint;
  formGeminiApiKey.value = configStore.geminiApiKey;
  formGeminiImageModel.value = configStore.geminiImageModel;
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
  configStore.geminiEndpoint = formGeminiEndpoint.value;
  configStore.geminiApiKey = formGeminiApiKey.value;
  configStore.geminiImageModel = formGeminiImageModel.value;
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

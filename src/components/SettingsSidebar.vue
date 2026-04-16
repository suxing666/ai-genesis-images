<template>
  <!-- 设置按钮 -->
  <button
    ref="settingsBtnRef"
    class="settings-btn"
    :class="{ hidden: isOpen }"
    aria-label="打开设置"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  </button>

  <!-- 侧边栏 -->
  <aside class="sidebar" :class="{ active: isOpen }">
    <div class="sidebar-content">
      <div class="sidebar-header">
        <h2>配置中心</h2>
        <button class="close-btn" aria-label="关闭侧边栏" @click="closeSidebar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- 图片 API 配置 -->
      <div class="config-section">
        <h3 class="section-title">图片生成 API</h3>
        <div class="input-group">
          <label>提供商</label>
          <select v-model="formImageProvider">
            <option value="generic">通用</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>
        <template v-if="formImageProvider === 'generic'">
          <div class="input-group">
            <label>API 端点</label>
            <input v-model="formImageEndpoint" type="text" placeholder="https://api.openai.com/v1/images/generations">
          </div>
          <div class="input-group">
            <label>API 密钥</label>
            <input v-model="formImageApiKey" type="password" placeholder="sk-...">
          </div>
        </template>
        <template v-else>
          <div class="input-group">
            <label>API 端点</label>
            <input v-model="formGeminiEndpoint" type="text" placeholder="https://generativelanguage.googleapis.com">
          </div>
          <div class="input-group">
            <label>API 密钥</label>
            <input v-model="formGeminiApiKey" type="password" placeholder="AIza...">
          </div>
          <div class="input-group">
            <label>模型</label>
            <select v-model="formGeminiImageModel">
              <option value="gemini-2.0-flash-exp-image-generation">gemini-2.0-flash-exp-image-generation</option>
              <option value="gemini-2.5-flash-preview-image-generation">gemini-2.5-flash-preview-image-generation</option>
            </select>
          </div>
        </template>
      </div>

      <!-- 视频 API 配置 -->
      <div class="config-section">
        <h3 class="section-title">视频生成 API</h3>
        <div class="input-group">
          <label>API 端点</label>
          <input v-model="formVideoEndpoint" type="text" placeholder="https://api.runwayml.com/v1/generate">
        </div>
        <div class="input-group">
          <label>API 密钥</label>
          <input v-model="formVideoApiKey" type="password" placeholder="your-api-key">
        </div>
      </div>

      <!-- 高级设置 -->
      <div class="config-section">
        <h3 class="section-title">高级设置</h3>
        <div class="input-group">
          <label>请求超时（秒）</label>
          <div class="number-input-wrapper">
            <input v-model.number="formTimeout" type="number" min="1" max="600">
            <div class="number-controls">
              <button type="button" class="increment" aria-label="增加" @click="formTimeout = Math.min(600, formTimeout + 1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
              <button type="button" class="decrement" aria-label="减少" @click="formTimeout = Math.max(1, formTimeout - 1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <button class="btn-primary" @click="saveSettings">保存配置</button>
      <button class="btn-danger" @click="clearCache">清空缓存</button>

      <div class="info-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span>配置将保存在浏览器本地存储中</span>
      </div>
    </div>
  </aside>

  <!-- 遮罩层 -->
  <div class="overlay" :class="{ active: isOpen }" @click="closeSidebar"></div>
</template>

<script setup>
import { ref } from 'vue';
import { useConfigStore } from '../stores/config.js';
import { useNotification } from '../composables/useNotification.js';
import { useDraggable } from '../composables/useDraggable.js';

const configStore = useConfigStore();
const { showNotification } = useNotification();

const isOpen = ref(false);
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

function openSidebar() {
  // 从 store 加载当前值到表单
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

  isOpen.value = true;
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  isOpen.value = false;
  document.body.style.overflow = '';
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

// 初始化拖拽功能
useDraggable(settingsBtnRef, openSidebar);
</script>

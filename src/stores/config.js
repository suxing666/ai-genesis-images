import { defineStore } from 'pinia';
import { ref } from 'vue';

const GEMINI_DEFAULT_MODEL = 'gemini-2.5-flash-image';
const OPENAI_DEFAULT_MODEL = 'gpt-image-2';

// 旧版/已废弃的 Gemini 模型名 → 现行模型，避免历史配置卡在不可用模型上
const DEPRECATED_GEMINI_MODELS = {
  'gemini-2.0-flash-exp-image-generation': GEMINI_DEFAULT_MODEL,
  'gemini-2.5-flash-preview-image-generation': GEMINI_DEFAULT_MODEL,
};

function migrateGeminiModel(name) {
  if (!name) return GEMINI_DEFAULT_MODEL;
  return DEPRECATED_GEMINI_MODELS[name] || name;
}

export const useConfigStore = defineStore('config', () => {
  const imageEndpoint = ref('');
  const imageApiKey = ref('');
  const videoEndpoint = ref('');
  const videoApiKey = ref('');
  const timeout = ref(60000);

  // 图片提供商：'generic'（通用 OpenAI 兼容）| 'openai'（GPT Image）| 'gemini'
  const imageProvider = ref('generic');

  // OpenAI (GPT Image) 相关配置
  const openaiEndpoint = ref(''); // 留空则使用官方地址 https://api.openai.com
  const openaiApiKey = ref('');
  const openaiImageModel = ref(OPENAI_DEFAULT_MODEL);
  const openaiQuality = ref('auto'); // 'auto' | 'low' | 'medium' | 'high'

  // Gemini 相关配置
  const geminiEndpoint = ref(''); // 留空则使用官方地址 https://generativelanguage.googleapis.com
  const geminiApiKey = ref('');
  const geminiImageModel = ref(GEMINI_DEFAULT_MODEL);
  const geminiResolution = ref('auto'); // 'auto' | '1K' | '2K' | '4K'（仅 3.x 模型支持）

  function loadFromStorage() {
    const raw = JSON.parse(localStorage.getItem('apiConfig') || '{}');
    imageEndpoint.value = raw.imageEndpoint || '';
    imageApiKey.value = raw.imageApiKey || '';
    videoEndpoint.value = raw.videoEndpoint || '';
    videoApiKey.value = raw.videoApiKey || '';
    timeout.value = raw.timeout || 60000;
    imageProvider.value = raw.imageProvider || 'generic';
    openaiEndpoint.value = raw.openaiEndpoint || '';
    openaiApiKey.value = raw.openaiApiKey || '';
    openaiImageModel.value = raw.openaiImageModel || OPENAI_DEFAULT_MODEL;
    openaiQuality.value = raw.openaiQuality || 'auto';
    geminiEndpoint.value = raw.geminiEndpoint || '';
    geminiApiKey.value = raw.geminiApiKey || '';
    geminiImageModel.value = migrateGeminiModel(raw.geminiImageModel);
    geminiResolution.value = raw.geminiResolution || 'auto';
  }

  function saveToStorage() {
    localStorage.setItem('apiConfig', JSON.stringify({
      imageEndpoint: imageEndpoint.value,
      imageApiKey: imageApiKey.value,
      videoEndpoint: videoEndpoint.value,
      videoApiKey: videoApiKey.value,
      timeout: timeout.value,
      imageProvider: imageProvider.value,
      openaiEndpoint: openaiEndpoint.value,
      openaiApiKey: openaiApiKey.value,
      openaiImageModel: openaiImageModel.value,
      openaiQuality: openaiQuality.value,
      geminiEndpoint: geminiEndpoint.value,
      geminiApiKey: geminiApiKey.value,
      geminiImageModel: geminiImageModel.value,
      geminiResolution: geminiResolution.value,
    }));
  }

  function clearAll() {
    localStorage.clear();
    imageEndpoint.value = '';
    imageApiKey.value = '';
    videoEndpoint.value = '';
    videoApiKey.value = '';
    timeout.value = 60000;
    imageProvider.value = 'generic';
    openaiEndpoint.value = '';
    openaiApiKey.value = '';
    openaiImageModel.value = OPENAI_DEFAULT_MODEL;
    openaiQuality.value = 'auto';
    geminiEndpoint.value = '';
    geminiApiKey.value = '';
    geminiImageModel.value = GEMINI_DEFAULT_MODEL;
    geminiResolution.value = 'auto';
  }

  // 初始化时从 localStorage 加载
  loadFromStorage();

  return {
    imageEndpoint,
    imageApiKey,
    videoEndpoint,
    videoApiKey,
    timeout,
    imageProvider,
    openaiEndpoint,
    openaiApiKey,
    openaiImageModel,
    openaiQuality,
    geminiEndpoint,
    geminiApiKey,
    geminiImageModel,
    geminiResolution,
    loadFromStorage,
    saveToStorage,
    clearAll,
  };
});

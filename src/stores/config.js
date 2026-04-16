import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfigStore = defineStore('config', () => {
  const imageEndpoint = ref('');
  const imageApiKey = ref('');
  const videoEndpoint = ref('');
  const videoApiKey = ref('');
  const timeout = ref(60000);

  // Gemini 相关配置
  const imageProvider = ref('generic');  // 'generic' | 'gemini'
  const geminiEndpoint = ref('https://generativelanguage.googleapis.com');
  const geminiApiKey = ref('');
  const geminiImageModel = ref('gemini-2.0-flash-exp-image-generation');

  function loadFromStorage() {
    const raw = JSON.parse(localStorage.getItem('apiConfig') || '{}');
    imageEndpoint.value = raw.imageEndpoint || '';
    imageApiKey.value = raw.imageApiKey || '';
    videoEndpoint.value = raw.videoEndpoint || '';
    videoApiKey.value = raw.videoApiKey || '';
    timeout.value = raw.timeout || 60000;
    imageProvider.value = raw.imageProvider || 'generic';
    geminiEndpoint.value = raw.geminiEndpoint || 'https://generativelanguage.googleapis.com';
    geminiApiKey.value = raw.geminiApiKey || '';
    geminiImageModel.value = raw.geminiImageModel || 'gemini-2.0-flash-exp-image-generation';
  }

  function saveToStorage() {
    localStorage.setItem('apiConfig', JSON.stringify({
      imageEndpoint: imageEndpoint.value,
      imageApiKey: imageApiKey.value,
      videoEndpoint: videoEndpoint.value,
      videoApiKey: videoApiKey.value,
      timeout: timeout.value,
      imageProvider: imageProvider.value,
      geminiEndpoint: geminiEndpoint.value,
      geminiApiKey: geminiApiKey.value,
      geminiImageModel: geminiImageModel.value,
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
    geminiEndpoint.value = 'https://generativelanguage.googleapis.com';
    geminiApiKey.value = '';
    geminiImageModel.value = 'gemini-2.0-flash-exp-image-generation';
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
    geminiEndpoint,
    geminiApiKey,
    geminiImageModel,
    loadFromStorage,
    saveToStorage,
    clearAll,
  };
});

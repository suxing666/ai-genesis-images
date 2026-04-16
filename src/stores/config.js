import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfigStore = defineStore('config', () => {
  const imageEndpoint = ref('');
  const imageApiKey = ref('');
  const videoEndpoint = ref('');
  const videoApiKey = ref('');
  const timeout = ref(60000);

  function loadFromStorage() {
    const raw = JSON.parse(localStorage.getItem('apiConfig') || '{}');
    imageEndpoint.value = raw.imageEndpoint || '';
    imageApiKey.value = raw.imageApiKey || '';
    videoEndpoint.value = raw.videoEndpoint || '';
    videoApiKey.value = raw.videoApiKey || '';
    timeout.value = raw.timeout || 60000;
  }

  function saveToStorage() {
    localStorage.setItem('apiConfig', JSON.stringify({
      imageEndpoint: imageEndpoint.value,
      imageApiKey: imageApiKey.value,
      videoEndpoint: videoEndpoint.value,
      videoApiKey: videoApiKey.value,
      timeout: timeout.value,
    }));
  }

  function clearAll() {
    localStorage.clear();
    imageEndpoint.value = '';
    imageApiKey.value = '';
    videoEndpoint.value = '';
    videoApiKey.value = '';
    timeout.value = 60000;
  }

  // 初始化时从 localStorage 加载
  loadFromStorage();

  return {
    imageEndpoint,
    imageApiKey,
    videoEndpoint,
    videoApiKey,
    timeout,
    loadFromStorage,
    saveToStorage,
    clearAll,
  };
});

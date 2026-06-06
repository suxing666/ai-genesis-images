import { defineStore } from 'pinia';
import { ref } from 'vue';

// 全局 UI 状态：设置侧边栏开关。
// 让顶部导航的"设置"按钮与悬浮 FAB 共用同一开关，SettingsSidebar 监听此状态。
export const useUiStore = defineStore('ui', () => {
  const settingsOpen = ref(false);

  function openSettings() {
    settingsOpen.value = true;
  }

  function closeSettings() {
    settingsOpen.value = false;
  }

  return {
    settingsOpen,
    openSettings,
    closeSettings,
  };
});

<template>
  <nav class="sticky top-0 z-[70] border-b border-line bg-surface/85 px-4 py-3 backdrop-blur-md md:px-8">
    <div class="mx-auto flex max-w-5xl items-center justify-between gap-3">
      <!-- 品牌 Logo（衬线品牌时刻） -->
      <RouterLink
        to="/"
        class="display text-lg font-semibold tracking-tight text-ink no-underline transition-colors hover:text-accent md:text-xl"
      >Genesis</RouterLink>

      <!-- 导航项 -->
      <div class="flex items-center gap-1 md:gap-1.5">
        <RouterLink
          to="/image"
          class="tab no-underline"
          :class="route.path === '/image' ? 'tab-active' : ''"
        >图片</RouterLink>
        <RouterLink
          to="/video"
          class="tab no-underline"
          :class="route.path === '/video' ? 'tab-active' : ''"
        >视频</RouterLink>
        <button
          type="button"
          class="tab"
          aria-label="打开设置"
          @click="uiStore.openSettings()"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <span class="hidden sm:inline">设置</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useUiStore } from '../stores/ui.js';

const route = useRoute();
const uiStore = useUiStore();
</script>

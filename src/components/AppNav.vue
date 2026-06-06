<template>
  <nav class="sticky top-0 z-[70] border-b-4 border-ink bg-surface px-4 py-3 md:px-8">
    <div class="mx-auto flex max-w-5xl items-center justify-between gap-3">
      <!-- 品牌 Logo -->
      <RouterLink
        to="/"
        class="logo-link font-display text-base tracking-wider text-ink no-underline md:text-lg"
        style="text-shadow: 2px 2px 0 #ff004d, 4px 4px 0 #29adff;"
      >GENESIS</RouterLink>

      <!-- 导航项 -->
      <div class="flex items-center gap-2 md:gap-3">
        <RouterLink
          to="/image"
          class="pixel-tab text-xs no-underline"
          :class="route.path === '/image' ? 'pixel-tab-active' : ''"
        >图片</RouterLink>
        <RouterLink
          to="/video"
          class="pixel-tab text-xs no-underline"
          :class="route.path === '/video' ? 'pixel-tab-active' : ''"
        >视频</RouterLink>
        <button
          type="button"
          class="pixel-tab text-xs"
          aria-label="打开设置"
          @click="uiStore.openSettings()"
        >设置</button>
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

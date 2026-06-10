<template>
  <div class="home">
    <!-- Hero（复用品牌头） -->
    <AppHeader />

    <!-- 介绍 -->
    <section class="mx-auto mb-14 max-w-3xl md:mb-20">
      <div class="card p-6 md:p-8">
        <p class="text-base leading-relaxed text-ink-soft md:text-md">
          GENESIS 是一个 AI 驱动的视觉创作实验室。在这里，你可以用一句话生成精美图片，
          也可以让静态画面动起来变成视频。内置多种尺寸与风格预设，并支持接入你自己的 API，
          全程温暖、克制、专注创作本身。
        </p>
        <div class="mt-5 flex flex-wrap gap-2">
          <span class="badge-neutral num inline-flex items-center rounded-full px-2.5 py-1 text-2xs font-semibold uppercase tracking-wider">文字生图</span>
          <span class="badge-neutral num inline-flex items-center rounded-full px-2.5 py-1 text-2xs font-semibold uppercase tracking-wider">图生图</span>
          <span class="badge-neutral num inline-flex items-center rounded-full px-2.5 py-1 text-2xs font-semibold uppercase tracking-wider">AI Studio</span>
        </div>
      </div>
    </section>

    <!-- 两个入口 -->
    <section class="mb-16 md:mb-24">
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        <!-- 图片生成入口 -->
        <RouterLink to="/image" class="group block no-underline">
          <div class="card card-interactive flex h-full flex-col p-6 md:p-8">
            <span class="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-muted text-accent">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </span>
            <h2 class="mb-2 text-lg font-semibold text-ink">图片生成</h2>
            <p class="mb-6 flex-1 text-sm leading-relaxed text-ink-soft md:text-base">
              文字生图 / 图生图。输入创意描述，选择尺寸与风格预设，即刻生成高质量图片。
            </p>
            <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-transform duration-200 group-hover:gap-2.5">
              进入图片生成
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
          </div>
        </RouterLink>

        <!-- 视频生成入口 -->
        <RouterLink to="/video" class="group block no-underline">
          <div class="card card-interactive flex h-full flex-col p-6 md:p-8">
            <span class="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-muted text-accent">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="5" width="14" height="14" rx="2"></rect>
                <path d="m22 8-6 4 6 4V8z"></path>
              </svg>
            </span>
            <h2 class="mb-2 text-lg font-semibold text-ink">视频生成</h2>
            <p class="mb-6 flex-1 text-sm leading-relaxed text-ink-soft md:text-base">
              文字生成视频，支持首帧 / 尾帧引导。设定时长与分辨率，让你的画面动起来。
            </p>
            <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-transform duration-200 group-hover:gap-2.5">
              进入视频生成
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- 功能亮点 -->
    <section class="mb-16 md:mb-24">
      <h2 class="mb-6 text-lg font-semibold text-ink md:mb-8 md:text-xl">功能亮点</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(f, i) in features"
          :key="f.title"
          class="card card-interactive p-5"
        >
          <div class="mb-3 flex items-center gap-3">
            <span class="step-badge">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="text-base font-semibold text-ink">{{ f.title }}</h3>
          </div>
          <p class="text-sm leading-relaxed text-ink-soft">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="border-t border-line pt-10 text-center md:pt-12">
      <div class="display text-xl font-semibold tracking-tight text-ink">Genesis</div>
      <p class="mt-3 text-xs uppercase tracking-[0.2em] text-ink-muted">AI 驱动的视觉创作实验室</p>
      <div class="mt-5 flex justify-center gap-2">
        <RouterLink to="/image" class="tab no-underline">图片</RouterLink>
        <RouterLink to="/video" class="tab no-underline">视频</RouterLink>
      </div>
      <div class="mx-auto mt-7 h-px w-12 bg-accent/40"></div>
    </footer>
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue';

// 功能亮点
const features = [
  { title: '文字生图', desc: '一句话描述，生成高质量图片。' },
  { title: '图生图', desc: '上传参考图，按提示词二次创作。' },
  { title: '首尾帧视频', desc: '设定首帧 / 尾帧，引导视频生成。' },
  { title: '多尺寸预设', desc: '桌面 / 移动 / 社交多种比例一键切换。' },
  { title: '多风格预设', desc: '摄影、插画等多类风格随取随用。' },
  { title: '自定义 API', desc: '接入通用或 Gemini 等多家服务商。' },
];
</script>

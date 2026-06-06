<template>
  <div class="home">
    <!-- Hero（复用品牌头） -->
    <AppHeader />

    <!-- 介绍 -->
    <section class="mx-auto mb-12 max-w-3xl md:mb-16">
      <div class="pixel-card p-5 md:p-8">
        <p class="font-pixel text-sm leading-relaxed text-ink md:text-base">
          GENESIS 是一个 AI 驱动的视觉创作实验室。在这里，你可以用一句话生成精美图片，
          也可以让静态画面动起来变成视频。内置多种尺寸与风格预设，并支持接入你自己的 API，
          全程复古 8-bit 像素体验。
        </p>
        <div class="mt-5 flex flex-wrap gap-2">
          <span class="border-2 border-ink bg-bg px-2 py-1 font-pixel text-[0.625rem] uppercase tracking-wider text-muted">8-BIT</span>
          <span class="border-2 border-ink bg-bg px-2 py-1 font-pixel text-[0.625rem] uppercase tracking-wider text-muted">Pixel Art</span>
          <span class="border-2 border-ink bg-bg px-2 py-1 font-pixel text-[0.625rem] uppercase tracking-wider text-muted">AI Studio</span>
        </div>
      </div>
    </section>

    <!-- 两个入口 -->
    <section class="mb-14 md:mb-20">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- 图片生成入口 -->
        <RouterLink to="/image" class="group block no-underline">
          <div class="pixel-card flex h-full flex-col p-6 transition-all duration-100 group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-[8px_8px_0_#ff004d] md:p-8">
            <div class="mb-5 flex items-center gap-3">
              <span class="flex h-12 w-12 flex-shrink-0 items-center justify-center border-4 border-ink bg-[#ff004d]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff1e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </span>
              <h2 class="font-display text-lg text-ink md:text-xl">图片生成</h2>
            </div>
            <p class="mb-6 flex-1 font-pixel text-xs leading-relaxed text-muted md:text-sm">
              文字生图 / 图生图。输入创意描述，选择尺寸与风格预设，即刻生成高质量图片。
            </p>
            <span class="inline-flex w-full items-center justify-center border-4 border-ink bg-[#ff004d] py-3 font-display text-xs uppercase tracking-wider text-white shadow-pixel-sm">
              进入图片生成 →
            </span>
          </div>
        </RouterLink>

        <!-- 视频生成入口 -->
        <RouterLink to="/video" class="group block no-underline">
          <div class="pixel-card flex h-full flex-col p-6 transition-all duration-100 group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-[8px_8px_0_#29adff] md:p-8">
            <div class="mb-5 flex items-center gap-3">
              <span class="flex h-12 w-12 flex-shrink-0 items-center justify-center border-4 border-ink bg-[#29adff]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#13141f" stroke="#13141f" stroke-width="2" stroke-linejoin="round">
                  <polygon points="6 4 20 12 6 20 6 4"></polygon>
                </svg>
              </span>
              <h2 class="font-display text-lg text-ink md:text-xl">视频生成</h2>
            </div>
            <p class="mb-6 flex-1 font-pixel text-xs leading-relaxed text-muted md:text-sm">
              文字生成视频，支持首帧 / 尾帧引导。设定时长与分辨率，让你的画面动起来。
            </p>
            <span class="inline-flex w-full items-center justify-center border-4 border-ink bg-[#29adff] py-3 font-display text-xs uppercase tracking-wider text-bg shadow-pixel-sm">
              进入视频生成 →
            </span>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- 功能亮点 -->
    <section class="mb-14 md:mb-20">
      <h2 class="mb-6 font-display text-base text-ink md:mb-8 md:text-xl">功能亮点</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="f in features"
          :key="f.title"
          class="pixel-card p-4 transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_#ff77a8] md:p-5"
        >
          <div class="mb-2 flex items-center gap-2">
            <span class="h-4 w-4 flex-shrink-0 border-2 border-ink" :style="{ backgroundColor: f.color }"></span>
            <h3 class="font-display text-sm text-ink">{{ f.title }}</h3>
          </div>
          <p class="font-pixel text-[0.6875rem] leading-relaxed text-muted md:text-xs">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="border-t-4 border-ink pt-8 text-center md:pt-10">
      <div class="font-display text-base text-ink md:text-lg" style="text-shadow: 2px 2px 0 #ff004d, 4px 4px 0 #29adff;">GENESIS</div>
      <p class="mt-4 font-pixel text-[0.6875rem] uppercase tracking-[0.2em] text-muted md:text-xs">AI 驱动的视觉创作实验室</p>
      <div class="mt-5 flex justify-center gap-3">
        <RouterLink to="/image" class="pixel-tab text-xs no-underline">图片</RouterLink>
        <RouterLink to="/video" class="pixel-tab text-xs no-underline">视频</RouterLink>
      </div>
      <!-- 彩色像素装饰条 -->
      <div class="mt-6 flex justify-center">
        <span class="h-2 w-6 bg-[#ff004d] md:w-8"></span>
        <span class="h-2 w-6 bg-[#ffec27] md:w-8"></span>
        <span class="h-2 w-6 bg-[#00e436] md:w-8"></span>
        <span class="h-2 w-6 bg-[#29adff] md:w-8"></span>
        <span class="h-2 w-6 bg-[#ff77a8] md:w-8"></span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue';

// 功能亮点（color 为 PICO-8 强调色，仅作小色块标识）
const features = [
  { title: '文字生图', desc: '一句话描述，生成高质量图片。', color: '#ff004d' },
  { title: '图生图', desc: '上传参考图，按提示词二次创作。', color: '#ffa300' },
  { title: '首尾帧视频', desc: '设定首帧 / 尾帧，引导视频生成。', color: '#29adff' },
  { title: '多尺寸预设', desc: '桌面 / 移动 / 社交多种比例一键切换。', color: '#00e436' },
  { title: '多风格预设', desc: '摄影、插画等多类风格随取随用。', color: '#ff77a8' },
  { title: '自定义 API', desc: '接入通用或 Gemini 等多家服务商。', color: '#83769c' },
];
</script>

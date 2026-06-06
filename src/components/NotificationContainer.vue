<template>
  <div
    v-for="n in notifications"
    :key="n.id"
    class="fixed left-1/2 top-8 z-[1000] flex -translate-x-1/2 items-center gap-3 border-4 border-ink bg-surface px-5 py-3 font-pixel text-sm text-ink shadow-pixel transition-all duration-300"
    :class="n.visible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'"
  >
    <span class="h-4 w-4 flex-shrink-0 border-2 border-ink" :class="n.type === 'error' ? 'bg-[#ff004d]' : 'bg-[#00e436]'"></span>
    <span>{{ n.message }}</span>
  </div>
</template>

<script setup>
import { useNotification } from '../composables/useNotification.js';

const { notifications } = useNotification();
</script>

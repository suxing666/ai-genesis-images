<template>
  <div
    v-for="n in notifications"
    :key="n.id"
    class="fixed left-1/2 top-6 z-[1000] flex max-w-[90vw] -translate-x-1/2 items-center gap-2.5 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink shadow-elevated transition-all duration-300"
    :class="n.visible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'"
  >
    <span class="h-2 w-2 flex-shrink-0 rounded-full" :class="n.type === 'error' ? 'bg-error' : 'bg-success'"></span>
    <span>{{ n.message }}</span>
  </div>
</template>

<script setup>
import { useNotification } from '../composables/useNotification.js';

const { notifications } = useNotification();
</script>

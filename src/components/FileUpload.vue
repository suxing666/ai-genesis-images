<template>
  <div
    class="relative flex min-h-[150px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed bg-surface transition-colors duration-200"
    :class="isDragOver ? 'border-accent bg-accent-muted/50' : 'border-line hover:border-accent-muted hover:bg-surface-hover'"
    @click="onZoneClick"
    @dragover.prevent="isDragOver = true"
    @dragleave="isDragOver = false"
    @drop.prevent="onDrop"
  >
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="pointer-events-none absolute h-0 w-0 opacity-0"
      @change="onFileChange"
    >
    <div v-show="!modelValue" class="flex flex-col items-center gap-2.5 px-4 py-8 text-center">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-ink-muted">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      <span class="text-sm font-medium text-ink-soft">{{ label }}</span>
      <span class="text-2xs text-ink-muted">{{ hint }}</span>
    </div>
    <div v-show="modelValue" class="relative w-full">
      <img :src="modelValue || ''" :alt="label" class="block h-[150px] w-full object-cover">
      <button
        type="button"
        class="frame-remove-btn absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-ink-soft shadow-card transition-colors hover:border-error hover:text-error"
        @click.stop="removeImage"
        aria-label="移除图片"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useNotification } from '../composables/useNotification.js';

const props = defineProps({
  modelValue: { type: String, default: null },
  label: { type: String, default: '拖拽或点击上传图片' },
  hint: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const { showNotification } = useNotification();
const fileInputRef = ref(null);
const isDragOver = ref(false);

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    showNotification('请上传图片文件', 'error');
    return;
  }
  const base64 = await fileToBase64(file);
  emit('update:modelValue', base64);
}

function onZoneClick(e) {
  if (e.target.closest('.frame-remove-btn')) return;
  fileInputRef.value.click();
}

function onFileChange() {
  const file = fileInputRef.value.files[0];
  if (file) handleFile(file);
}

function onDrop(e) {
  isDragOver.value = false;
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
}

function removeImage() {
  emit('update:modelValue', null);
  if (fileInputRef.value) fileInputRef.value.value = '';
}
</script>

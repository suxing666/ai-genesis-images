<template>
  <div
    ref="zoneRef"
    class="frame-drop-zone"
    :class="{ 'has-image': modelValue, 'drag-over': isDragOver }"
    @click="onZoneClick"
    @dragover.prevent="isDragOver = true"
    @dragleave="isDragOver = false"
    @drop.prevent="onDrop"
  >
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="frame-file-input"
      @change="onFileChange"
    >
    <div v-show="!modelValue" class="frame-placeholder">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      <span>{{ label }}</span>
      <span class="frame-hint">{{ hint }}</span>
    </div>
    <div v-show="modelValue" class="frame-preview">
      <img :src="modelValue || ''" :alt="label">
      <button type="button" class="frame-remove-btn" @click.stop="removeImage" aria-label="移除图片">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

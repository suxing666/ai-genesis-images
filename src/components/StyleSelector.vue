<template>
  <div class="style-selector-wrapper mb-6">
    <label class="field-label mb-2">选择风格</label>
    <div class="mb-4 flex flex-wrap gap-1.5">
      <button
        v-for="(label, key) in styleCategoryLabels"
        :key="key"
        class="tab"
        :class="currentCategory === key ? 'tab-active' : ''"
        @click="switchCategory(key)"
      >
        {{ label }}
      </button>
    </div>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      <div
        v-for="style in currentStyles"
        :key="style.id"
        class="tile p-3 text-center"
        :class="selectedStyleId === style.id ? 'tile-active' : ''"
        @click="toggleStyle(style)"
      >
        <div class="text-sm font-semibold">{{ style.label }}</div>
        <div class="mt-1 truncate text-2xs text-ink-muted">{{ getStyleHint(style.prompt) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { stylePresets, styleCategoryLabels, getStyleHint } from '../data/stylePresets.js';

const props = defineProps({
  modelValue: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue', 'style-applied', 'style-removed']);

const currentCategory = ref('photography');
const selectedStyleId = ref(null);
const currentStylePrompt = ref('');

const currentStyles = computed(() => stylePresets[currentCategory.value] || []);

function switchCategory(category) {
  currentCategory.value = category;
}

function toggleStyle(style) {
  if (selectedStyleId.value === style.id) {
    // 取消选中
    emit('style-removed', currentStylePrompt.value);
    selectedStyleId.value = null;
    currentStylePrompt.value = '';
    emit('update:modelValue', '');
  } else {
    // 选中新风格：先移除旧的
    if (currentStylePrompt.value) {
      emit('style-removed', currentStylePrompt.value);
    }
    // 应用新风格
    emit('style-applied', style.prompt);
    selectedStyleId.value = style.id;
    currentStylePrompt.value = style.prompt;
    emit('update:modelValue', style.apiStyle || '');
  }
}
</script>

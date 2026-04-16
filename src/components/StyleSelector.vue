<template>
  <div class="style-selector-wrapper">
    <label class="input-label">选择风格</label>
    <div class="style-categories">
      <button
        v-for="(label, key) in styleCategoryLabels"
        :key="key"
        class="style-category-tab"
        :class="{ active: currentCategory === key }"
        @click="switchCategory(key)"
      >
        {{ label }}
      </button>
    </div>
    <div class="style-grid">
      <div
        v-for="style in currentStyles"
        :key="style.id"
        class="style-card"
        :class="{ selected: selectedStyleId === style.id }"
        @click="toggleStyle(style)"
      >
        <div class="style-info">
          <div class="style-label">{{ style.label }}</div>
          <div class="style-hint">{{ getStyleHint(style.prompt) }}</div>
        </div>
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

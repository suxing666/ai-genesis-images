<template>
  <div class="size-selector-wrapper">
    <label class="input-label">选择尺寸</label>
    <div class="size-categories">
      <button
        v-for="(label, key) in categoryLabels"
        :key="key"
        class="category-tab"
        :class="{ active: currentCategory === key }"
        @click="switchCategory(key)"
      >
        {{ label }}
      </button>
    </div>
    <div class="size-grid">
      <div
        v-for="size in currentSizes"
        :key="size.value"
        class="size-card"
        :class="{ selected: modelValue === size.value }"
        @click="selectSize(size.value)"
      >
        <div class="size-info">
          <div class="size-label">{{ size.label }}</div>
          <div class="size-dimensions">{{ size.width }}&times;{{ size.height }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { sizePresets, categoryLabels } from '../data/sizePresets.js';

const props = defineProps({
  modelValue: { type: String, default: '1920x1080' },
});

const emit = defineEmits(['update:modelValue']);

const currentCategory = ref('desktop');

const currentSizes = computed(() => sizePresets[currentCategory.value] || []);

function switchCategory(category) {
  currentCategory.value = category;
  // 切换分类时选中该分类的第一个尺寸
  const sizes = sizePresets[category];
  if (sizes && sizes.length > 0) {
    emit('update:modelValue', sizes[0].value);
  }
}

function selectSize(value) {
  emit('update:modelValue', value);
}
</script>

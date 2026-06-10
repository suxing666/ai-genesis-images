<template>
  <div class="size-selector-wrapper mb-6">
    <label class="field-label mb-2">选择尺寸</label>
    <div class="mb-4 flex flex-wrap gap-1.5">
      <button
        v-for="(label, key) in categoryLabels"
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
        v-for="size in currentSizes"
        :key="size.value"
        class="tile p-3 text-center"
        :class="modelValue === size.value ? 'tile-active' : ''"
        @click="selectSize(size.value)"
      >
        <div class="text-sm font-semibold">{{ size.label }}</div>
        <div class="num mt-1 text-2xs text-ink-muted">{{ size.width }}×{{ size.height }}</div>
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

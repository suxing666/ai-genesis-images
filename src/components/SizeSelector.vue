<template>
  <div class="size-selector-wrapper mb-6">
    <label class="mb-2 block font-pixel text-xs uppercase tracking-[0.15em] text-ink">选择尺寸</label>
    <div class="mb-4 flex flex-wrap gap-2">
      <button
        v-for="(label, key) in categoryLabels"
        :key="key"
        class="pixel-tab"
        :class="currentCategory === key ? 'pixel-tab-active' : ''"
        @click="switchCategory(key)"
      >
        {{ label }}
      </button>
    </div>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      <div
        v-for="size in currentSizes"
        :key="size.value"
        class="cursor-pointer border-4 border-ink p-3 text-center transition-all duration-100"
        :class="modelValue === size.value
          ? 'bg-[#ffec27] text-bg translate-x-[2px] translate-y-[2px] shadow-none'
          : 'bg-surface text-ink shadow-pixel-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none'"
        @click="selectSize(size.value)"
      >
        <div class="size-info">
          <div class="font-pixel text-xs">{{ size.label }}</div>
          <div class="mt-1 font-pixel text-[0.625rem] opacity-70">{{ size.width }}&times;{{ size.height }}</div>
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

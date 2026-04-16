<template>
  <div
    v-for="n in notifications"
    :key="n.id"
    class="notification"
    :class="[n.type, { show: n.visible }]"
  >
    {{ n.message }}
  </div>
</template>

<script setup>
import { useNotification } from '../composables/useNotification.js';

const { notifications } = useNotification();
</script>

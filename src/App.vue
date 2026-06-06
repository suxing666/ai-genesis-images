<template>
  <SettingsSidebar />
  <AppNav />

  <main class="main-container relative z-[1] mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-16">
    <RouterView />
  </main>

  <NotificationContainer />
</template>

<script setup>
import SettingsSidebar from './components/SettingsSidebar.vue';
import AppNav from './components/AppNav.vue';
import NotificationContainer from './components/NotificationContainer.vue';
</script>

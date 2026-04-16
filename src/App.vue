<template>
  <SettingsSidebar />

  <main class="main-container">
    <AppHeader />
    <TabNav />
    <RouterView />
  </main>

  <NotificationContainer />
</template>

<script setup>
import SettingsSidebar from './components/SettingsSidebar.vue';
import AppHeader from './components/AppHeader.vue';
import TabNav from './components/TabNav.vue';
import NotificationContainer from './components/NotificationContainer.vue';
</script>

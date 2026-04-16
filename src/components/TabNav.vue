<template>
  <nav class="tab-nav">
    <RouterLink to="/image" class="tab-btn" active-class="active">
      <span class="tab-text">图片生成</span>
    </RouterLink>
    <RouterLink to="/video" class="tab-btn" active-class="active">
      <span class="tab-text">视频生成</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
a.tab-btn {
  text-decoration: none;
  color: inherit;
}
</style>

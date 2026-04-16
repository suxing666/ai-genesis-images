import { createRouter, createWebHashHistory } from 'vue-router';

const ImageGeneration = () => import('../views/ImageGeneration.vue');
const VideoGeneration = () => import('../views/VideoGeneration.vue');

const routes = [
  { path: '/', redirect: '/image' },
  { path: '/image', name: 'image', component: ImageGeneration },
  { path: '/video', name: 'video', component: VideoGeneration },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

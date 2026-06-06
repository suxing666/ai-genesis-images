import { createRouter, createWebHashHistory } from 'vue-router';

const Home = () => import('../views/Home.vue');
const ImageGeneration = () => import('../views/ImageGeneration.vue');
const VideoGeneration = () => import('../views/VideoGeneration.vue');

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/image', name: 'image', component: ImageGeneration },
  { path: '/video', name: 'video', component: VideoGeneration },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

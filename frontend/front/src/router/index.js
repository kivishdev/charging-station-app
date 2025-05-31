import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/chargers',
      name: 'chargers',
      component: () => import('../views/ChargersView.vue'),
    },
  ],
});

export default router;
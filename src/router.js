import { createRouter, createWebHistory } from 'vue-router';
import Settings from './views/Settings.vue';
import OrderBook from './views/OrderBook.vue';

const routes = [
  {
    path: '/',
    name: 'OrderBook',
    component: OrderBook
  },
  {
    path: '/Settings',
    name: 'Settings',
    component: Settings
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

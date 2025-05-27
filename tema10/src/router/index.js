import { createRouter, createWebHistory } from 'vue-router';
import PianoView from '../views/PianoView.vue';
import AdminView from '../views/AdminView.vue';
import LoginView from '../views/loginVue.vue'

const routes = [
  {
    path: '/',
    name: 'Piano',
    component: PianoView,
  },
  {
    path: '/piano',
    redirect: '/',
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
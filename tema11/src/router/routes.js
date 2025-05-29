import ScoreList from '@/pages/ScoreList.vue'
import ScoreForm from '@/pages/ScoreForm.vue'
import Logout from '@/pages/Logout.vue';
import Signup from '@/pages/Signup.vue';

const routes = [
  {
    path: '/login',
    component: () => import('@/pages/Login.vue'),
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/private',
    name: 'Private',
    component: () => import('@/pages/Private.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/piano',
    component: () => import('@/pages/PianoView.vue')
  },
  {
    path: '/score-list',
    name: 'ScoreList',
    component: ScoreList,
    meta: { layout: 'newLayout' },

  },
  {
    path: '/score-form',
    name: 'ScoreForm',
    component: ScoreForm,
    meta: { layout: 'newLayout' },
  },
];

export default routes;


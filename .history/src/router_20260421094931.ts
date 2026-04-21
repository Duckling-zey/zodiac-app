import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/community'
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('./pages/index/index.vue')
  },
  {
    path: '/match',
    name: 'Match',
    component: () => import('./pages/match/index.vue')
  },
  {
    path: '/personality',
    name: 'Personality',
    component: () => import('./pages/personality/index.vue')
  },
  {
    path: '/horoscope',
    name: 'Horoscope',
    component: () => import('./pages/horoscope/index.vue')
  },
  {
    path: '/ai',
    name: 'AI',
    component: () => import('./pages/ai/index.vue')
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('./pages/community/index.vue')
  },
  {
    path: '/knowledge',
    name: 'Knowledge',
    component: () => import('./pages/knowledge/index.vue')
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('./pages/calendar/index.vue')
  },
  {
    path: '/test-center',
    name: 'TestCenter',
    component: () => import('./pages/test-center/index.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('./pages/settings/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/index'
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

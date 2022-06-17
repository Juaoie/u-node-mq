import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'

import LoginHome from '@p/login/LoginHome/LoginHome.vue'
import HomePage from '@p/home/HomePage/HomePage.vue'

const routes: RouteRecordRaw[] = [
  { path: '/LoginHome', redirect: '/' },
  { path: '/', component: LoginHome },
  { path: '/HomePage', component: HomePage },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

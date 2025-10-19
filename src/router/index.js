import { createRouter, createWebHashHistory } from 'vue-router'

// 页面按需加载
const Welcome = () => import('../pages/Welcome.vue')
const WLAN = () => import('../pages/WLAN.vue')
const Record = () => import('../pages/Record.vue')
const Commit = () => import('../pages/Commit.vue')
const Confirm = () => import('../pages/Confirm.vue')


const routes = [
  { path: '/', name: 'welcome', component: Welcome },
  { path: '/wlan', name: 'wlan', component: WLAN },
  { path: '/record', name: 'record', component: Record },
  { path: '/commit', name: 'commit', component: Commit },
  { path: '/confirm', name: 'confirm', component: Confirm },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router



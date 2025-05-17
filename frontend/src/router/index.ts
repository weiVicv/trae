// 需要先安装 vue-router 依赖
// npm install vue-router@4
// 确保已安装 vue-router 依赖包
// npm install vue-router@4 --save
// 如果还是报错，尝试:
// npm install @types/vue-router --save-dev
import { RouteRecordRaw } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import KnowledgeBaseDetail from '../views/KnowledgeBaseDetail.vue'
import Discussion from '../views/Discussion.vue'

// Define routes
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { guest: true }
  },
  {
    path: '/knowledge-base/:id',
    name: 'knowledge-base-detail',
    component: KnowledgeBaseDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/discussion',
    name: 'discussion',
    component: Discussion,
    meta: { requiresAuth: true }
  }
]

export default routes
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import FamilyDetailsComponent from '../components/FamilyDetailsComponent.vue'
import ClassComponent from '../components/ClassComponent.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/dashboard',
    redirect: '/dashboard/ai'
  },
  {
    path: '/dashboard/students/:id/family',
    name: 'FamilyDetails',
    component: FamilyDetailsComponent
  },
  {
    path: '/dashboard/:menu*',
    name: 'Dashboard',
    component: DashboardView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('algo_user')
  const token = localStorage.getItem('algo_token')
  const isAuthenticated = user && token
  
  if (to.path.startsWith('/dashboard') && !isAuthenticated) {
    // Redirect to login if trying to access dashboard without authentication
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Redirect to dashboard if already authenticated
    next('/dashboard')
  } else {
    next()
  }
})

export default router
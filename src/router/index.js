import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../components/Weather.vue')
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('../components/Favorites.vue')
  },
  {
    path: '/readme',
    name: 'readme',
    component: () => import('../components/ReadMe.vue')
  },
 
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' })
  }
})

export default router

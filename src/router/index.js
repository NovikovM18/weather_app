import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/weather_app/',
    name: 'home',
    component: () => import('../components/Weather.vue')
  },
  {
    path: '/weather_app/favorites',
    name: 'favorites',
    component: () => import('../components/Favorites.vue')
  },
  {
    path: '/weather_app/readme',
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

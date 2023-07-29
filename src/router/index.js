import { createRouter, createWebHistory } from 'vue-router'
import DocView from '@/views/DocView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'doc',
      component: DocView,
      props: (route) => ({ docUrl: new URL(route.hash.substring(1)) })
    }

    // {
    //   path: '/doc/:docUrl(.*)',
    //   name: 'doc',
    //   component: DocView,
    //   props: true
    // }
  ]
})

export default router

import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import { routes } from './router/routes'

// 路由现在有完整的类型支持
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 可以访问类型化的路由元信息
router.beforeEach((to) => {
  // meta 现在有类型提示
  document.title = to.meta.title as string
})

const app = createApp(App)
app.use(router)
app.mount('#app')

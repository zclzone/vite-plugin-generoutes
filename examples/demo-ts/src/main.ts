import routes from 'virtual:vue-auto-pages'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'

// 路由现在有完整的类型支持
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// eslint-disable-next-line no-console
console.log('🚀 routes', routes)

// 可以访问类型化的路由元信息
router.beforeEach((to) => {
  // 自定义 meta 字段为 unknown，类型收窄后即可安全使用
  document.title = typeof to.meta.title === 'string'
    ? `${to.meta.title} · Vue Auto Pages Lab`
    : 'Vue Auto Pages Lab'
})

const app = createApp(App)
app.use(router)
app.mount('#app')

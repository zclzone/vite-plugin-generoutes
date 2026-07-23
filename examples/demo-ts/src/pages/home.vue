<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'HomePage',
  meta: {
    title: 'Home页面',
    requireAuth: false,
    layout: 'home',
  },
})

const route = useRoute()
const redirected = computed(() => route.query.case === 'redirect')
</script>

<template>
  <article class="demo-page">
    <p class="page-kicker">
      Explicit layout / business meta
    </p>
    <h2>页面主动选择 home 布局。</h2>
    <p>全局默认不使用布局，本页通过静态 meta 显式加入 <code>home.vue</code> 布局分组。</p>
    <div v-if="redirected" class="callout">
      redirect.vue 没有加载组件；路由已按 <code>redirect: '/home?case=redirect'</code> 跳转到这里。
    </div>
    <div class="fact-grid">
      <div class="fact">
        <span>路径</span><code>/home</code>
      </div>
      <div class="fact">
        <span>layout</span><code>home</code>
      </div>
      <div class="fact">
        <span>业务字段</span><code>requireAuth: false</code>
      </div>
    </div>
  </article>
</template>

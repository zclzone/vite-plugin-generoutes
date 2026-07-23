<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'NotFoundPage',
  meta: {
    title: '页面不存在',
    icon: '404',
    layout: false,
  },
})

const route = useRoute()
const explanation = computed(() => {
  if (route.query.case === 'disabled')
    return 'disabled.vue 设置了 enabled: false，因此没有进入生成路由树。'
  if (route.query.case === 'ignored')
    return 'pages/components 命中 ignoreFolders，因此 RouteInspector.vue 不是页面路由。'
  return '当前地址没有匹配其他页面，因此由根级通配符接管。'
})
</script>

<template>
  <article class="demo-page">
    <p class="page-kicker">
      Catch-all / 404
    </p>
    <h2>没有页面匹配这条路径。</h2>
    <p>根目录的 <code>[...all].vue</code> 生成 <code>/:pathMatch(.*)*</code>，并保持无布局。</p>
    <div class="callout">
      {{ explanation }}<br>
      当前地址：<code>{{ route.path }}</code>
    </div>
    <RouterLink to="/">
      返回根页面
    </RouterLink>
  </article>
</template>

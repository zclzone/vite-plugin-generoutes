<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
  meta: {
    title: '首页',
    icon: 'home',
    enabled: true,
    keepAlive: true,
    features: ['virtual-module', 'typed-meta', 'hmr'],
  },
})
</script>

<template>
  <article class="demo-page">
    <p class="page-kicker">
      Index route / typed meta
    </p>
    <h2>路由不是文件，是模块。</h2>
    <p>插件扫描页面后将类型化路由发布为 <code>virtual:vue-auto-pages</code>，源码目录中不会产生 routes.ts。</p>
    <div class="fact-grid">
      <div class="fact">
        <span>文件</span>
        <code>pages/index.vue</code>
      </div>
      <div class="fact">
        <span>路径</span>
        <code>/</code>
      </div>
      <div class="fact">
        <span>默认布局</span>
        <code>false</code>
      </div>
      <div class="fact">
        <span>内置 meta</span>
        <code>enabled + keepAlive</code>
      </div>
    </div>
    <div class="callout">
      右侧检查器直接消费 virtual module，并通过 RouteMeta 类型读取布局字段。
    </div>
  </article>
</template>

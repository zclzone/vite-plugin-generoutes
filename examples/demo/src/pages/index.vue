<script setup>
defineOptions({
  name: 'IndexPage',
  meta: {
    title: '首页',
    icon: 'home',
    enabled: true,
    keepAlive: true,
    features: ['virtual-module', 'hmr'],
  },
})
</script>

<template>
  <div class="page">
    <h2>首页</h2>
    <p>这是由文件 <code>src/pages/index.vue</code> 生成的路由页面</p>
    <p>路由路径: <code>/</code></p>
    <p>该页面使用全局 <code>defaultLayout: false</code>，并展示 <code>enabled</code>、<code>keepAlive</code> 和自定义业务元数据。</p>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}
</style>

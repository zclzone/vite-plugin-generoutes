<script setup lang="ts">
defineOptions({
  name: 'AboutPage',
  meta: {
    title: '关于页面',
    description: '这是一个关于页面',
  },
})
</script>

<template>
  <div class="page about-page">
    <h2>📖 关于页面</h2>
    <p>这是由文件 <code>src/pages/about.vue</code> 生成的路由页面</p>
    <p>路由路径: <code>/about</code></p>
    <div class="info">
      <h3>关于 vite-plugin-generoutes</h3>
      <p>一个基于文件系统自动生成 Vue Router 配置的 Vite 插件</p>
      <p>现已支持 TypeScript 项目！</p>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  border-radius: 8px;
}

.about-page {
  background-color: #fff5ee;
}

h2 {
  margin-bottom: 15px;
  color: #333;
}

code {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.info {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.info h3 {
  margin-bottom: 10px;
}
</style>

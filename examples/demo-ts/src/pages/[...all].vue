<script setup lang="ts">
defineOptions({
  name: 'NotFoundPage',
  meta: {
    title: '页面不存在',
    icon: '404',
  },
})
</script>

<template>
  <div class="page not-found-page">
    <h2>🔍 404 - 页面不存在</h2>
    <p>这是由文件 <code>src/pages/[...all].vue</code> 生成的全局捕获路由</p>
    <p>路由路径: <code>/:pathMatch(.*)*</code></p>
    <router-link to="/" class="back-link">
      返回首页
    </router-link>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  border-radius: 8px;
}

.not-found-page {
  background-color: #fff0f0;
  text-align: center;
}

h2 {
  margin-bottom: 15px;
  color: #e74c3c;
}

code {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.back-link:hover {
  background: #5a6fd6;
}
</style>

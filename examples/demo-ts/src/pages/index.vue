<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
  meta: {
    title: '首页',
    icon: 'home',
    layout: 'home',
  },
})
</script>

<template>
  <div class="page index-page">
    <h2>🏠 首页</h2>
    <p>这是由文件 <code>src/pages/index.vue</code> 生成的路由页面</p>
    <p>路由路径: <code>/</code></p>
    <div class="features">
      <h3>TypeScript 支持特性：</h3>
      <ul>
        <li>✅ 路由文件 <code>routes.ts</code> 带有完整类型定义</li>
        <li>✅ 自动导入 <code>RouteRecordRaw</code> 类型</li>
        <li>✅ <code>RouteMeta</code> 接口可扩展</li>
        <li>✅ IDE 智能提示支持</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  border-radius: 8px;
}

.index-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

h2 {
  margin-bottom: 15px;
  color: #333;
}

code {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
}

.features {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
}

.features h3 {
  margin-bottom: 10px;
  color: #667eea;
}

.features ul {
  list-style: none;
  padding: 0;
}

.features li {
  padding: 5px 0;
}
</style>

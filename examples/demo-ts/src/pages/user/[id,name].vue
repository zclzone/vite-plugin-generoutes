<script setup lang="ts">
import { useRoute } from 'vue-router'

defineOptions({
  name: 'UserDetail',
  meta: {
    title: '用户详情',
    icon: 'user-detail',
  },
})

const route = useRoute()
</script>

<template>
  <div class="page user-detail-page">
    <h2>👤 用户详情 (动态路由)</h2>
    <p>这是由文件 <code>src/pages/user/[id,name].vue</code> 生成的动态路由页面</p>
    <p>路由路径: <code>/user/:id/:name</code></p>
    <div class="params">
      <h3>路由参数:</h3>
      <p><strong>id:</strong> {{ route.params.id }}</p>
      <p><strong>name:</strong> {{ route.params.name }}</p>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  border-radius: 8px;
}

.user-detail-page {
  background-color: #f5f0ff;
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

.params {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
}

.params h3 {
  margin-bottom: 10px;
  color: #667eea;
}
</style>

<script setup lang="ts">
defineOptions({
  name: 'AdminDashboard',
  meta: {
    title: '管理面板',
    icon: 'dashboard',
    requiresAuth: true,
  },
})
</script>

<template>
  <div class="page dashboard-page">
    <h2>📊 管理面板</h2>
    <p>这是由文件 <code>src/pages/(admin)/dashboard.vue</code> 生成的路由页面</p>
    <p>路由路径: <code>/dashboard</code> (括号内的路径段会被忽略)</p>
    <p>
      <strong>requiresAuth:</strong> true (需要认证)
    </p>
    <div class="notice">
      <p>💡 使用括号 <code>(admin)</code> 可以组织文件结构，但不会出现在 URL 中</p>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  border-radius: 8px;
}

.dashboard-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

h2 {
  margin-bottom: 15px;
}

code {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
}

.notice {
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}
</style>

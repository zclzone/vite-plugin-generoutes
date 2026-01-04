<script setup lang="ts">
defineOptions({
  name: 'UserIndex',
  meta: {
    title: '用户列表',
    icon: 'user',
  },
})
</script>

<template>
  <div class="page user-page">
    <h2>👥 用户列表</h2>
    <p>这是由文件 <code>src/pages/user/index.vue</code> 生成的路由页面</p>
    <p>路由路径: <code>/user</code></p>
    <div class="user-links">
      <router-link to="/user/profile">
        查看资料
      </router-link>
      <router-link to="/user/123/zhang">
        用户详情示例
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  border-radius: 8px;
}

.user-page {
  background-color: #f0f8ff;
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

.user-links {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.user-links a {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.user-links a:hover {
  background: #5a6fd6;
}
</style>

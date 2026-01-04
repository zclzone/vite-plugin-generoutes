<script setup lang="ts">
defineOptions({
  name: 'UserProfile',
  parent: 'UserIndex',
  meta: {
    title: '用户资料',
    icon: 'profile',
  },
})
</script>

<template>
  <div class="nested-page">
    <h3>📝 用户资料 (嵌套路由)</h3>
    <p>这是由文件 <code>src/pages/user/profile.vue</code> 生成的嵌套路由页面</p>
    <p>路由路径: <code>/user/profile</code></p>
    <p>父路由: <code>UserIndex</code></p>
  </div>
</template>

<style scoped>
.nested-page {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

h3 {
  margin-bottom: 10px;
  color: #667eea;
}

code {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>

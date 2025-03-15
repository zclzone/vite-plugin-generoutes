<script setup>
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
  <div class="page admin">
    <h2>管理面板</h2>
    <p>这是由文件 <code>src/pages/(admin)/dashboard.vue</code> 生成的路由页面</p>
    <p>路由路径: <code>/dashboard</code> (注意：<code>(admin)</code> 作为虚拟目录被忽略)</p>
    <div class="info-box">
      <h3>虚拟目录说明</h3>
      <p>路径中的 <code>(admin)</code> 部分是一个虚拟目录，它不会出现在最终的路由路径中。</p>
      <p>这对于按功能或权限组织页面文件非常有用，但不希望这种组织结构影响URL路径。</p>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  background-color: #e3f2fd;
  border-radius: 8px;
}

.admin {
  border-left: 4px solid #2196f3;
}

.info-box {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>

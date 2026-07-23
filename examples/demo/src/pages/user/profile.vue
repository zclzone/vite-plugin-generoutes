<script setup>
defineOptions({
  name: 'UserProfile',
  meta: {
    title: '用户资料',
    icon: 'profile',
  },
})
</script>

<template>
  <div class="page nested">
    <h2>用户资料页面</h2>
    <p>这是由文件 <code>src/pages/user/profile.vue</code> 生成的路由页面</p>
    <p>路由路径: <code>/user/profile</code></p>
    <div class="info-box">
      <h3>目录路由说明</h3>
      <p>目录只参与 URL 生成，该页面是 path 为 <code>/user/profile</code> 的独立路由。</p>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  background-color: #efefff;
  border-radius: 8px;
}

.nested {
  border-left: 4px solid #673ab7;
}

.info-box {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>

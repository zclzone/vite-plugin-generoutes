<script setup>
defineOptions({
  name: 'NotFoundPage',
  meta: {
    title: '页面不存在',
    icon: '404',
  },
})
</script>

<template>
  <div class="page not-found">
    <h2>404 - 页面不存在</h2>
    <p>您访问的路径: <code>{{ $route.path }}</code> 不存在</p>
    <p>这是由文件 <code>src/pages/[...all].vue</code> 生成的通配符路由页面</p>
    <p>路由路径: <code>/:pathMatch(.*)*</code></p>
    <router-link to="/">
      返回首页
    </router-link>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  background-color: #fff3e0;
  border-radius: 8px;
}

.not-found {
  border: 2px dashed #ff9800;
}
</style>

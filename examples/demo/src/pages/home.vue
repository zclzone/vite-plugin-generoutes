<script setup>
defineOptions({
  name: 'HomePage',
  meta: {
    title: 'Home页面',
    requiresAuth: false,
  },
})
</script>

<template>
  <div class="page">
    <h2>Home页面</h2>
    <p>这是由文件 <code>src/pages/home.vue</code> 生成的路由页面</p>
    <p>路由路径: <code>/home</code></p>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  background-color: #efffef;
  border-radius: 8px;
}
</style>

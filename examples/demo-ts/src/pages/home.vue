<script setup lang="ts">
defineOptions({
  name: 'HomePage',
  meta: {
    title: 'Home页面',
    requiresAuth: false,
  },
})
</script>

<template>
  <div class="page home-page">
    <h2>🏡 Home页面</h2>
    <p>这是由文件 <code>src/pages/home.vue</code> 生成的路由页面</p>
    <p>路由路径: <code>/home</code></p>
    <p>
      <strong>requiresAuth:</strong> false
    </p>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  border-radius: 8px;
}

.home-page {
  background-color: #efffef;
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
</style>

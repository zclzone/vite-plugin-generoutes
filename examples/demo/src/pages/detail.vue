<script setup>
defineOptions({
  name: 'DetailPage',
  meta: {
    title: '详情页面',
    requiresAuth: true,
  },
})
</script>

<template>
  <div class="page">
    <h2>详情页面</h2>
    <p>这是由文件 <code>src/pages/detail.vue</code> 生成的路由页面</p>
    <p>路由路径: <code>/detail</code></p>
    <p>注意：此页面设置了 <code>requiresAuth: true</code> 元数据</p>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  background-color: #ffefef;
  border-radius: 8px;
}
</style>

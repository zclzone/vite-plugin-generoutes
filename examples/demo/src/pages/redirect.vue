<script setup>
defineOptions({
  name: 'RedirectPage',
  redirect: '/home',
  meta: {
    title: '重定向示例',
    description: '这个页面会自动重定向到Home页面',
  },
})
</script>

<template>
  <!-- 此内容不会显示，因为会被重定向 -->
  <div class="page">
    <h2>重定向示例</h2>
    <p>如果您看到此内容，说明重定向配置未生效。</p>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
}
</style>

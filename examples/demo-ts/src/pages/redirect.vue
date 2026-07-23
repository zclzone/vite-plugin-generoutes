<script setup lang="ts">
defineOptions({
  name: 'RedirectToHome',
  redirect: '/home?case=redirect',
  meta: {
    title: '重定向到 Home',
  },
})
</script>

<template>
  <p>redirect 路由不会加载这个组件。</p>
</template>

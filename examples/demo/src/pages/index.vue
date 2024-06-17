<script setup>
defineOptions({
  name: 'Index',
  meta: {
    title: '首页',
  },
})
</script>

<template>
  <div>Hello {{ $route.meta?.title }}</div>
</template>

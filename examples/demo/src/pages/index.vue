<script setup>
defineOptions({
  name: 'Index',
  meta: {
    title: '首页2',
  },
})
</script>

<template>
  <div>Hello {{ $route.meta?.title }}</div>
</template>

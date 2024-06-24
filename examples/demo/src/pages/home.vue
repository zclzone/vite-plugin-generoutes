<script setup>
defineOptions({
  meta: {
    title: 'Home Page',
  },
})
</script>

<template>
  <h1>Hello {{ $route.meta?.title }}</h1>
</template>

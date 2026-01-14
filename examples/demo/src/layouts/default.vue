<script setup>
defineOptions({
  name: 'DefaultLayout',
})
</script>

<template>
  <div class="default-layout">
    <header>Default Layout Header</header>
    <main>
      <router-view />
    </main>
    <footer>Default Layout Footer</footer>
  </div>
</template>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>

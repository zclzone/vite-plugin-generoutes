<template>
  <div class="home-layout">
    <header>Home Layout Header</header>
    <main>
      <router-view />
    </main>
    <footer>Home Layout Footer</footer>
  </div>
</template>

<style scoped>
.home-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>

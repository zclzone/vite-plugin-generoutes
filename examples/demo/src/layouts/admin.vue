<template>
  <div class="admin-layout">
    <header>Admin Layout Header</header>
    <main>
      <RouterView />
    </main>
    <footer>Admin Layout Footer</footer>
  </div>
</template>

<style scoped>
.admin-layout {
  padding: 20px;
  border: 2px solid #2196f3;
  border-radius: 8px;
}

main {
  margin: 16px 0;
}
</style>

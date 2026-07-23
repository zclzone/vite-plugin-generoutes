<template>
  <div class="home-layout">
    <div class="layout-label">
      <span>LAYOUT</span>
      <strong>home.vue</strong>
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
.home-layout {
  padding: 18px;
  border: 1px solid #15938e;
  background: #eaf8f6;
}

.layout-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid #9bcac7;
  color: #157d79;
  font: 0.7rem/1 'Cascadia Code', Consolas, monospace;
}
</style>

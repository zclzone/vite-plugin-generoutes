<template>
  <div class="default-layout">
    <div class="layout-label">
      <span>LAYOUT</span>
      <strong>default.vue</strong>
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
.default-layout {
  padding: 18px;
  border: 1px solid #2d6cdf;
  background: #edf4ff;
}

.layout-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid #9eb9e9;
  color: #2d6cdf;
  font: 0.7rem/1 'Cascadia Code', Consolas, monospace;
}
</style>

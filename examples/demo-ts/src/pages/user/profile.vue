<script setup lang="ts">
defineOptions({
  name: 'UserProfile',
  meta: {
    title: '用户资料',
    icon: 'profile',
  },
})
</script>

<template>
  <section class="demo-page">
    <p class="page-kicker">
      Flat directory route
    </p>
    <h2>目录页面</h2>
    <p>目录只参与完整 URL 生成；可以独立选择 layout。</p>
    <div class="fact-grid">
      <div class="fact">
        <span>路径</span><code>/user/profile</code>
      </div>
      <div class="fact">
        <span>路由结构</span><code>扁平路由</code>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'UserIndex',
  meta: {
    title: '用户列表',
    layout: 'default',
  },
})
</script>

<template>
  <section class="demo-page">
    <p class="page-kicker">
      Directory index
    </p>
    <h2>用户目录首页</h2>
    <p><code>user/index.vue</code> 不增加 index 片段，直接生成完整路径 <code>/user</code>。</p>
    <div class="fact-grid">
      <div class="fact">
        <span>完整路径</span><code>/user</code>
      </div>
      <div class="fact">
        <span>路由 path</span><code>/user</code>
      </div>
      <div class="fact">
        <span>路由结构</span><code>扁平路由</code>
      </div>
    </div>
  </section>
</template>

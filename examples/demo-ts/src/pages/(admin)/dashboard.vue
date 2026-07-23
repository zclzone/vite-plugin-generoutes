<script setup lang="ts">
defineOptions({
  name: 'AdminDashboard',
  meta: {
    title: '管理面板',
    icon: 'dashboard',
    requireAuth: true,
    layout: 'default',
  },
})
</script>

<template>
  <article class="demo-page">
    <p class="page-kicker">
      Route group / default layout
    </p>
    <h2>目录用于组织，不一定进入 URL。</h2>
    <p><code>(admin)</code> 是虚拟目录，因此文件保持后台分组，最终地址仍然是 <code>/dashboard</code>。</p>
    <div class="fact-grid">
      <div class="fact">
        <span>文件</span><code>pages/(admin)/dashboard.vue</code>
      </div>
      <div class="fact">
        <span>路径</span><code>/dashboard</code>
      </div>
      <div class="fact">
        <span>layout</span><code>default</code>
      </div>
      <div class="fact">
        <span>业务字段</span><code>requireAuth: true</code>
      </div>
    </div>
  </article>
</template>

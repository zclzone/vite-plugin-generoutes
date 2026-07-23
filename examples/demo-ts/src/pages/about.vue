<script setup lang="ts">
defineOptions({
  name: 'AboutPage',
  meta: {
    title: '关于页面',
    description: '这是一个关于页面',
    layout: false,
  },
})
</script>

<template>
  <article class="demo-page">
    <p class="page-kicker">
      No layout / custom metadata
    </p>
    <h2>显式绕过布局。</h2>
    <p><code>meta.layout: false</code> 让这个页面直接成为顶层路由，自定义 description 则保持为业务元数据。</p>
    <div class="fact-grid">
      <div class="fact">
        <span>路径</span><code>/about</code>
      </div>
      <div class="fact">
        <span>layout</span><code>false</code>
      </div>
      <div class="fact">
        <span>自定义 name</span><code>AboutPage</code>
      </div>
    </div>
  </article>
</template>

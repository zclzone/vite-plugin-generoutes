<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <article class="demo-page">
    <p class="page-kicker">
      Single dynamic parameter
    </p>
    <h2>文件名就是参数声明。</h2>
    <p><code>product/[id].vue</code> 自动生成 <code>/product/:id</code>，且没有 defineOptions 时使用自动 route name。</p>
    <div class="param-grid">
      <div class="param">
        <span>id</span><strong>{{ route.params.id }}</strong>
      </div>
      <div class="param">
        <span>自动名称</span><strong>Product_[id]</strong>
      </div>
    </div>
  </article>
</template>

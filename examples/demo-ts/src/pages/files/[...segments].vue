<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <article class="demo-page">
    <p class="page-kicker">
      Named catch-all
    </p>
    <h2>任意深度，保留参数语义。</h2>
    <p><code>[...segments].vue</code> 将剩余路径收集到命名参数 segments，而不是全局 404 使用的 pathMatch。</p>
    <div class="param-grid">
      <div class="param">
        <span>segments</span><strong>{{ route.params.segments }}</strong>
      </div>
      <div class="param">
        <span>生成路径</span><strong>/files/:segments(.*)*</strong>
      </div>
    </div>
  </article>
</template>

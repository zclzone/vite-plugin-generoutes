<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <article class="demo-page">
    <p class="page-kicker">
      Optional parameter
    </p>
    <h2>参数可以缺席。</h2>
    <p>双层方括号生成可选参数，因此 <code>/optional</code> 和 <code>/optional/88</code> 都会进入这个组件。</p>
    <div class="param-grid">
      <div class="param">
        <span>id</span><strong>{{ route.params.id || 'undefined' }}</strong>
      </div>
      <div class="param">
        <span>生成路径</span><strong>/optional/:id?</strong>
      </div>
    </div>
  </article>
</template>

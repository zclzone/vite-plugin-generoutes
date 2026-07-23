<script setup lang="ts">
import { useRoute } from 'vue-router'

defineOptions({
  name: 'UserDetail',
  meta: {
    title: '用户详情',
    icon: 'user-detail',
  },
})

const route = useRoute()
</script>

<template>
  <section class="demo-page">
    <p class="page-kicker">
      Multiple dynamic parameters
    </p>
    <h2>一个文件，两个路径参数。</h2>
    <p><code>[id,name].vue</code> 依次生成 <code>:id/:name</code>，组成完整路径 <code>/user/:id/:name</code>。</p>
    <div class="param-grid">
      <div class="param">
        <span>id</span><strong>{{ route.params.id }}</strong>
      </div>
      <div class="param">
        <span>name</span><strong>{{ route.params.name }}</strong>
      </div>
    </div>
  </section>
</template>

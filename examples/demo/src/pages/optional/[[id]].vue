<template>
  <div class="page">
    <h2>可选参数路由</h2>
    <p>文件：<code>src/pages/optional/[[id]].vue</code></p>
    <p>路径：<code>/optional/:id?</code></p>
    <p>当前 ID：<strong>{{ $route.params.id || '未提供' }}</strong></p>
  </div>
</template>

<template>
  <div class="page">
    <h2>命名通配符路由</h2>
    <p>文件：<code>src/pages/files/[...segments].vue</code></p>
    <p>路径：<code>/files/:segments(.*)*</code></p>
    <p>当前路径片段：<strong>{{ $route.params.segments }}</strong></p>
  </div>
</template>

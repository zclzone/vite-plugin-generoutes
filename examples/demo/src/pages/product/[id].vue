<template>
  <div class="page">
    <h2>单参数动态路由</h2>
    <p>文件：<code>src/pages/product/[id].vue</code></p>
    <p>路径：<code>/product/:id</code></p>
    <p>当前商品 ID：<strong>{{ $route.params.id }}</strong></p>
  </div>
</template>

<template>
  <section class="demo-page">
    <p class="page-kicker">
      Directory catch-all
    </p>
    <h2>用户模块内没有这个页面。</h2>
    <p>该扁平路由只匹配 <code>/user</code> 下未被其他页面命中的路径。</p>
    <div class="callout">
      未匹配地址：<code>{{ $route.path }}</code>
    </div>
  </section>
</template>

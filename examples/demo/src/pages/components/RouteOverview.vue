<script setup>
import routes from 'virtual:vue-auto-pages'

function flattenRoutes(records, depth = 0) {
  return records.flatMap(route => [
    { depth, meta: route.meta, name: route.name, path: route.path, redirect: route.redirect },
    ...flattenRoutes(route.children || [], depth + 1),
  ])
}

const routeRecords = flattenRoutes(routes)
</script>

<template>
  <section class="route-overview">
    <h2>当前生成的路由</h2>
    <p>
      这个组件位于 <code>pages/components</code>，由 <code>ignoreFolders</code> 排除，但仍可作为普通组件使用。
    </p>
    <ul>
      <li v-for="(route, index) in routeRecords" :key="`${route.depth}:${route.path}:${route.name || index}`" :style="{ paddingLeft: `${route.depth * 20}px` }">
        <code>{{ route.path }}</code>
        <span>— {{ route.name || '(仅组织路径的目录)' }}</span>
        <span v-if="route.redirect"> → {{ route.redirect }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.route-overview {
  margin-top: 24px;
  padding: 16px;
  background: #f6f8fa;
  border-radius: 8px;
}

ul {
  padding: 0;
  list-style: none;
}

li {
  margin: 6px 0;
}
</style>

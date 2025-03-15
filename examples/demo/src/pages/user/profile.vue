<script setup>
defineOptions({
  name: 'UserProfile',
  parent: 'UserIndex',
  meta: {
    title: '用户资料',
    icon: 'profile',
  },
})
</script>

<template>
  <div class="page nested">
    <h2>用户资料页面</h2>
    <p>这是由文件 <code>src/pages/user/profile.vue</code> 生成的路由页面</p>
    <p>路由路径: <code>/user/profile</code></p>
    <div class="info-box">
      <h3>嵌套路由说明</h3>
      <p>这个页面通过 <code>parent: 'UserIndex'</code> 配置，指定了父路由为 UserIndex。</p>
      <p>在启用 <code>nested: true</code> 配置选项后，会自动生成嵌套的路由结构。</p>
      <p>注意：当前demo已启用 <code>nested: true</code> 配置。</p>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  background-color: #efefff;
  border-radius: 8px;
}

.nested {
  border-left: 4px solid #673ab7;
}

.info-box {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>

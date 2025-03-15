<script setup>
defineOptions({
  name: 'UserIndex',
  meta: {
    title: '用户列表',
    icon: 'user',
  },
})
</script>

<template>
  <div class="page">
    <h2>用户列表页面</h2>
    <p>这是由文件 <code>src/pages/user/index.vue</code> 生成的路由页面</p>
    <p>路由路径: <code>/user</code></p>
    <ul>
      <li>
        <router-link to="/user/123/zhang">
          用户: zhang (ID: 123)
        </router-link>
      </li>
      <li>
        <router-link to="/user/456/wang">
          用户: wang (ID: 456)
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  background-color: #efefff;
  border-radius: 8px;
}
</style>

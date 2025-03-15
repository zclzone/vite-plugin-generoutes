<script setup>
defineOptions({
  name: 'UserDetail',
  meta: {
    title: '用户详情',
    icon: 'user-detail',
  },
})

// 注: 在实际应用中可使用 useRoute() 获取路由参数
// const route = useRoute()
</script>

<script>
// import { useRoute } from 'vue-router'
</script>

<template>
  <div class="page">
    <h2>用户详情页面</h2>
    <p>这是由文件 <code>src/pages/user/[id,name].vue</code> 生成的路由页面</p>
    <p>路由路径: <code>/user/:id/:name</code></p>
    <div class="user-info">
      <p><strong>用户ID:</strong> {{ $route.params.id }}</p>
      <p><strong>用户名:</strong> {{ $route.params.name }}</p>
    </div>
    <div>
      <router-link to="/user">
        返回用户列表
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 20px;
  background-color: #efefff;
  border-radius: 8px;
}

.user-info {
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
  margin: 10px 0;
  border: 1px solid #ddd;
}
</style>

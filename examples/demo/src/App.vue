<script setup>
import RouteOverview from './pages/components/RouteOverview.vue'
</script>

<template>
  <div class="app-container">
    <header>
      <h1>vue-auto-pages 演示</h1>
      <nav class="nav-groups">
        <div>
          <strong>基础：</strong>
          <RouterLink to="/">
            首页
          </RouterLink>
          <RouterLink to="/home">
            默认布局
          </RouterLink>
          <RouterLink to="/detail">
            无布局
          </RouterLink>
          <RouterLink to="/dashboard">
            虚拟目录 + Admin 布局
          </RouterLink>
          <RouterLink to="/redirect">
            重定向
          </RouterLink>
        </div>
        <div>
          <strong>动态：</strong>
          <RouterLink to="/product/100">
            单参数
          </RouterLink>
          <RouterLink to="/user/123/zhang">
            多参数
          </RouterLink>
          <RouterLink to="/optional">
            可选参数（空）
          </RouterLink>
          <RouterLink to="/optional/88">
            可选参数（有值）
          </RouterLink>
          <RouterLink to="/files/docs/guide">
            命名通配符
          </RouterLink>
        </div>
        <div>
          <strong>目录路由：</strong>
          <RouterLink to="/user">
            index 路由
          </RouterLink>
          <RouterLink to="/user/profile">
            目录页面
          </RouterLink>
          <RouterLink to="/user/team/members">
            深层目录页面
          </RouterLink>
          <RouterLink to="/user/not/found">
            用户级通配符
          </RouterLink>
        </div>
        <div>
          <strong>排除与兜底：</strong>
          <RouterLink to="/disabled">
            enabled: false
          </RouterLink>
          <RouterLink to="/components/RouteOverview">
            ignoreFolders
          </RouterLink>
          <RouterLink to="/not-exist">
            根级 404
          </RouterLink>
        </div>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
    <RouteOverview />
    <footer>
      <p>vue-auto-pages · 约定式 Vue 文件路由</p>
    </footer>
  </div>
</template>

<style>
.app-container {
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

nav {
  margin-top: 10px;
}

.nav-groups {
  display: grid;
  gap: 10px;
}

.nav-groups > div {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

nav a {
  color: #333;
  text-decoration: none;
}

nav a.router-link-active {
  color: #42b983;
  font-weight: bold;
}

footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
  text-align: center;
  color: #999;
}
</style>

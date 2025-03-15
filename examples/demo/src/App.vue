<template>
  <div class="app-container">
    <header>
      <h1>vite-plugin-generoutes 演示</h1>
      <nav>
        <router-link to="/">
          首页
        </router-link> |
        <router-link to="/home">
          Home
        </router-link> |
        <router-link to="/detail">
          详情
        </router-link> |
        <router-link to="/user">
          用户
        </router-link> |
        <router-link to="/user/profile">
          用户资料
        </router-link> |
        <router-link to="/user/123/zhang">
          用户详情
        </router-link> |
        <router-link to="/dashboard">
          管理面板
        </router-link> |
        <router-link to="/redirect">
          重定向示例
        </router-link> |
        <router-link to="/not-exist">
          404演示
        </router-link>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
    <footer>
      <p>vite-plugin-generoutes - 基于文件系统的路由生成插件</p>
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

nav a {
  color: #333;
  margin-right: 5px;
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

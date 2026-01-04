<script setup lang="ts">

</script>

<template>
  <div class="app-container">
    <header>
      <h1>vite-plugin-generoutes TypeScript 演示</h1>
      <nav>
        <router-link to="/">
          首页
        </router-link> |
        <router-link to="/home">
          Home
        </router-link> |
        <router-link to="/about">
          关于
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
        <router-link to="/not-exist">
          404页面
        </router-link>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <footer>
      <p>TypeScript 示例 - 路由文件带有完整类型支持</p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, sans-serif;
  color: #333;
  background-color: #f5f5f5;
}

.app-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  color: white;
}

header h1 {
  margin-bottom: 15px;
  font-size: 1.5rem;
}

nav {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.3);
  font-weight: bold;
}

main {
  min-height: 300px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

footer {
  margin-top: 20px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}
</style>

# vite-plugin-generoutes 演示项目

这是 vite-plugin-generoutes 的演示项目，展示了该插件的各种功能和用法。

## 项目运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 功能演示

本演示项目展示了以下功能：

1. **基本路由生成**
   - 基于文件系统自动生成路由配置
   - 支持不同的路由命名和路径生成规则

2. **动态路由**
   - 单参数动态路由 `/user/:id`
   - 多参数动态路由 `/user/:id/:name`
   - 通配符路由 `/:pathMatch(.*)*`（用于404页面）

3. **虚拟目录**
   - 使用 `(admin)` 作为虚拟目录，生成的路由路径会忽略这一层
   - 实现功能分组而不影响URL结构

4. **自定义路由配置**
   - 使用 `defineOptions` 设置路由名称、元数据等
   - 自定义路由元数据，如 `title`、`icon`、`requiresAuth` 等

5. **嵌套路由**
   - 使用 `parent` 配置项创建嵌套路由关系
   - 在 `vite.config.js` 中启用 `nested: true` 选项

6. **路由重定向**
   - 使用 `redirect` 配置项将一个路由重定向到另一个路由
   - 例如，将 `/redirect` 路径重定向到 `/home`

## 文件结构

```
src/
├── pages/               # 页面文件夹
│   ├── index.vue        # 首页 (/)
│   ├── home.vue         # Home页面 (/home)
│   ├── detail.vue       # 详情页面 (/detail)
│   ├── redirect.vue     # 重定向示例 (重定向到 /home)
│   ├── [...all].vue     # 通配符路由，用于处理404 (/:pathMatch(*)*)
│   ├── (admin)/         # 虚拟目录，不会影响生成的路由路径
│   │   └── dashboard.vue # 管理面板页面 (/dashboard)
│   └── user/            # 用户相关页面
│       ├── index.vue     # 用户列表页面 (/user)
│       ├── profile.vue   # 用户资料页面 (/user/profile)
│       └── [id,name].vue # 用户详情页面 (/user/:id/:name)
└── router/
    └── routes.js        # 由插件自动生成的路由配置文件
```

## vite.config.js 配置

```js
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import Generoutes from 'vite-plugin-generoutes'

export default defineConfig({
  plugins: [
    vue(),
    Generoutes({ nested: true }),
  ],
})
```

## 相关资源

- [插件文档](https://github.com/zclzone/vite-plugin-generoutes)
- [问题反馈](https://github.com/zclzone/vite-plugin-generoutes/issues)

---

作者: [Ronnie Zhang](https://isme.top)

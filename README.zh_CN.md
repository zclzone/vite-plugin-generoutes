# vite-plugin-generoutes

一个基于文件系统自动生成Vue路由配置的Vite插件。

### ✨ 特性

- 📁 基于文件系统的路由生成
- 🔄 支持动态路由和嵌套路由
- 🛠️ 热重载 - 文件变化时自动更新路由
- 🎨 可自定义路由配置
- 🧩 支持通过`defineOptions`设置路由元数据
- 🚦 支持路由重定向

### 📦 安装

```bash
# npm
npm install vite-plugin-generoutes -D

# yarn
yarn add vite-plugin-generoutes -D

# pnpm
pnpm add vite-plugin-generoutes -D
```

### 🔨 使用方法

在`vite.config.js`中配置插件：

```javascript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import generoutes from 'vite-plugin-generoutes'

export default defineConfig({
  plugins: [
    vue(),
    generoutes({
      // 配置选项
    })
  ]
})
```

### ⚙️ 配置选项

| 选项            | 类型       | 默认值           | 描述                                                                                      |
| --------------- | ---------- | ---------------- | ----------------------------------------------------------------------------------------- |
| `pagesFolder`   | `string`   | `'src/pages'`    | 页面文件夹路径                                                                            |
| `ignoreFolders` | `string[]` | `['components']` | 生成路由时忽略的文件夹                                                                    |
| `routesPath`    | `string`   | 自动检测         | 生成的路由文件路径，根据 `tsconfig.json` 是否存在自动检测（存在则为 `.ts`，否则为 `.js`） |
| `nested`        | `boolean`  | `false`          | 是否生成嵌套路由                                                                          |

### 📘 TypeScript 支持

本插件对 TypeScript 提供一流支持：

- **自动检测**：通过检查 `tsconfig.json` 自动检测 TypeScript 项目
- **类型定义**：为 TypeScript 项目生成路由时，插件会自动包含 `RouteMeta` 和 `GeneratedRoute` 的类型定义
- **路由类型**：生成的路由使用 `vue-router` 的 `RouteRecordRaw` 进行正确的类型标注

### 📝 路由规则

#### 基本路由

- `src/pages/index.vue` -> `/`
- `src/pages/about.vue` -> `/about`
- `src/pages/users/index.vue` -> `/users`
- `src/pages/users/profile.vue` -> `/users/profile`

#### 动态路由

- `src/pages/users/[id].vue` -> `/users/:id`
- `src/pages/users/[...all].vue` -> `/users/:pathMatch(.*)*`
- `src/pages/[org]/[repo].vue` -> `/:org/:repo`

#### 虚拟目录

- 文件名带括号的路径会被当做虚拟目录，生成的路由path会忽略带括号的这一层路径
- 例如：`src/pages/(auth)/login.vue` -> `/login`

### 🧠 自定义路由

您可以在Vue文件中使用`defineOptions`来自定义路由配置：

```vue
<script setup>
defineOptions({
  name: 'CustomRouteName',
  meta: {
    title: '页面标题',
    icon: 'home',
    requiresAuth: true,
    enabled: true // 设置为false则不会生成此路由
  },
  redirect: '/other-route' // 设置重定向
})
</script>
```

### 🌲 嵌套路由

启用`nested: true`选项后，可以通过`parent`属性设置嵌套路由关系：

```vue
<script setup>
defineOptions({
  name: 'ChildRoute',
  parent: 'ParentRouteName',
  meta: {
    title: '子路由'
  }
})
</script>
```

### 🚀 完整示例

```javascript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import generoutes from 'vite-plugin-generoutes'

export default defineConfig({
  plugins: [
    vue(),
    generoutes({
      pagesFolder: 'src/views',
      ignoreFolders: ['components', 'assets'],
      routesPath: 'src/router/routes.js',
      nested: true
    })
  ],
})
```

### 💡 常见问题

1、路由的path报红：*找不到模块“/src/pages/xxx.vue”或其相应的类型声明。*，按F12无法跳转至对应的文件

解决方法：在 jsconfig.json 或者 tsconfig.json 的 compilerOptions中添加如下配置
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "/src/*": ["src/*"]
    }
  }
}
```

[English Documentation](./README.md)

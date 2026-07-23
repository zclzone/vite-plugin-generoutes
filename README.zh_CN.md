# vue-auto-pages

面向 Vue 与 Vite 的约定式文件路由插件。它将 Vue 页面转换为带类型的 Vue Router 路由，支持布局，并通过 virtual module 提供路由和热更新。

[English](./README.md)

## 环境要求

- Node.js `^20.19.0` 或 `>=22.12.0`
- Vite `>=6.4.1`
- Vue Router `>=4.0.0`

## 功能

- 基于文件系统生成路由
- 支持静态、动态、可选、多参数和通配符路由
- 根据文件路径生成完整路径的扁平路由
- 支持默认布局、命名布局和无布局页面
- 静态解析 `defineOptions`，不会执行应用代码
- 提供带类型的路由元数据和自定义业务字段
- 支持路由重定向和禁用页面
- 通过 virtual module 输出，不生成路由源码文件
- 使用内存页面索引进行增量热更新
- 构建阶段校验歧义和非法路由

## 安装

```bash
pnpm add -D vue-auto-pages
```

## 配置

在 `vite.config.ts` 中注册插件：

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import VueAutoPages from 'vue-auto-pages'

export default defineConfig({
  plugins: [
    vue(),
    VueAutoPages(),
  ],
})
```

从 `virtual:vue-auto-pages` 导入生成的路由：

```ts
import routes from 'virtual:vue-auto-pages'
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
```

## TypeScript

在 `tsconfig.json` 中加入客户端类型：

```json
{
  "compilerOptions": {
    "types": [
      "vite/client",
      "vue-auto-pages/client"
    ]
  }
}
```

`virtual:vue-auto-pages` 的默认导出类型为 `RouteRecordRaw[]`。包还会导出 `RouteMeta`、`Options`、`VueAutoPages` 和 `virtualModuleId`。

## 配置项

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `pagesFolder` | `string` | `'src/pages'` | 相对于 Vite 根目录的页面目录 |
| `layoutsFolder` | `string` | `'src/layouts'` | 相对于 Vite 根目录的布局目录 |
| `ignoreFolders` | `string[]` | `['components']` | 不参与路由生成的页面子目录 |
| `defaultLayout` | `string \| false` | `'default'` | 页面未设置 `meta.layout` 时使用的布局；`false` 表示默认无布局 |

完整配置示例：

```ts
VueAutoPages({
  pagesFolder: 'src/views',
  layoutsFolder: 'src/shells',
  ignoreFolders: ['components', 'partials'],
  defaultLayout: false,
})
```

## 运行机制

插件在 Vite 配置阶段执行以下流程：

1. 根据 Vite 根目录解析页面和布局目录。
2. 异步扫描 Vue 页面并建立内存页面索引。
3. 使用 Vue SFC Parser 对每个页面解析一次。
4. 使用 Babel AST 静态读取 `<script setup>` 中的 `defineOptions`，不会执行源码。
5. 根据文件路径生成 route name、path、component、redirect 和 meta。
6. 对扁平路由排序，使静态路由优先于动态路由和通配符路由。
7. 校验路由唯一性、动态语法和布局。
8. 使用选择的布局包裹路由。
9. 将最终路由序列化为 `virtual:vue-auto-pages` 模块。

插件不会向应用源码目录写入 `routes.ts` 或 `routes.js`。

## 文件路由约定

### 基础路由

```text
src/pages/index.vue          -> /
src/pages/about.vue          -> /about
src/pages/users/index.vue    -> /users
src/pages/users/profile.vue  -> /users/profile
```

`index.vue` 表示所在目录，不会在 URL 中增加 `index`。

### 虚拟目录

括号目录只用于组织文件，不会进入 URL：

```text
src/pages/(auth)/login.vue -> /login
```

### 动态路由

```text
src/pages/users/[id].vue          -> /users/:id
src/pages/users/[id,name].vue     -> /users/:id/:name
src/pages/users/[[id]].vue        -> /users/:id?
src/pages/files/[...segments].vue -> /files/:segments(.*)*
src/pages/[...all].vue            -> /:pathMatch(.*)*
```

参数名必须使用 JavaScript 风格的合法标识符，不支持的括号语法会使构建失败。

### 默认路由名称

名称由路径片段自动生成：

```text
src/pages/user/profile.vue -> User_Profile
```

需要稳定的自定义名称时可以使用 `defineOptions({ name: '...' })`。

## 页面路由配置

插件只读取静态 `defineOptions`：

```vue
<script setup lang="ts">
defineOptions({
  name: 'Dashboard',
  redirect: '/home',
  meta: {
    title: '管理面板',
    layout: 'admin',
    keepAlive: true,
    enabled: true,
    permissions: ['dashboard:read'],
  },
})
</script>
```

支持的顶层字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 覆盖自动生成的路由名称 |
| `redirect` | `string` | 生成不含页面 component 的重定向路由 |
| `meta` | 静态对象 | Vue Router 路由元数据 |

支持静态字符串、数字、布尔值、null、数组、对象、无插值模板字符串、简单一元表达式和 TypeScript 断言包装。函数调用、展开语法、计算属性和其他动态表达式会使构建失败。

## RouteMeta

```ts
interface RouteMeta {
  layout?: string | false
  keepAlive?: boolean
  enabled?: boolean
  [key: string]: unknown
}
```

插件会在构建阶段校验三个内置字段。业务字段保持为 `unknown`，应用使用前应进行类型收窄，也可以在项目中扩展 Vue Router 类型。

`enabled: false` 会将页面从生成路由树中排除。

## 布局

页面未设置 `meta.layout` 时使用 `defaultLayout`。默认值为 `default`，对应 `src/layouts/default.vue`。

使用命名布局：

```ts
defineOptions({
  meta: {
    layout: 'admin',
  },
})
```

此时必须存在 `src/layouts/admin.vue`。

单个页面禁用布局：

```ts
defineOptions({
  meta: {
    layout: false,
  },
})
```

整个项目默认不使用布局：

```ts
VueAutoPages({
  defaultLayout: false,
})
```

全局默认无布局时，页面仍可以显式选择命名布局。布局文件必须存在，并且路径必须位于 `layoutsFolder` 内。

## 热更新与性能

开发服务器会在内存中维护页面路由信息：

- 启动时使用异步 glob 和并行异步读取。
- 每次更新只解析一次对应 SFC。
- 页面变更时只重新解析当前页面，并复用 Vite 提供的内存源码。
- 普通模板和样式修改继续使用 Vue 原生 HMR。
- `defineOptions` 中与路由有关的内容变化时刷新 virtual module。
- 页面新增和删除会增量更新内存索引。
- 布局组件修改使用 Vue HMR，布局新增和删除会刷新路由生成。
- 插件只重新加载 virtual module，不写入路由文件，也不会无条件触发整页刷新。

## 构建失败规则

以下情况会抛出明确错误并中止构建：

- 路由名称重复
- 路由路径重复
- 动态路由语法非法
- `defineOptions` 静态值非法
- `layout`、`keepAlive` 或 `enabled` 类型错误
- 布局文件不存在
- 布局路径超出 `layoutsFolder`
- Vue SFC 或脚本解析失败

这样可以避免生成不完整或存在歧义的路由树。

## 常见问题

如果编辑器提示无法解析 `/src/pages/example.vue`，可以增加绝对源码路径映射：

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

## 仓库验证

```bash
pnpm lint
pnpm build
pnpm verify
pnpm --filter vue-auto-pages-demo build
pnpm --filter vue-auto-pages-demo-ts build
npm pack --dry-run
```

发布包包含 `dist/index.js`、`dist/index.d.ts` 和 `client.d.ts`。

## License

[MIT](./LICENSE)

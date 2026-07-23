# vue-auto-pages 演示项目

这是 vue-auto-pages 的 JavaScript 演示项目，展示插件的各种功能和用法。

## 项目运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 功能演示

这个可运行项目覆盖插件的全部正常使用场景：

- 从 `virtual:vue-auto-pages` 默认导入路由，不生成路由文件
- 普通页面、`index.vue`、自动名称和 `defineOptions.name`
- 自定义业务 meta，以及内置的 `layout`、`keepAlive`、`enabled`
- `enabled: false` 排除页面、`redirect` 路由
- 单参数、多参数、可选参数、命名通配符和根级 404 通配符
- `(admin)` 虚拟目录
- 多层目录生成完整路径的扁平路由，以及 `index.vue` 省略 index 路径片段
- `defaultLayout: false` 全局默认无布局，页面显式启用 `default` 或 `admin` 布局
- `ignoreFolders` 排除 `pages/components`，被排除的文件仍作为普通 Vue 组件使用
- 页面、布局和 defineOptions 变化的热更新

重复 name/path、非法动态参数、非法或不存在的布局等失败场景无法放进可运行 demo，由仓库根目录的 `pnpm verify` 验证。

## 文件结构

```
src/
├── layouts/
│   ├── default.vue
│   └── admin.vue
├── pages/
│   ├── index.vue                    # /，默认无布局
│   ├── home.vue                     # /home，显式使用 default 布局
│   ├── disabled.vue                 # enabled: false，不生成路由
│   ├── [...all].vue                 # /:pathMatch(.*)*
│   ├── (admin)/dashboard.vue        # /dashboard，虚拟目录 + admin 布局
│   ├── product/[id].vue             # /product/:id
│   ├── optional/[[id]].vue          # /optional/:id?
│   ├── files/[...segments].vue      # /files/:segments(.*)*
│   ├── components/RouteOverview.vue # 被 ignoreFolders 排除
│   └── user/
│       ├── index.vue                # /user
│       ├── profile.vue              # /user/profile
│       ├── [id,name].vue            # /user/:id/:name
│       ├── team/index.vue           # /user/team
│       └── team/members.vue         # /user/team/members
├── App.vue
└── main.js                          # 导入 virtual:vue-auto-pages
```

## vite.config.js 配置

```js
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import VueAutoPages from 'vue-auto-pages'

export default defineConfig({
  plugins: [
    vue(),
    VueAutoPages({
      pagesFolder: 'src/pages',
      layoutsFolder: 'src/layouts',
      ignoreFolders: ['components'],
      defaultLayout: false,
    }),
  ],
})
```

## 热更新演示

启动 `pnpm dev` 后可以直接尝试：

1. 修改任意页面的 `defineOptions`，观察下方生成路由列表更新。
2. 在 `pages` 下新增或删除 Vue 文件，观察 virtual module 自动更新。
3. 修改 `default.vue` 或 `admin.vue`，观察布局走 Vue 原生 HMR。

## 相关资源

- [插件文档](https://github.com/zclzone/vue-auto-pages)
- [问题反馈](https://github.com/zclzone/vue-auto-pages/issues)

---

作者: [Ronnie Zhang](https://isme.top)

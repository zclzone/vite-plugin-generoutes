# vue-auto-pages TypeScript 路由实验台

这个演示以可交互实验台展示插件的所有正常使用场景。左侧选择文件路由场景，中间通过“源文件 → 生成结果 → 实际行为”查看匹配原因和页面，右侧查看 `virtual:vue-auto-pages` 实时生成的路由树。

## 运行

```bash
pnpm install
pnpm --filter vue-auto-pages-demo-ts dev
```

## 覆盖能力

- `virtual:vue-auto-pages` 默认路由导入和 `vue-auto-pages/client` 类型声明
- `pagesFolder`、`layoutsFolder`、`ignoreFolders`、`defaultLayout` 四项配置
- 普通路由、index 路由、自动名称、自定义 name 和业务 meta
- `enabled`、`keepAlive`、`layout` 内置 meta
- 单参数、多参数、可选参数、命名通配符、目录通配符和根级 404
- `(admin)` 虚拟目录和 redirect 路由
- 全局默认无布局，以及页面显式使用 `default`、`home` 布局
- 多层目录生成完整路径的扁平路由，以及 index 文件省略 index 路径片段
- 忽略 `pages/components`，同时把其中的 RouteInspector 作为普通组件使用
- 页面增删、defineOptions 和布局变化的 HMR

重复 name/path、非法动态参数、布局不存在等构建失败场景不能放进可运行 demo，请在仓库根目录运行：

```bash
pnpm verify
```

## 热更新观察

启动开发服务器后可以直接操作：

1. 修改任意页面的静态 `defineOptions`，观察右侧路由树更新。
2. 在 pages 下新增或删除 Vue 文件，观察 virtual module 自动更新。
3. 修改两个布局文件，观察 Vue 原生 HMR。

TypeScript 自定义 meta 字段通过 `[key: string]: unknown` 暴露。`main.ts` 展示了先收窄 `title` 类型再设置文档标题的推荐方式。

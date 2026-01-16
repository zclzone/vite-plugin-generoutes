# vite-plugin-generoutes

A Vite plugin that automatically generates Vue router configuration based on file system.

### 📋 Prerequisites

- **Node.js**: `20.12.0` or higher

### ✨ Features

- 📁 File-system based routing
- 🔄 Dynamic and nested routes support
- 🛠️ Hot reload - routes update when files change
- 🎨 Customizable route configuration
- 🧩 Support for route metadata via `defineOptions`
- 🚦 Route redirection support
- 🖼️ Layout-based route grouping

### 📦 Installation

```bash
# npm
npm install vite-plugin-generoutes -D

# yarn
yarn add vite-plugin-generoutes -D

# pnpm
pnpm add vite-plugin-generoutes -D
```

### 🔨 Usage

Configure the plugin in your `vite.config.js`:

```javascript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import generoutes from 'vite-plugin-generoutes'

export default defineConfig({
  plugins: [
    vue(),
    generoutes({
      // options
    })
  ]
})
```

### ⚙️ Configuration Options

| Option          | Type       | Default          | Description                                                                                                       |
| --------------- | ---------- | ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| `pagesFolder`   | `string`   | `'src/pages'`    | Path to pages folder                                                                                              |
| `layoutsFolder` | `string`   | `'src/layouts'`  | Path to layouts folder                                                                                            |
| `ignoreFolders` | `string[]` | `['components']` | Folders to ignore when generating routes                                                                          |
| `routesPath`    | `string`   | Auto-detected    | Path to generated routes file. Auto-detected based on `tsconfig.json` presence (`.ts` if exists, otherwise `.js`) |

### 📘 TypeScript Support

This plugin has first-class TypeScript support:

- **Auto-detection**: Automatically detects TypeScript projects by checking for `tsconfig.json`
- **Type definitions**: When generating routes for TypeScript projects, the plugin automatically includes type definitions for `RouteMeta` and `GeneratedRoute`
- **Route typing**: Generated routes are properly typed with `RouteRecordRaw` from `vue-router`

### 📝 Routing Conventions

#### Basic Routes

- `src/pages/index.vue` -> `/`
- `src/pages/about.vue` -> `/about`
- `src/pages/users/index.vue` -> `/users`
- `src/pages/users/profile.vue` -> `/users/profile`

#### Dynamic Routes

- `src/pages/users/[id].vue` -> `/users/:id`
- `src/pages/users/[...all].vue` -> `/users/:pathMatch(.*)*`
- `src/pages/[org]/[repo].vue` -> `/:org/:repo`

#### Virtual Directories

- Paths with parentheses in the filename are treated as virtual directories. The parenthesized part will be omitted in the generated route path.
- For example: `src/pages/(auth)/login.vue` -> `/login`

### 🧠 Custom Routes

You can use `defineOptions` in your Vue files to customize route configuration:

```vue
<script setup>
defineOptions({
  name: 'CustomRouteName',
  meta: {
    title: 'Page Title',
    icon: 'home',
    requiresAuth: true,
    enabled: true // Set to false to exclude this route
  },
  redirect: '/other-route' // Set redirection
})
</script>
```

### 🌲 Nested Routes

Use the `parent` property to set nested route relationships (handled automatically):

```vue
<script setup>
defineOptions({
  name: 'ChildRoute',
  parent: 'ParentRouteName',
  meta: {
    title: 'Child Route'
  }
})
</script>
```

### �️ Layout Routes

Routes are automatically grouped by their `meta.layout` property and wrapped with a parent layout route:

- Routes with `meta.layout: false` will **not** be wrapped with a layout
- Routes without `meta.layout` will use the `'default'` layout by default
- Routes with `meta.layout: 'xxx'` will use the corresponding layout component from `layoutsFolder`

```vue
<!-- src/pages/login.vue - No layout wrapper -->
<script setup>
defineOptions({
  name: 'Login',
  meta: {
    layout: false
  }
})
</script>
```

```vue
<!-- src/pages/home.vue - Uses 'admin' layout -->
<script setup>
defineOptions({
  name: 'Home',
  meta: {
    layout: 'admin'
  }
})
</script>
```

**Generated route structure example:**

```javascript
[
  // Routes with layout: false are not wrapped
  {
    name: 'Login',
    path: '/login',
    component: () => import('/src/pages/login.vue'),
    meta: { layout: false }
  },
  // Routes are grouped by layout
  {
    name: 'LAYOUT_DEFAULT',
    path: '/__layout_default__',
    component: () => import('/src/layouts/default.vue'),
    children: [
      { name: 'Index', path: '/' }
    ]
  },
  {
    name: 'LAYOUT_ADMIN',
    path: '/__layout_admin__',
    component: () => import('/src/layouts/admin.vue'),
    children: [
      { name: 'Home', path: '/home' }
    ]
  }
]
```

### �🚀 Complete Example

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
      routesPath: 'src/router/routes.js'
    })
  ]
})
```

### 💡 Troubleshooting

**Issue**: Route path shows error: *Cannot find module "/src/pages/xxx.vue" or its corresponding type declarations.* Unable to navigate to the file with F12.

**Solution**: Add the following configuration to the `compilerOptions` in your `jsconfig.json` or `tsconfig.json`:
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

[中文文档](./README.zh_CN.md)

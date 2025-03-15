# vite-plugin-generoutes

A Vite plugin that automatically generates Vue router configuration based on file system.

### ✨ Features

- 📁 File-system based routing
- 🔄 Dynamic and nested routes support
- 🛠️ Hot reload - routes update when files change
- 🎨 Customizable route configuration
- 🧩 Support for route metadata via `defineOptions`
- 🚦 Route redirection support

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

Configure the plugin in your `vite.config.ts`:

```typescript
import vue from '@vitejs/plugin-vue'
// vite.config.ts
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

| Option          | Type       | Default                  | Description                                             |
| --------------- | ---------- | ------------------------ | ------------------------------------------------------- |
| `pagesFolder`   | `string`   | `'src/pages'`            | Path to pages folder                                    |
| `ignoreFolders` | `string[]` | `['components']`         | Folders to ignore when generating routes                |
| `routesPath`    | `string`   | `'src/router/routes.js'` | Path to generated routes file, can also be a `.ts` file |
| `nested`        | `boolean`  | `false`                  | Whether to generate nested routes                       |

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

With the `nested: true` option enabled, you can set nested route relationships using the `parent` property:

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

### 🚀 Complete Example

```typescript
import vue from '@vitejs/plugin-vue'
// vite.config.ts
import { defineConfig } from 'vite'
import generoutes from 'vite-plugin-generoutes'

export default defineConfig({
  plugins: [
    vue(),
    generoutes({
      pagesFolder: 'src/views',
      ignoreFolders: ['components', 'assets'],
      routesPath: 'src/router/routes.ts',
      nested: true
    })
  ]
})
```

[中文文档](./README.zh_CN.md)

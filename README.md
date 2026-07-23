# vue-auto-pages

Convention-based file routing for Vue and Vite. It turns Vue files into typed Vue Router records, supports layouts, and exposes everything through a virtual module with HMR support.

[中文文档](./README.zh_CN.md)

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- Vite `>=6.4.1`
- Vue Router `>=4.0.0`

## Features

- File-system based routes
- Static, dynamic, optional, multi-parameter, and catch-all routes
- Flat route records with full paths derived from the file path
- Default, named, and disabled layouts
- Static `defineOptions` parsing without executing application code
- Typed route metadata with custom business fields
- Route redirects and disabled pages
- Virtual module output without generated source files
- Incremental HMR with an in-memory page index
- Build-time validation for ambiguous or invalid routes

## Installation

```bash
pnpm add -D vue-auto-pages
```

## Setup

Configure the plugin in `vite.config.ts`:

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

Import the generated routes from `virtual:vue-auto-pages`:

```ts
import routes from 'virtual:vue-auto-pages'
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
```

## TypeScript

Add the client declaration to `tsconfig.json`:

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

The default export from `virtual:vue-auto-pages` is typed as `RouteRecordRaw[]`. The package also exports `RouteMeta`, `Options`, `VueAutoPages`, and `virtualModuleId`.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `pagesFolder` | `string` | `'src/pages'` | Page directory relative to the Vite root |
| `layoutsFolder` | `string` | `'src/layouts'` | Layout directory relative to the Vite root |
| `ignoreFolders` | `string[]` | `['components']` | Page subdirectories excluded from route generation |
| `defaultLayout` | `string \| false` | `'default'` | Layout used when `meta.layout` is absent; `false` disables layouts by default |

Example with every option:

```ts
VueAutoPages({
  pagesFolder: 'src/views',
  layoutsFolder: 'src/shells',
  ignoreFolders: ['components', 'partials'],
  defaultLayout: false,
})
```

## How it works

During Vite configuration, the plugin:

1. Resolves the page and layout directories from the Vite root.
2. Scans Vue page files asynchronously and builds an in-memory page index.
3. Parses each Vue SFC once with the Vue SFC parser.
4. Reads `defineOptions` from `<script setup>` with a Babel AST without executing source code.
5. Converts file paths into route names, paths, components, redirects, and metadata.
6. Sorts the flat route records so static routes take priority over dynamic and catch-all routes.
7. Validates route uniqueness, dynamic syntax, and layouts.
8. Wraps routes with their selected layouts.
9. Serializes the result as the `virtual:vue-auto-pages` module.

No `routes.ts` or `routes.js` file is written to the application source directory.

## File routing conventions

### Basic routes

```text
src/pages/index.vue          -> /
src/pages/about.vue          -> /about
src/pages/users/index.vue    -> /users
src/pages/users/profile.vue  -> /users/profile
```

An `index.vue` represents its directory and does not add `index` to the URL.

### Virtual directories

Parenthesized directories organize files without affecting the URL:

```text
src/pages/(auth)/login.vue -> /login
```

### Dynamic routes

```text
src/pages/users/[id].vue          -> /users/:id
src/pages/users/[id,name].vue     -> /users/:id/:name
src/pages/users/[[id]].vue        -> /users/:id?
src/pages/files/[...segments].vue -> /files/:segments(.*)*
src/pages/[...all].vue            -> /:pathMatch(.*)*
```

Parameter names must use JavaScript-style identifiers. Unsupported bracket syntax fails the build.

### Default route names

Names are generated from path segments:

```text
src/pages/user/profile.vue -> User_Profile
```

Use `defineOptions({ name: '...' })` when a stable custom name is required.

## Route configuration

The plugin reads only static `defineOptions` values:

```vue
<script setup lang="ts">
defineOptions({
  name: 'Dashboard',
  redirect: '/home',
  meta: {
    title: 'Dashboard',
    layout: 'admin',
    keepAlive: true,
    enabled: true,
    permissions: ['dashboard:read'],
  },
})
</script>
```

Supported top-level fields:

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Overrides the generated route name |
| `redirect` | `string` | Creates a redirect route without a page component |
| `meta` | static object | Vue Router metadata |

Static strings, numbers, booleans, null, arrays, objects, template strings without interpolation, simple unary expressions, and TypeScript assertion wrappers are supported. Function calls, spreads, computed properties, and other dynamic expressions fail the build.

## RouteMeta

```ts
interface RouteMeta {
  layout?: string | false
  keepAlive?: boolean
  enabled?: boolean
  [key: string]: unknown
}
```

The three built-in fields are validated at build time. Business fields remain `unknown`, so applications can narrow them before use or augment Vue Router types locally.

`enabled: false` excludes the page from the generated route tree.

## Layouts

Pages without `meta.layout` use `defaultLayout`, which defaults to `default` and resolves to `src/layouts/default.vue`.

Use a named layout:

```ts
defineOptions({
  meta: {
    layout: 'admin',
  },
})
```

This requires `src/layouts/admin.vue`.

Disable layout for one page:

```ts
defineOptions({
  meta: {
    layout: false,
  },
})
```

Disable layouts by default for the entire project:

```ts
VueAutoPages({
  defaultLayout: false,
})
```

Pages may still opt into a named layout when the global default is `false`. Layout files must exist and remain inside `layoutsFolder`.

## HMR and performance

The development server keeps parsed route information in memory:

- Startup uses an asynchronous glob and parallel asynchronous reads.
- Each SFC is parsed once per update.
- A page change reparses only that page and reuses Vite's in-memory source.
- Normal template and style changes stay on Vue's native HMR path.
- Route-related changes to `defineOptions` refresh the virtual route module.
- Page additions and removals update the in-memory index incrementally.
- Layout component edits use Vue HMR; layout additions and removals refresh route generation.
- The plugin reloads the virtual module instead of writing route files or forcing an unconditional full-page reload.

## Build-time validation

The build fails with a clear error for:

- Duplicate route names
- Duplicate route paths
- Invalid dynamic route syntax
- Invalid static `defineOptions` values
- Invalid `layout`, `keepAlive`, or `enabled` types
- Missing layout files
- Layout paths outside `layoutsFolder`
- Vue SFC or script parse errors

This avoids shipping a partial or ambiguous route tree.

## Troubleshooting

If an editor reports that `/src/pages/example.vue` cannot be resolved, add an absolute source alias:

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

## Repository verification

```bash
pnpm lint
pnpm build
pnpm verify
pnpm --filter vue-auto-pages-demo build
pnpm --filter vue-auto-pages-demo-ts build
npm pack --dry-run
```

The published package contains `dist/index.js`, `dist/index.d.ts`, and `client.d.ts`.

## License

[MIT](./LICENSE)

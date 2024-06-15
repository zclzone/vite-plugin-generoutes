# vite-plugin-generoutes

A Vite plugin that generates routes based on the file structure, supports dynamic routes, and supports custom meta data for each route.

## Usage

1. Install the plugin:

```bash
npm install vite-plugin-generoutes
```

2. Add the plugin to your `vite.config.js`:

```js
import { defineConfig } from 'vite'
import generoutes from 'vite-plugin-generoutes'

export default defineConfig({
  plugins: [
    generoutes()
    // ... other plugins
  ]
})
```

3. Create your page files(`index.vue` or `[...all].vue`) in the `src/pages` directory. Each file in this directory will be treated as a route.

```
src/routes/pages
├── index.vue
├── [...all].vue
├── user/
│   ├── index.vue
│   ├── [id]
│   │   └── index.vue
└── post
    ├── index.vue
    └── [...all].vue
```

The above example will generate the routes file `src/router/generoutes/index.js` with the following content:
```js
export const routes = [
  {
    name: 'Index',
    path: '/',
    component: () => import('/src/pages/index.vue'),
    meta: {
      title: 'Index',
      show: true,
      keepAlive: false,
    },
  },
  {
    name: 'User',
    path: '/user',
    component: () => import('/src/pages/user/index.vue'),
    meta: {
      title: 'User',
      show: true,
      keepAlive: false,
    },
  },
  {
    name: 'User_[id]',
    path: '/user/:id',
    component: () => import('/src/pages/user/[id]/index.vue'),
    meta: {
      title: 'User_[id]',
      show: true,
      keepAlive: false,
    },
  },
  {
    name: 'User_Post',
    path: '/user/post',
    component: () => import('/src/pages/user/post/index.vue'),
    meta: {
      title: 'User_Post',
      show: true,
      keepAlive: false,
    },
  },
  {
    name: 'Index_[...all]',
    path: '/:pathMatch(.*)*',
    component: () => import('/src/pages/[...all].vue'),
    meta: {
      title: '404 Not Found',
      show: true,
      keepAlive: false,
    },
  },
  {
    name: 'User_Post_[...all]',
    path: '/user/post/:pathMatch(.*)*',
    component: () => import('/src/pages/user/post/[...all].vue'),
    meta: {
      title: 'User_Post_[...all]',
      show: true,
      keepAlive: false,
    },
  },
]
```

4. Import the generated routes and create a router instance:

```js
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './generoutes'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
```

## Features

- Generate routes based on the file structure.
- Support dynamic routes.
- Support multiple NotFound routes.
- Support custom meta data for each route.
- Support ghost paths, For example, the (admin) folder will not be part of the route path, which is very useful for folder grouping.
- Support immediate update of the routes file when the file structure or defineOptions changes.

## Custom route info，including name and meta

You can define `name` and `meta` fields in the `defineOptions` of your `.vue` file, which will be used to override the default properties of the generated route. The `name` field will be used as the route name, which is very useful for `KeepAlive`. Any property in `defineOptions.meta` will be used as a property of the route `meta`, which makes the route metadata very flexible.

When you make any changes that may affect the route result, the `src/router/generoutes/index.js` file will be updated immediately, and the page will be refreshed without restarting the server.

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import Generoutes from 'vite-plugin-generoutes'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Generoutes({
      // routesPath 会根据 tsconfig.json 的存在自动设置为 .ts 或 .js
      nested: true,
    }),
  ],
})

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import Generoutes from 'vite-plugin-generoutes'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Generoutes({ nested: true }),
  ],
})

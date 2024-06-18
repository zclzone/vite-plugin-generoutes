import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Generoutes from 'vite-plugin-generoutes'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Generoutes({ nested: true }),
  ],
})

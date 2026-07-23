import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import VueAutoPages from 'vue-auto-pages'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueAutoPages({
      defaultLayout: false,
    }),
  ],
})

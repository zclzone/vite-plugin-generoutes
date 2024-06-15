import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/routes.js'],
  clean: true,
  format: ['esm'],
  dts: true,
  bundle: true,
  splitting: true,
  outDir: 'dist',
})

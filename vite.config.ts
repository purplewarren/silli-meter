import { defineConfig } from 'vite'

export default defineConfig({
  // Set base path for GitHub Pages deployment (repo name). Change if hosting elsewhere.
  base: '/silli-meter/',
  plugins: [],
  server: {
    host: true,
    port: 5173
  },
  build: {
    target: 'esnext',
    outDir: 'docs'
  },
  preview: {
    port: 3000
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vitest transforms JSX via esbuild; force the automatic runtime so React
  // need not be imported in every test/component file. (The production build
  // uses oxc, which already defaults to the automatic runtime.)
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    css: true,
  },
})

import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    // Tauri expects the dev server at exactly this port.
    port: 5173,
    // Fail loudly if the port is taken instead of silently picking another.
    strictPort: true,
    watch: {
      // Don't reload the page when Rust build files change.
      ignored: ['**/src-tauri/**'],
    },
  },
})
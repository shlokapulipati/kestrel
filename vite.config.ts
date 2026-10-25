import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
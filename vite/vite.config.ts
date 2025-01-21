import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',  // Set the target to 'esnext' for top-level await support
    },
  },
  css: {
    postcss: './postcss.config.js', // Path to your PostCSS config file
  },
})

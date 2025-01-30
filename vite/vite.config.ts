import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',  // Set the target to 'esnext' for top-level await support
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  resolve: {
    alias: {
      buffer: resolve(__dirname, 'node_modules', 'buffer'),
    },
  },
  css: {
    postcss: './postcss.config.js', // Path to your PostCSS config file
  },
});

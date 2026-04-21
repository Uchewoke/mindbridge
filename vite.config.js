import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-router-dom')) return 'router-vendor'
          if (id.includes('@tanstack/react-query') || id.includes('axios') || id.includes('zustand')) return 'data-vendor'
          if (id.includes('recharts')) return 'charts-vendor'
          if (id.includes('framer-motion')) return 'motion-vendor'
          if (id.includes('/react/') || id.includes('/react-dom/')) return 'react-vendor'
        },
      },
    },
  },
  server: {},
})

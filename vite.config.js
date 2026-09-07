import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://e-commerce-backend-1-we80.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

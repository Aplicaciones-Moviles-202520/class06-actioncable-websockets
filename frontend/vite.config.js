import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige las solicitudes a /api hacia el backend sin eliminar el prefijo
      '/api': {
        target: 'http://localhost:3001', // URL del backend
        changeOrigin: true,
        secure: false,
        // Elimina la reescritura para que no cambie el prefijo /api
        // rewrite: (path) => path.replace(/^\/api/, '') <-- Esto es lo que está causando el problema
      },
    },
  },
})

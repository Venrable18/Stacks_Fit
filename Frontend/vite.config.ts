import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          stacks: ['@stacks/connect', '@stacks/transactions', '@stacks/network'],
          ui: ['framer-motion', 'recharts', '@react-three/fiber', '@react-three/drei']
        }
      }
    }
  },
  define: {
    global: 'globalThis',
  },
  base: '/'
})
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['three', 'react', 'react-dom', '@react-three/fiber', 'react-router-dom'],
  },
  optimizeDeps: {
    include: ['three', 'react', 'react-dom', 'react-router-dom'],
  },
  // test: {
  //   globals: true,
  //   environment: 'jsdom',
  //   setupFiles: './src/test/setup.ts',
  //   pool: 'threads',
  //   poolOptions: {
  //     threads: {
  //       singleThread: true,
  //     },
  //   },
  // },
})
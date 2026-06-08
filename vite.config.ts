import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

type VitestUserConfig = UserConfig & {
  test: {
    environment: 'jsdom'
    globals: boolean
    setupFiles: string[]
  }
}

// https://vite.dev/config/
const config: VitestUserConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
}

export default defineConfig(config)

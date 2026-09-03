import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart({
      srcDirectory: 'app',
    }),
    viteReact(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@app': resolve(__dirname, './app'),
      '@': resolve(__dirname, './app'),
    },
  },
  server: {
    port: 3001,
    strictPort: true,
    watch: {
      ignored: ['**/.wrangler/**'],
    },
  },
  preview: {
    port: 3001,
    strictPort: true,
  },
})

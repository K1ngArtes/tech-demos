import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

import { viteApiMiddleware } from './server/connect.ts'

function openaiApiPlugin(): Plugin {
  return {
    name: 'stop-motion-api',
    configureServer(server) {
      server.middlewares.use(viteApiMiddleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(viteApiMiddleware)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = env.OPENAI_API_KEY
  if (env.STUB_OPENAI) process.env.STUB_OPENAI = env.STUB_OPENAI

  return {
    base: '/stop-motion-lab/',
    plugins: [react(), tailwindcss(), openaiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  }
})

// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Loads every var in .env.local, not just VITE_ prefixed ones. The
  // Finnhub key deliberately has no VITE_ prefix so it can never end up
  // in the browser bundle.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],

    server: {
      proxy: {
        // In production, /api/news is handled by api/news.js on Vercel.
        // There is no serverless runtime in `npm run dev`, so here we
        // forward the request to Finnhub and attach the key on the way
        // out. The key stays in the dev server process, not the browser.
        '/api/news': {
          target: 'https://finnhub.io',
          changeOrigin: true,
          rewrite: (path) => {
            const requested = new URL(path, 'http://localhost').searchParams.get('category')
            const allowed = ['general', 'forex', 'crypto', 'merger']
            const category = requested && allowed.includes(requested) ? requested : 'general'
            return `/api/v1/news?category=${category}&token=${env.FINNHUB_API_KEY ?? ''}`
          },
        },
      },
    },
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // GitHub Pages serves from `/<repo>/`, not `/`.
  // For local dev we keep `/` so routes/assets work normally.
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'tempo'

  return {
    base: command === 'build' ? `/${repo}/` : '/',
    plugins: [react()],
  }
})

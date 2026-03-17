import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // Vercel serves from root; GitHub Pages from /<repo>/.
  const isVercel = process.env.VERCEL === '1'
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'tempo'

  return {
    base:
      command === 'build'
        ? isVercel
          ? '/'
          : `/${repo}/`
        : '/',
    plugins: [react()],
  }
})

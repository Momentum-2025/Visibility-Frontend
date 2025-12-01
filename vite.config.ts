import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // When deploying to GitHub Pages under a repository page
  // (https://<user>.github.io/<repo>/) set `base` to the repo path.
  // Replace 'Visibility-Frontend' with your repository name if different.
  base: '/Visibility-Frontend/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generateSitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    generateSitemap({
      hostname: 'https://chefmate-frontend.vercel.app'
    })
  ],
})
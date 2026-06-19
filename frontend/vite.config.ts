import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` est paramétrable pour GitHub Pages (projet servi sous /<repo>/).
// Le workflow Pages définit VITE_BASE=/house-opportunity-searcher/ ; en local il reste '/'.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: {
    // Découpe les grosses libs (recharts, leaflet) en chunks séparés pour un premier
    // rendu rapide — la home (hero) ne charge pas la carte tant qu'on ne l'ouvre pas.
    rollupOptions: {
      output: {
        manualChunks: {
          recharts: ['recharts'],
          leaflet: ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
  server: { port: 5174 },
})

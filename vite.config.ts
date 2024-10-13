import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);



export default defineConfig({
  plugins: [react(),
    crx({ manifest }),
  ],
  build:{
    rollupOptions:{
      input:{
        options:"options.html"
      }
    }
  },resolve:{
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
})

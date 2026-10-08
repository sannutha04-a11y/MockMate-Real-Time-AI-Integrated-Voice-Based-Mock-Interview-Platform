import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // host: true lets phones/tablets on the same Wi-Fi open the dev server (http://<laptop-ip>:5173)
  server: { host: true },
  preview: { host: true },
})

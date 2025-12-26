import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/HackathonProject/chatbot/',
  plugins: [react(), tailwindcss()],
})
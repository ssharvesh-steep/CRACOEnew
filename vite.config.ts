import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        services: path.resolve(__dirname, 'services.html'),
        work: path.resolve(__dirname, 'work.html'),
        contact: path.resolve(__dirname, 'contact.html'),
        team: path.resolve(__dirname, 'our-team.html'),
        privacy: path.resolve(__dirname, 'privacy-policy.html'),
        messages: path.resolve(__dirname, 'admin-messages.html'),
        notfound: path.resolve(__dirname, '404.html'),
      },
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
})
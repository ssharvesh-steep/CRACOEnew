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
  esbuild: {
    jsx: 'automatic',
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        services: path.resolve(__dirname, 'services.html'),
        work: path.resolve(__dirname, 'work.html'),
        contact: path.resolve(__dirname, 'contact.html'),
        our_team: path.resolve(__dirname, 'our-team.html'),
        privacy_policy: path.resolve(__dirname, 'privacy-policy.html'),
        admin_messages: path.resolve(__dirname, 'admin-messages.html'),
        not_found: path.resolve(__dirname, '404.html'),
      },
    },
  },
})
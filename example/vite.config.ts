import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindTheme from 'tailwind-color-theme-plugin'

export default defineConfig({
  base: '/tailwind-color-theme-plugin/',
  plugins: [
    tailwindTheme({
      colors: {
        primary: 'sky',
        secondary: 'purple',
        success: 'green',
        warning: 'orange', // Changed from amber to test color switching
        error: 'red',
        neutral: 'slate'
      },
      customVariables: {
        'border-radius': '0.5rem',
        'font-family': '"Inter", sans-serif'
      },
      adaptiveShades: true
    }),
    vue()
  ]
})

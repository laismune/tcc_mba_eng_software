import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/tcc_mba_eng_software/',
  plugins: [react()],
})
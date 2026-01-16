import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/lucky-draw/', // Thay 'lucky-draw' bằng tên repo của bạn
})

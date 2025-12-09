import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'; // 👈 WAJIB ADA INI

export default defineConfig({
  plugins: [
    react({
      // Ini memaksa React agar selalu ada (seperti import React from 'react')
      // Jadi kamu TIDAK PERLU ubah file Login.jsx asli.
      jsxRuntime: 'classic', 
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setupTests.jsx', 
    
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8', // Disarankan pakai 'v8' bawaan vitest (lebih cepat dari istanbul)
      reporter: ['text', 'html'],
    },
  },
});
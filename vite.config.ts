import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: false,
    // Pinned to the WebViews Telegram actually runs in: Chrome 100+ on Android,
    // WKWebView on iOS 15+. Keeps the CSS minifier from down-levelling syntax
    // these engines already support.
    cssTarget: ['chrome100', 'edge100', 'firefox100', 'safari15'],
  },
});

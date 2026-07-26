import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    // @ton/core (Cell/BOC encoding for real sends) uses Node's Buffer
    // internally. Vite doesn't polyfill Node builtins for the browser on its
    // own — without this, the whole bundle throws `ReferenceError: Buffer is
    // not defined` during module evaluation, before React ever renders.
    nodePolyfills({ include: ['buffer'] }),
  ],
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

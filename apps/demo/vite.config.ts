import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        compatibility: {
          componentApi: 4
        }
      }
    })
  ],
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@svelte-email-editor/unlayer-svelte': resolve(__dirname, '../../packages/unlayer-svelte/src')
    }
  },
  optimizeDeps: {
    include: ['@svelte-email-editor/unlayer-svelte']
  }
});

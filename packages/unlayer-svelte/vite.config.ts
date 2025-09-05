import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        customElement: false,
        compatibility: {
          componentApi: 4
        }
      }
    }),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.*', 'src/**/*.spec.*'],
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UnlayerSvelte',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['svelte'],
      output: {
        globals: {
          svelte: 'Svelte'
        }
      }
    }
  }
});

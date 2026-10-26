/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // Keep the Create React App variable names: REACT_APP_* values from the
  // environment or .env files are exposed as import.meta.env.REACT_APP_*.
  envPrefix: 'REACT_APP_',
  server: { port: 3000 },
  preview: { port: 3000 },
  css: {
    // Create React App ran autoprefixer against the browserslist in
    // package.json; keep doing that.
    postcss: { plugins: [autoprefixer()] },
    preprocessorOptions: {
      scss: {
        // The stylesheets share variables and mixins through Sass @import.
        // Dart Sass 1.x still supports it but prints a deprecation warning
        // for every file; moving to @use is a separate change.
        silenceDeprecations: ['import'],
      },
    },
  },
  build: {
    // Same publish folder as Create React App.
    outDir: 'build',
    // The app ships as one bundle, as it did under Create React App
    // (about 235 kB gzipped); don't warn about the 500 kB minified default.
    chunkSizeWarningLimit: 1000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    server: {
      deps: {
        // convertkit-react declares "type": "module" but its "main" entry is
        // CommonJS, so Node can't load it directly; let Vite transform it.
        inline: ['convertkit-react'],
      },
    },
  },
});

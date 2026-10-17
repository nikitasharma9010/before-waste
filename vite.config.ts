import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { fileURLToPath } from 'url';
import planHandler from './api/plan.js';

function plannerDevServer(): Plugin {
  return {
    name: 'before-waste-planner-api',
    configureServer(server) {
      server.middlewares.use('/api/plan', (req, res) => {
        void planHandler(req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Server-only values: no VITE_ prefix and never passed through `define`.
  const env = loadEnv(mode, process.cwd(), '');
  if (!process.env.GEMINI_API_KEY && env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  if (!process.env.GEMINI_MODEL && env.GEMINI_MODEL) process.env.GEMINI_MODEL = env.GEMINI_MODEL;
  return {
    plugins: [react(), tailwindcss(), plannerDevServer()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('.', import.meta.url)),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    test: {
      environment: 'jsdom',
      globals: true,
    },
  };
});

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  base: '/da-teens-webapp-tele/',
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-tabs', '@radix-ui/react-dialog', '@radix-ui/react-progress'],
          icons: ['@phosphor-icons/react'],
          animations: ['framer-motion'],
          // Разделяем компоненты по модулям
          boundaries: [
            './src/components/BoundariesModule.tsx',
            './src/components/BoundariesHero.tsx',
            './src/components/AdaptiveLessonViewer.tsx'
          ],
          features: [
            './src/components/CheckInPanel.tsx',
            './src/components/CohortSchedule.tsx',
            './src/components/BadgeGrid.tsx'
          ]
        },
      },
    },
    // Увеличиваем лимит размера чанка
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false, // Позволит выбрать другой порт если 5173 занят
    allowedHosts: true,
  },
  preview: {
    port: 8080,
    host: true,
  },
});

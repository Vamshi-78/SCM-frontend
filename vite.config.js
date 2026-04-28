import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const proxyTarget = env.VITE_API_PROXY_TARGET || env.VITE_API_URL || 'http://localhost:8080';

  return {
    plugins: [react()],
    server: {
      port: 5176,
      strictPort: false,
      proxy: {
        '/api': { target: proxyTarget, changeOrigin: true },
        '/auth': { target: proxyTarget, changeOrigin: true },
        '/courses': { target: proxyTarget, changeOrigin: true },
        '/enroll': { target: proxyTarget, changeOrigin: true },
        '/unenroll': { target: proxyTarget, changeOrigin: true },
        '/enrollments': { target: proxyTarget, changeOrigin: true },
        '/waitlist': { target: proxyTarget, changeOrigin: true },
        '/registration': { target: proxyTarget, changeOrigin: true },
        '/notifications': { target: proxyTarget, changeOrigin: true },
        '/support-tickets': { target: proxyTarget, changeOrigin: true },
      },
    },
    base: '/',
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  };
})

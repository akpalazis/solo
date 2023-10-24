import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const config = {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/storage': {
          target: process.env.VITE_MINIO_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/storage/, ''),
        },
      },
      watch:{
        usePolling: true,
      },
      host: true,
      strictPort:true,
      port:3000,
    },
  };
  return defineConfig(config);
};
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    server: {
      port: Number(env.VITE_DEV_PORT) || 5179,
      proxy: {
        // ✅ 프록시 설정 추가
        '/api': {
          target: 'https://7ace74aa4830.ngrok-free.app', // ✅ 백엔드 주소 (ngrok이면 그 주소로 변경)
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  });
};

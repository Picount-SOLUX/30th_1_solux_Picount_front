import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process';

export default ({ mode }) => {
  // env 변수 로드
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    server: {
      port: Number(env.VITE_DEV_PORT) || 5179,
    },
  });
};
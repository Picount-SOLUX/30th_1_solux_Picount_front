import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import process from "process";

export default ({ mode }) => {
  // env 변수 로드
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    plugins: [react()],
    server: {
      port: Number(env.VITE_DEV_PORT) || 5179,
      proxy: {
        // ✅ '/api'로 시작하는 요청을 백엔드로 프록시
        "/api": {
          target: "https://37cf286da836.ngrok-free.app", // ← 너희 백엔드 서버 주소/포트로 수정
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};

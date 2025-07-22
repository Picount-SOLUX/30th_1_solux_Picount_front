// src/api/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://523f7ec22c71.ngrok-free.app/api", // 백엔드 주소 확인
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 시 accessToken 자동 추가
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답에서 토큰 만료 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // accessToken 만료 && 재요청 한 번만 시도
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // refreshToken으로 새 accessToken 발급 요청
        const res = await axios.post("http://localhost:8080/api/members/refresh", {
          refreshToken,
        });

        const { accessToken: newAccessToken } = res.data.data;

        // 새 accessToken 저장
        localStorage.setItem("accessToken", newAccessToken);

        // 실패한 요청 헤더에 새 토큰 추가 후 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("리프레시 토큰 만료 → 로그아웃 처리 필요");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // 강제 로그아웃
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

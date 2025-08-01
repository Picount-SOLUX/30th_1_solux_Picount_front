import axios from "axios";

// ✅ 기본 axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ 토큰 제외 대상 경로 목록
const noAuthUrls = ["/members/signup", "/members/login", "/members/refresh"];

// ✅ 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const isNoAuth = noAuthUrls.some((url) => config.url.includes(url));
    if (accessToken && !isNoAuth) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalConfig = error.config;

    // ✅ 404 → 무시
    if (error.response?.status === 404) {
      console.warn("📭 404 응답 무시:", originalConfig.url);
      return Promise.resolve({ data: null });
    }

    // ✅ 특정 요청 URL에서 401 → 무시하고 응답 null 처리
    const ignore401Urls = ["/calendar/record"];
    const isIgnore401 = ignore401Urls.some((url) =>
      originalConfig?.url?.includes(url)
    );

    if (error.response?.status === 401 && isIgnore401) {
      console.warn("📭 401 응답 무시 (ignore401Urls):", originalConfig.url);
      return Promise.resolve({ data: null });
    }

    // ✅ 401 (accessToken 만료) → 리프레시 후 재요청
    if (
      error.response?.status === 401 &&
      !originalConfig._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalConfig._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // refreshToken으로 새 accessToken 발급 요청
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/members/refresh`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log("토큰 재발급 성공", res.data);

        const { accessToken: newAccessToken } = res.data.data;
        localStorage.setItem("accessToken", newAccessToken);

        originalConfig.headers = originalConfig.headers || {};
        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalConfig); // ✅ 실패한 요청 재시도

      } catch (refreshError) {
        console.error("🔒 리프레시 토큰 만료 → 로그아웃 처리");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 나머지 에러는 그대로 전달
    return Promise.reject(error);
  }
);


export default api;
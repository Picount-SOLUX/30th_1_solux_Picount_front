import axios from "axios";

// ✅ 백엔드 연동 여부 확인
const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

// ✅ 기본 axios 인스턴스 생성
const api = axios.create({
  baseURL: useBackend ? import.meta.env.VITE_API_BASE_URL : "",
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
    if (!useBackend) {
      console.warn("📭 백엔드 연동 OFF → 요청 차단:", config.url);
      return Promise.reject({
        config,
        message: "백엔드 연동 OFF, 요청 차단됨",
        isMock: true,
      });
    }

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
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    // ✅ 백엔드 OFF → mock 응답 처리
    if (!useBackend) {
      console.info("✅ 백엔드 OFF → mock 응답 반환:", originalConfig.url);

      let mockData = { success: true };

      if (originalConfig.url.includes("/members/signup")) {
        mockData = {
          success: true,
          userId: 123,
          nickname: "mock-user",
        };
      } else if (originalConfig.url.includes("/members/login")) {
        mockData = {
          success: true,
          data: {
            accessToken: "mock-access-token",
            refreshToken: "mock-refresh-token",
            nickname: localStorage.getItem("tempNickname") || "테스트유저",
          },
        };
      }

      return Promise.resolve({
        data: mockData,
        status: 200,
        statusText: "OK",
        headers: {},
        config: originalConfig,
      });
    }

    // ✅ 404 → 무시
    if (error.response?.status === 404) {
      console.warn("📭 404 응답 무시:", originalConfig.url);
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

        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/members/refresh`,
          { refreshToken }
        );

        const { accessToken: newAccessToken } = res.data.data;

        // 새 토큰 저장
        localStorage.setItem("accessToken", newAccessToken);

        // 재시도 요청에 토큰 업데이트
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

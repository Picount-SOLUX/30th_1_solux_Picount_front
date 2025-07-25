// src/api/axiosInstance.js
import axios from "axios";

// ✅ 환경변수로 백엔드 연동 여부 확인
const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

const api = axios.create({
  baseURL: useBackend ? import.meta.env.VITE_API_BASE_URL : "", // 백엔드 ON일 때만 baseURL 지정
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (!useBackend) {
      // 백엔드 연동 OFF 상태: 모든 요청 차단 및 mock 처리
      console.warn("📭 백엔드 연동 OFF → 요청 차단:", config.url);
      return Promise.reject({
        config,
        message: "백엔드 연동 OFF, 요청 차단됨",
        isMock: true,
      });
    }

    const accessToken = localStorage.getItem("accessToken");

    // ✅ accessToken 제외할 경로 목록
    const noAuthUrls = ["/members/signup", "/members/login", "/members/refresh"];

    // 현재 요청이 토큰 제외 대상인지 확인
    const isNoAuth = noAuthUrls.some((url) => config.url.includes(url));

    // 제외 대상이 아니고 토큰이 있다면 헤더에 추가
    if (accessToken && !isNoAuth) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ✅ 응답 인터셉터
api.interceptors.response.use(
  (response) => response, // 정상 응답 그대로 반환
  async (error) => {
    // ✅ 백엔드 OFF일 때는 mock 응답 반환
    if (import.meta.env.VITE_USE_BACKEND === "false") {
      console.info("✅ 백엔드 OFF → mock 응답 반환:", error.config.url);

      let mockData = { success: true };

      // 요청 URL마다 다른 mock 데이터
      if (error.config.url.includes("/members/signup")) {
        mockData = {
          success: true,
          userId: 123,
          nickname: "mock-user",
        };
      } else if (error.config.url.includes("/members/login")) {
        mockData = {
          success: true,
          data: {
            accessToken: "mock-access-token",
            refreshToken: "mock-refresh-token",
            nickname: localStorage.getItem("tempNickname") || "테스트유저", // ✅ 추가
          },
        };
      }

      return Promise.resolve({
        data: mockData,
        status: 200,
        statusText: "OK",
        headers: {},
        config: error.config,
      });
    }
//////////////가짜///////////////

    // 404 에러는 무시하고 빈 응답 반환
    if (error.response?.status === 404) {
      console.warn("📭 API 404 오류 무시:", error.config.url);
      return Promise.resolve({ data: null });
    }

    // accessToken 만료 시 리프레시 처리
    if (
      error.response?.status === 401 &&
      !error.config._retry &&
      localStorage.getItem("refreshToken")
    ) {
      error.config._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const refreshUrl = useBackend ? `${import.meta.env.VITE_API_BASE_URL}/api/members/refresh` : "/api/members/refresh";
        // refreshToken으로 새 accessToken 발급 요청
        const res = await api.post("/members/refresh", {
          refreshToken,
        });

        const { accessToken: newAccessToken } = res.data.data;

        // 새 accessToken 저장
        localStorage.setItem("accessToken", newAccessToken);

        // 실패한 요청 헤더에 새 토큰 추가 후 재시도
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(error.config);
      } catch (refreshError) {
        console.error("🔒 리프레시 토큰 만료 → 로그아웃 처리 필요");
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

import api from "./axiosInstance";

// 회원가입 API
export const signup = async (userData) => {
  const isBackendReady = false; // ⚠️ 백엔드 연동 시 true로 변경

  if (isBackendReady) {
    // 진짜 백엔드 API 호출
    return await api.post("/auth/members/signup", userData);
  } else {
    // 테스트용 mock 응답
    console.log("[Mock API] 회원가입 요청:", userData);
    localStorage.setItem("tempNickname", userData.nickname); // 임시 저장
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            message: "회원가입 성공 (Mock)",
            data: null,
          },
        });
      }, 1000); // 1초 지연으로 실제 호출처럼 보이게
    });
  }
};

// 로그인 API
export const login = async (loginData) => {
  const isBackendReady = false; // ⚠️ 백엔드 연동 시 true로 변경

  if (isBackendReady) {
    // 백엔드 API 호출
    return await api.post("/auth/members/login", loginData);
  } else {
    // 테스트용 mock 응답
    console.log("[Mock API] 로그인 요청:", loginData);
    return new Promise((resolve) => {
      setTimeout(() => {
        const nickname = localStorage.getItem("tempNickname") || "테스트유저";
        resolve({
          data: {
            success: true,
            message: "로그인 완료 (Mock)",
            data: {
              accessToken: "mock-access-token",
              refreshToken: "mock-refresh-token",
              nickname: nickname,
            },
          },
        });
      }, 1000);
    });
  }
};

// AuthAPI.js 내 changePassword 함수 예시
export const changePassword = async ({ prePassword, newPassword }) => {
  const isBackendReady = false; // true로 바꾸면 실제 API 호출

  if (isBackendReady) {
    return await api.post("/auth/members/password", { prePassword, newPassword });
  } else {
    console.log("[Mock API] 비밀번호 변경 요청", { prePassword, newPassword });
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            message: "비밀번호 변경 완료 (Mock)",
            data: null,
          },
        });
      }, 1000);
    });
  }
};

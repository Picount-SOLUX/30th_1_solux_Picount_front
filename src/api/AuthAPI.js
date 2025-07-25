import api from "./axiosInstance";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

// 회원가입 API
export const signup = async (userData) => {
  if (useBackend) {
    // 진짜 백엔드 API 호출
    return await api.post("/members/signup", userData); //앞에 /api 추가 할말
  } else {
    // 테스트용 mock 응답
    console.log("[Mock API] 회원가입 요청:", userData);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            message: "회원가입 성공 (Mock)",
            data: null,
          },
        });
      }, 1000); // 1초 지연
    });
  }
};

// 로그인 API
export const login = async (loginData) => {
  if (useBackend) {
    // 백엔드 API 호출
    return await api.post("/members/login", loginData);
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

// 이메일 존재 여부 확인 API
export const checkEmailExists = async (email) => {
  if (useBackend) {
    return await api.get("/members", {
      params: { email } // Axios가 알아서 encode 해줌
    });
  } else {
    console.log("[Mock API] 이메일 확인 요청", email);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const registeredEmails = JSON.parse(localStorage.getItem("registeredEmails") || "[]");

        // 테스트용: 임의로 특정 이메일만 존재한다고 가정
        if (registeredEmails.includes(email)) {
          resolve({ data: { data: true } });
        } else {
          reject({
            response: { data: { message: "가입되지 않은 이메일입니다." } },
          });
        }
      }, 1000);
    });
  }
};

// 비밀번호 찾기 - 새비밀번호로 변경
export const findPassword = async ({ email, newPassword }) => {
  if (useBackend) {
    // 실제 백엔드 API 호출
    return await api.post('/members/password', {
      email,
      newPassword,
    });
  } else {
    // 목 데이터: 실제 요청 없이 테스트용 응답
    console.log('[Mock API] 비밀번호 찾기 요청됨:', { email, newPassword });
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            message: '비밀번호가 성공적으로 변경되었습니다.',
            data: true,
          },
        });
      }, 500); // 0.5초 지연으로 실제 응답처럼 보이게
    });
  }
};

// 로그아웃 API
export const logout = async () => {
  if (useBackend) {
    // 백엔드 연동 시 실제 API 호출
    return await api.post("/members/logout");
  } else {
    // 백엔드 OFF 상태 → mock 처리
    console.warn("📭 백엔드 연동 OFF → mock 로그아웃 처리");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: { success: true, message: "Mock 로그아웃 성공" },
          status: 200,
        });
      }, 500); // mock 지연
    });
  }
};

// 회원탈퇴 API
export const deleteAccount = async () => {
  const isBackendReady = true; // true로 바꾸면 실제 API 호출

  if (isBackendReady) {
    // 실제 API 호출
    return await api.patch("/members/withdraw");
  } else {
    // 테스트용 mock 응답
    console.log("[Mock API] 회원탈퇴 요청");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            message: "회원탈퇴 완료 (Mock)",
            data: null,
          },
        });
      }, 1000);
    });
  }
};
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
    const url = `/members?email=${encodeURIComponent(email)}`;
    return await api.get(url); // 백엔드 엔드포인트 확인 필요
  } else {
    console.log("[Mock API] 이메일 확인 요청", email);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 테스트용: 임의로 특정 이메일만 존재한다고 가정
        if (email === "test@example.com") {
          resolve({ data: { exists: true } });
        } else {
          reject({
            response: { data: { message: "가입되지 않은 이메일입니다." } },
          });
        }
      }, 1000);
    });
  }
};

// 비밀번호 변경 API
export const changePassword = async ({ prePassword, newPassword }) => {
  if (useBackend) {
    return await api.patch("/members/password", { prePassword, newPassword });
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
// export const deleteAccount = async () => {
//   const isBackendReady = true; // true로 바꾸면 실제 API 호출

//   if (isBackendReady) {
//     // 실제 API 호출
//     return await api.delete("/auth/members");
//   } else {
//     // 테스트용 mock 응답
//     console.log("[Mock API] 회원탈퇴 요청");
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({
//           data: {
//             success: true,
//             message: "회원탈퇴 완료 (Mock)",
//             data: null,
//           },
//         });
//       }, 1000);
//     });
//   }
// };

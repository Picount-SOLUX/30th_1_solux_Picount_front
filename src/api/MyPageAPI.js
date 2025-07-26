import api from "./axiosInstance";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

// 비밀번호 변경 API
export const ChangePassword = async ({ prePassword, newPassword }) => {
  if (useBackend) {
    // 실제 백엔드 API 요청
    return await api.patch("/members/password", {
      prePassword: prePassword,
      newPassword: newPassword,
    });
  } else {
    // 목 응답 (테스트용)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            message: "비밀번호가 성공적으로 변경되었습니다.",
            data: true,
          },
        });
      }, 500);
    });
  }
};
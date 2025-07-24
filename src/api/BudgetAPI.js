import api from "./axiosInstance";

const useBackend = import.meta.env.VITE_USE_BACKEND === "false"; // true로 바꾸면 실제 API 요청

// 예산 생성 API (POST)
export const createBudget = async (budgetData) => {
  if (useBackend) {
    // 진짜 백엔드 요청
    return await api.post("/budgets", budgetData);
  } else {
    // mock 데이터 흐름
    console.log("[Mock API] 예산 생성 요청:", budgetData);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: 1, // 임시 예산 ID
            ...budgetData,
          },
        });
      }, 1000); // 1초 지연
    });
  }
};

// 예산 조회 API (GET)
export const getBudget = async (budgetId) => {
  if (useBackend) {
    return await api.get(`/budgets/${budgetId}`);
  } else {
    console.log("[Mock API] 예산 조회 요청:", budgetId);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: budgetId,
            startDate: "2024-07-01",
            endDate: "2024-07-31",
            totalAmount: 1000000,
            categories: [
              { id: 1, name: "식비", amount: 300000 },
              { id: 2, name: "교통비", amount: 100000 },
            ],
          },
        });
      }, 1000);
    });
  }
};

// 예산 수정 API (PUT)
export const updateBudget = async (budgetId, budgetData) => {
  if (useBackend) {
    return await api.put(`/budgets/${budgetId}`, budgetData);
  } else {
    console.log("[Mock API] 예산 수정 요청:", { budgetId, budgetData });
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: budgetId,
            ...budgetData,
          },
        });
      }, 1000);
    });
  }
};

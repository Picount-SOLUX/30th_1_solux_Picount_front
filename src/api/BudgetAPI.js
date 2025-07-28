// src/api/budgetApi.js
import api from "./axiosInstance";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

// 예산 생성 API (POST)
export const createBudget = (budgetData) => api.post("/budgets", budgetData);

// 직군 변경 API
export const updateMemberGroup = (payload) => {
  return api.put("/members/membergrouptype", payload);
};

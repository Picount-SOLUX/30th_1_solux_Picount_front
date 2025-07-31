// src/api/budgetApi.js
import api from "./axiosInstance";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

// 직군 변경 API
export const updateMemberGroup = (payload) => {
  return api.put("/members/membergrouptype", payload);
};

// 예산 생성 API (POST)
export const createBudget = (budgetData) => api.post("/budgets", budgetData);

// 예산 계획(카테고리별 분배) 수정
export const updateBudgetPlan = (budgetId, data) => api.put(`/budgets/${budgetId}`, data);



// 카테고리 전체 조회
export const getCategories = () => api.get("/categories");

// 카테고리 생성
export const createCategories = (categories) => api.post("/categories", { categories });

// 카테고리 수정
export const updateCategory = async (categoryId, data) => {
  console.log("카테고리 수정 요청:", categoryId, data);
  return api.put(`/categories/${categoryId}`, data);
};

// 카테고리 삭제
export const deleteCategory = async (categoryId) => {
  console.log("카테고리 삭제 요청:", categoryId);
  return api.delete(`/categories/${categoryId}`);
};
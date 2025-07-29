// src/api/budgetApi.js
import api from "./axiosInstance";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

// 직군 변경 API
export const updateMemberGroup = (payload) => {
  return api.put("/members/membergrouptype", payload);
};

// 예산 생성 API (POST)
export const createBudget = (budgetData) => api.post("/budgets", budgetData);

// 카테고리 생성
export const createCategories = (categories) => api.post("/categories", { categories });

// 예산 계획(카테고리별 분배) 수정
export const updateBudgetPlan = (budgetId, data) => api.put(`/budgets/${budgetId}`, data);

// 카테고리 전체 조회
export const getCategories = () => api.get("/categories");


// ✅ [아래에 추가한 부분]

// 단일 카테고리 추가
export const createCategory = (categoryData) => api.post("/categories", categoryData);

// 카테고리 이름 수정
export const updateCategory = (categoryId, data) => api.put(`/categories/${categoryId}`, data);

// 카테고리 삭제
export const deleteCategory = (categoryId) => api.delete(`/categories/${categoryId}`);

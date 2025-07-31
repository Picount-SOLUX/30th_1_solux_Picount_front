// src/api/budgetApi.js
import api from "./axiosInstance";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

// 직군 변경 API
export const updateMemberGroup = (payload) => {
  return api.put("/members/membergrouptype", payload);
};

// 예산 생성 API (POST)
export const createBudget = (budgetData) => api.post("/budgets", budgetData);

// 예산&세부예산 조회
export const getActiveBudget = () => api.get("/api/budgets/active");

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




// 수입/지출 기록 입력
export const createCalendarRecord = async (formData) => {
  console.log("📤 createCalendarRecord - formData 준비됨:", formData);
  try {
    const res = await api.post("/calendar/record", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("📬 API 응답 성공:", res);
    return res;
  } catch (e) {
    console.error("❌ API 요청 실패:", e);
    throw e; // 다시 던져서 바깥 catch로 가게 하기
  }
};

// 수입/지출 기록 수정
export const updateCalendarRecord = async (date, formData) => {
  return await api.patch(`/calendar/record?date=${date}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
import axios from "axios";

// axios 인스턴스 생성
const API = axios.create({
  baseURL: "http://localhost:8080/api", // 🛑 백엔드 주소 확인 필요
  headers: {
    "Content-Type": "application/json",
  },
});

// 예산 생성 API (POST)
export const createBudget = (budgetData) => API.post("/budgets", budgetData);

// 예산 조회 API (GET)
export const getBudget = (budgetId) => API.get(`/budgets/${budgetId}`);

// 예산 수정 API (PUT)
export const updateBudget = (budgetId, budgetData) =>
  API.put(`/budgets/${budgetId}`, budgetData);


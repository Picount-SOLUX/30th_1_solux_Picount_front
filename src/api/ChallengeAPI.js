import api from "./axiosInstance";

// 전체 챌린지 목록 조회
export const fetchAllChallenges = () => {
  return api.get("/challenges");
};

// 나의 챌린지 현황 조회
export const fetchMyChallenges = () => {
  return api.get("/challenges/me");
};

// 챌린지 보상 수령
export const claimChallengeReward = (challengeId) => {
  return api.post(`/challenges/${challengeId}/complete`);
};

// 내 포인트 조회
export const fetchMyPoint = () => {
  return api.get("/points/my");
};

// 내 포인트 내역 조회
export const fetchMyPointHistory = () => {
  return api.get("/points/history");
};

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance"; // axios 인스턴스 경로 맞게 조정
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    try {
      // 백엔드에 refresh token 무효화 요청
      // const refreshToken = localStorage.getItem("refreshToken");
      // if (refreshToken) {
      //   await api.post("/api/members/logout", null, {
      //     headers: { Authorization: `Bearer ${refreshToken}` },
      //   });
      // }
    } catch (error) {
      console.error("로그아웃 요청 실패:", error);
      // 실패해도 계속 진행
    } finally {
      // 토큰 삭제 및 로그인 페이지 이동
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setShowLogoutModal(false);
      navigate("/login");
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <h1>PICOUNT</h1>
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogoutClick}>
            로그아웃
          </button>
          <span className="notification-icon">🔔</span>
        </div>
      </header>

      {/* 로그아웃 확인 모달 */}
      {showLogoutModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>로그아웃 하시겠습니까?</h3>
            <div className="modal-buttons">
              <button onClick={handleConfirmLogout}>확인</button>
              <button onClick={handleCancelLogout}>취소</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

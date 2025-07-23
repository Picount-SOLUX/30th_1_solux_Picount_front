import React from "react";
import "./Header.css";

export default function Header() {
  // 로컬스토리지에서 이메일 꺼내오기
  const userEmail = localStorage.getItem("userEmail");

  return (
    <>
      <header className="header">
        <div className="header-left">
          <h1>PICOUNT</h1>
        </div>
        <div className="header-right">
          {/* 이메일 표시 */}
          <span className="user-email">{userEmail || "Guest"}</span>
          <span className="notification-icon">🔔</span>
        </div>
      </header>
    </>
  );
}

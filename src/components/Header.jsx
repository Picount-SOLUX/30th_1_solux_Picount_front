import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1>PICOUNT</h1>
      </div>
      <div className="header-right">
        <button className="logout-btn">로그아웃</button>
        <span className="notification-icon">🔔</span>
      </div>
    </header>
  );
}

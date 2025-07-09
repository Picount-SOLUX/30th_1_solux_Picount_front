import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="profile-section">
        <div className="profile-image"></div>
        <p className="profile-name">닉네임</p>
        <p className="profile-status">친구들에게 나를 소개해보자!</p>
      </div>

      <nav className="menu">
        <ul>
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              🏠 홈
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/budget"
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              💸 예산 설정
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              🛒 상점
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/challenge"
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              🏆 포인트&챌린지
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/friends"
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              👥 친구 토글
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mypage"
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              📄 마이 페이지
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

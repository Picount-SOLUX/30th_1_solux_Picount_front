import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isFriendOpen, setIsFriendOpen] = useState(false);

  const handleFriendClick = () => {
    setIsFriendOpen(!isFriendOpen);
  };
  const friends = [
    { id: "user1", name: "민지", status: "오늘도 절약 중!" },
    { id: "user2", name: "수현", status: "커피 한 잔의 여유" },
    { id: "user3", name: "지우", status: "파이낸셜 마스터" },
  ];

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

          {/* ✅ 하나의 친구 버튼으로 기능 통합 */}
          <li onClick={handleFriendClick}>
            <div className="menu-item">
              👥 친구 토글
              <span className={`arrow ${isFriendOpen ? "open" : ""}`}>▾</span>
            </div>
          </li>
          {/* 친구 목록 */}
          {isFriendOpen && (
            <div className="friend-list">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="friend-item"
                  onClick={() => navigate(`/friends/${friend.id}`)}
                >
                  <span className="friend-dot"></span>
                  <span className="friend-name">{friend.name}</span>
                  <span className="friend-status">({friend.status})</span>
                </div>
              ))}
            </div>
          )}

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

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isFriendOpen, setIsFriendOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [friendError, setFriendError] = useState("");

  const handleFriendClick = async () => {
    const nextOpen = !isFriendOpen;
    setIsFriendOpen(nextOpen);
    if (nextOpen) {
      try {
        const res = await api.get("/friends/main", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setFriends(res.data.data);
          setIsPrivate(false);
          setFriendError("");
        } else {
          setFriends([]);
          setIsPrivate(true);
          setFriendError(res.data.message || "비공개 또는 접근 불가");
        }
      } catch (err) {
        console.error("❌ 친구 목록 불러오기 실패", err);
        setFriends([]);
        setIsPrivate(true);
        setFriendError("친구 목록을 불러오는 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <aside className="sidebar">
      <div className="profile-section">
        <div className="profile-image" />
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

          <li onClick={handleFriendClick}>
            <div className="menu-item">
              👥 친구 목록
              <span className={`arrow ${isFriendOpen ? "open" : ""}`}>▾</span>
            </div>
          </li>

          {isFriendOpen && (
            <div className="friend-list">
              {isPrivate ? (
                <div className="friend-item">
                  <img
                    src="/assets/icons/lock-icon.png"
                    className="friend-lock"
                    alt="비공개"
                  />
                  <span className="friend-name">{friendError}</span>
                </div>
              ) : friends.length === 0 ? (
                <div className="friend-item">친구가 없습니다.</div>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend.memberId}
                    className="friend-item"
                    onClick={() => navigate(`/friends/${friend.memberId}`)}
                  >
                    <img
                      src={friend.profileImageUrl}
                      alt="profile"
                      className="friend-avatar"
                    />
                    <div className="friend-info">
                      <span className="friend-name">{friend.nickname}</span>
                      <span className="friend-status">
                        {friend.statusMessage}
                      </span>
                    </div>
                  </div>
                ))
              )}
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

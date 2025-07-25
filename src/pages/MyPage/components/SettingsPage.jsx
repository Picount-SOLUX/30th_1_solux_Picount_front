import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SettingsPage.module.css";
import DeleteAccountModal from "./DeleteAccountModal";
import DeleteSuccessModal from "./DeleteSuccessModal";
import { logout } from "../../../api/AuthAPI"; // ✅ 로그아웃 API 임포트
import { useEffect } from "react";
import axios from "axios";
import api from "../../../api/axiosInstance";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  //////////////////////로그아웃 API////////////////////////////
  const handleLogout = async () => {
    try {
      const res = await logout(); // ✅ 로그아웃 API 호출
      console.log("로그아웃 응답:", res.data);

      // 로컬스토리지 토큰 제거
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      alert(res.data.message || "로그아웃 되었습니다."); // ✅ API 메시지 출력
      navigate("/login"); // 로그인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };
  /////////////////////로그아웃 API/////////////////////////////

  const handleDeleteAccount = () => {
    setShowModal(true); // 경고 모달 열기
  };

  const confirmDelete = () => {
    setShowModal(false);
    setShowSuccess(true); // 성공 모달 열기
    // 실제 API 연동 코드 추가 예정
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
    navigate("/"); // 홈 or 로그인 페이지로 이동
  };

  const goToEditProfile = () => {
    navigate("/settings/edit-profile");
  };
  const goBackToMyPage = () => {
    navigate("/mypage");
  };

  const goToChangePassword = () => {
    navigate("/settings/change-password");
  };
  const goToFriendManage = () => {
    navigate("/settings/friend-manage");
  };
  const [friends, setFriends] = useState([]);
  const [isMainVisible, setIsMainVisible] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await api.get("/api/friends/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setFriends(res.data.data);
        }
      } catch {
        alert("친구 목록 조회 실패");
      }
    };

    fetchFriends();
  }, []);

  const handleDeleteFriend = async (friendId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await api.delete(`/api/friends/${friendId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        alert("삭제 성공");
        setFriends((prev) => prev.filter((f) => f.memberId !== friendId));
      } else {
        alert(res.data.message);
      }
    } catch {
      alert("삭제 실패");
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>마이페이지 &gt; 설정</div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>계정</h2>
        <ul className={styles.itemList}>
          <li className={styles.item} onClick={goToEditProfile}>
            {" "}
            프로필 수정
          </li>
          <li className={styles.item} onClick={goToChangePassword}>
            비밀번호 변경
          </li>
        </ul>
      </div>

      <li className={styles.item}>
        <span>가계부 친구 공개 여부</span>
        <label className={styles.toggleSwitch}>
          <input
            type="checkbox"
            checked={isMainVisible}
            onChange={async (e) => {
              const newValue = e.target.checked;
              setIsMainVisible(newValue); // UI 즉시 반영

              try {
                const res = await api.post(
                  "/api/members/visibility/main",
                  { isMainVisible: newValue },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );

                if (res.data.success) {
                  alert(res.data.message || "공개 여부가 변경되었습니다.");
                } else {
                  alert("공개 여부 설정 실패");
                }
              } catch (err) {
                alert("서버 오류: 공개 여부 변경 실패");
              }
            }}
          />
          <span className={styles.slider}></span>
        </label>
      </li>
      {/* 
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>친구 관리</h2>
        <ul className={styles.itemList}>
          <li className={styles.item} onClick={goToFriendManage}>
            친구 목록 보기 및 삭제
          </li>
        </ul>
      </div> */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>친구 관리</h2>
        <ul className={styles.friendList}>
          {friends.length === 0 ? (
            <li className={styles.noFriend}>친구가 없습니다.</li>
          ) : (
            friends.map((friend) => (
              <li key={friend.memberId} className={styles.friendItem}>
                <img
                  src={friend.profileImageUrl}
                  alt="profile"
                  className={styles.friendAvatar}
                />
                <span className={styles.friendName}>{friend.nickname}</span>
                <button
                  className={styles.friendDeleteBtn}
                  onClick={() => handleDeleteFriend(friend.memberId)}
                >
                  삭제
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className={styles.fixedButtons}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          로그아웃
        </button>
        <button className={styles.deleteBtn} onClick={handleDeleteAccount}>
          회원 탈퇴
        </button>
      </div>
      <button className={styles.backButton} onClick={goBackToMyPage}>
        ← 마이페이지
      </button>

      {showModal && (
        <DeleteAccountModal
          onClose={() => setShowModal(false)}
          onConfirm={confirmDelete}
        />
      )}
      {showSuccess && <DeleteSuccessModal onClose={closeSuccessModal} />}
    </div>
  );
}

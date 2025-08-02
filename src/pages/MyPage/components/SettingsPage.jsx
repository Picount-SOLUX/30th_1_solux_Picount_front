import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SettingsPage.module.css";
import DeleteAccountModal from "./DeleteAccountModal";
import DeleteSuccessModal from "./DeleteSuccessModal";
import { logout, deleteAccount } from "../../../api/AuthAPI"; // ✅ 로그아웃 API 임포트
import axios from "axios";
import api from "../../../api/axiosInstance";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMainVisible, setIsMainVisible] = useState(null); // 로딩 전 상태는 null

  // ** 새로 추가한 프로필 상태들 **
  const [nickname, setNickname] = useState("");
  const [intro, setIntro] = useState("");
  const [profileImage, setProfileImage] = useState(
    "/assets/profile_default.png"
  );

  ////////////////////////로그아웃 API////////////////////////////
  const handleLogout = async () => {
    try {
      const res = await logout(); // ✅ 로그아웃 API 호출
      console.log("로그아웃 응답:", res.data);

      // 로컬스토리지 토큰 제거
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("hasLoggedIn"); // 여기!
      alert(res.data.message || "로그아웃 되었습니다."); // ✅ API 메시지 출력
      navigate("/login"); // 로그인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };
  ///////////////////////로그아웃 API/////////////////////////////

  ///////////////////////회원탈퇴 API///////////////////////////
  const handleDeleteAccount = () => {
    setShowModal(true); // 경고 모달 열기
  };
  const confirmDelete = async () => {
    try {
      const res = await deleteAccount(); // 실제 회원탈퇴 API 호출
      if (res.data?.success) {
        // 로컬 토큰 제거
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // 서버 로그아웃 처리
        setShowModal(false); // 확인 모달 닫기
        setShowSuccess(true); // 성공 모달 열기
      } else {
        alert(res.data.message || "회원탈퇴 실패");
      }
    } catch (error) {
      console.error("회원탈퇴 실패:", error);
      alert("회원탈퇴 중 오류가 발생했습니다.");
    }
  };
  const closeSuccessModal = () => {
    setShowSuccess(false);
    navigate("/"); // StartingPage로 이동
  };
  ///////////////////////회원탈퇴 API///////////////////////////

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

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await api.get("/friends/my", {
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
      const res = await api.delete(`/friends/${friendId}`, {
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

  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        const res = await api.get("/members/visibility/main", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("친구 공개 여부 설정 성공", res);
        if (res.data.success) {
          setIsMainVisible(res.data.data); // true 또는 false 설정
        } else {
          console.warn("초기 공개 여부 불러오기 실패:", res.data.message);
          setIsMainVisible(false); // fallback
        }
      } catch (err) {
        console.error("공개 여부 API 실패:", err);
        setIsMainVisible(false); // fallback
      }
    };

    fetchVisibility();
  }, []);

  // ** 새로 추가한 useEffect: 로컬스토리지에서 프로필 데이터 읽기 **
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    console.log("SettingsPage - userData from localStorage:", userData);
    if (userData) {
      setNickname(userData.nickname || "");
      setIntro(userData.intro || "");
      setProfileImage(userData.profileImage || "/assets/profile_default.png");
    }
  }, []);

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

      {/* 필요하면 여기에 프로필 이미지, 닉네임, 소개 출력 추가 가능 */}
      {/* 예시: */}
      {/* <div className={styles.profileSummary}>
        <img
          src={profileImage}
          alt="프로필 이미지"
          className={styles.profileImagePreview}
        />
        <p>닉네임: {nickname}</p>
        <p>한 줄 소개: {intro}</p>
      </div> */}

      <li className={styles.item}>
        <span>가계부 친구 공개 여부</span>
        <label className={styles.toggleSwitch}>
          <input
            type='checkbox'
            checked={isMainVisible}
            onChange={async (e) => {
              const newValue = e.target.checked;
              setIsMainVisible(newValue); // UI 즉시 반영

              try {
                const res = await api.patch(
                  "/members/visibility/main",
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
                  alt='profile'
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

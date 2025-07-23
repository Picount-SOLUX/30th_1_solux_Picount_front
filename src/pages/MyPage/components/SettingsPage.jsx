import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SettingsPage.module.css";
import DeleteAccountModal from "./DeleteAccountModal";
import DeleteSuccessModal from "./DeleteSuccessModal";
import { logout } from "../../../api/AuthAPI"; // ✅ 로그아웃 API 임포트

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

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>보안</h2>
        <ul className={styles.itemList}>
          <li className={styles.item}>
            <span>가계부 친구 공개 여부</span>
            <label className={styles.toggleSwitch}>
              <input type="checkbox" />
              <span className={styles.slider}></span>
            </label>
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>테마</h2>
        <ul className={styles.itemList}>
          <li className={styles.item}>테마 색상 변경</li>
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

import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SettingsPage.module.css";

export default function SettingsPage() {
  const handleLogout = () => {
    alert("로그아웃 처리");
  };

  const handleDeleteAccount = () => {
    alert("회원 탈퇴 절차");
  };

  const navigate = useNavigate();

  const goToEditProfile = () => {
    navigate("/settings/edit-profile");
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
          <li className={styles.item}>아이디 변경</li>
          <li className={styles.item}>비밀번호 변경</li>
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
    </div>
  );
}

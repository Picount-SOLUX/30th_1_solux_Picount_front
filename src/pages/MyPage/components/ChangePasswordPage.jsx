import React, { useState } from "react";
import styles from "./ChangePasswordPage.module.css";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    alert("비밀번호 변경 요청 준비 완료 (API 연동 예정)");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>비밀번호 변경</h2>

      <div className={styles.inputGroup}>
        <label>
          사용중인 비밀번호 <span className={styles.required}>*</span>
        </label>
        <input
          type="password"
          placeholder="기존 비밀번호 입력"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>
          새로운 비밀번호 <span className={styles.required}>*</span>
        </label>
        <input
          type="password"
          placeholder="새로운 비밀번호 입력(영문, 숫자 조합 8자리 이상 15자리 이하)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <input
          type="password"
          placeholder="새로운 비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button className={styles.submitBtn} onClick={handleChangePassword}>
        변경
      </button>
    </div>
  );
}

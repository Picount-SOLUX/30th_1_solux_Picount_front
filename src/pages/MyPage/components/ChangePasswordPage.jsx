import React, { useState } from "react";
import styles from "./ChangePasswordPage.module.css";
import { ChangePassword } from "../../../api/MyPageAPI";


export default function ChangePasswordPage() {
  const [prePassword, setprePassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
///////////////////비밀번호 변경 API/////////////////////////
  const handleChangePassword = async () => {
    if (!prePassword || !newPassword || !confirmPassword) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const res = await ChangePassword({ prePassword, newPassword });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "비밀번호 변경에 실패했습니다.");
    }
  };
/////////////////////비밀번호 변경 API/////////////////////////
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
          value={prePassword}
          onChange={(e) => setprePassword(e.target.value)}
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

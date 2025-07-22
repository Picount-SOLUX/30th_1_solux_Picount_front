import React, { useState } from "react";
import styles from "./FriendCodeModal.module.css";

export default function FriendCodeModal({ onClose }) {
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      alert(`친구 코드 ${code}로 추가 요청!`);
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>친구 코드 입력</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="코드를 입력하세요"
            className={styles.input}
          />
          <div className={styles.buttons}>
            <button type="submit">확인</button>
          </div>
        </form>
      </div>
    </div>
  );
}

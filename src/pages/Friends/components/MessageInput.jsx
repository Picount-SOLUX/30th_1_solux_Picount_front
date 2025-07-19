import React, { useState } from "react";
import styles from "./MessageInput.module.css";

export default function MessageInput() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    console.log("작성된 메시지:", message);
    // 여기에 추후 백엔드 POST 요청 연결 가능
    setMessage(""); // 입력창 초기화
  };

  return (
    <form onSubmit={handleSubmit} className={styles.inputBox}>
      <input
        type="text"
        placeholder="메시지를 입력하세요..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">작성</button>
    </form>
  );
}

import React, { useState } from "react";
import styles from "./MessageInput.module.css";
import api from "../../../api/axiosInstance"; // ✅ 전역 api 사용

export default function MessageInput({ ownerId, onMessageSubmit }) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const writerNickname = localStorage.getItem("nickname");
    const writerProfileImage = localStorage.getItem("profileImage");

    try {
      const res = await api.post("/guestbook", {
        ownerId: parseInt(ownerId),
        content: message,
      });

      if (res.data.success) {
        const newMsg = {
          guestbookId: res.data.data?.guestbookId || Math.random(),
          writerNickname: writerNickname || "나",
          writerProfileImage: writerProfileImage || null,
          content: message,
          createdAt: new Date().toISOString(),
        };
        onMessageSubmit(newMsg);
        setMessage("");
      } else {
        alert("작성 실패: " + res.data.message);
      }
    } catch (err) {
      console.error("작성 실패", err);
      alert("작성 요청 실패");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.inputBox}>
      <input
        type="text"
        placeholder="친구에게 방명록을 남겨보세요!"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">➤</button>
    </form>
  );
}

import React, { useState } from "react";
import styles from "./MessageInput.module.css";
import axios from "axios";

export default function MessageInput({ friendId, onMessageSubmit }) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const res = await axios.post(
        "/api/guestbook",
        {
          ownerId: parseInt(friendId),
          content: message,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        const newMsg = {
          id: res.data.guestbookId,
          nickname: "나", // 또는 내 닉네임 상태에서 가져오기
          time: new Date().toLocaleString(),
          content: message,
          profileImg: null,
        };
        onMessageSubmit(newMsg);
        setMessage("");
      } else {
        alert("작성 실패: " + res.data.message);
      }
    } catch (err) {
      alert("요청 실패");
      console.error(err);
    }
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

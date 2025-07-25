import React, { useEffect, useState } from "react";
import MessageList from "./components/MessageList";
import styles from "./GuestBooks.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GuestbookHistoryPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  // ✅ 사용자 ID와 토큰 가져오기 (예: localStorage 또는 context에서)
  const ownerId = localStorage.getItem("ownerId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`/api/guestbook/details`, {
        params: { ownerId, page: 0, size: 15 },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          setMessages(res.data.data.content);
        }
      })
      .catch((err) => {
        console.error("방명록 상세 조회 실패:", err);
      });
  }, [ownerId, token]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate("/home")}>
          &lt; 되돌아가기
        </button>
        <h3 className={styles.title}>이전 방명록</h3>
      </div>

      <MessageList messages={messages} />
    </div>
  );
}

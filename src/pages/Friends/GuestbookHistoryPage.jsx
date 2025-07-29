// GuestbookHistoryPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import getOwnerId from "../../api/getOwnerId";
import MessageListReadOnly from "./components/MessageListReadOnly"; // ✅ 새 컴포넌트 import

export default function GuestbookHistoryPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchGuestbookDetails = async () => {
      const ownerId = getOwnerId();
      if (!ownerId) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      try {
        const res = await api.get("/guestbook/details", {
          params: { ownerId, page: 0, size: 100 },
        });

        if (res.data.success) {
          setMessages(res.data.data.content);
        } else {
          console.warn("불러오기 실패", res.data.message);
        }
      } catch (err) {
        console.error("❌ 방명록 상세 조회 실패", err);
      }
    };

    fetchGuestbookDetails();
  }, [navigate]);

  return (
    <div style={{ padding: "24px" }}>
      <button
        onClick={() => navigate("/home")}
        style={{
          color: "#e25b45",
          fontWeight: "bold",
          marginBottom: "20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "0.9rem",
        }}
      >
        &lt; 되돌아가기
      </button>

      <MessageListReadOnly messages={messages} />
    </div>
  );
}

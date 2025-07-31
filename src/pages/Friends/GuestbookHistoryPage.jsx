import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import getOwnerId from "../../api/getOwnerId";
import MessageListReadOnly from "./components/MessageListReadOnly";

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
          params: {
            ownerId,
            page: 0,
            size: 3,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (res.data.success) {
          console.log("✅ 응답 확인:", res.data.data.content);
          const formatted = res.data.data.content.map((item) => ({
            id: item.guestbookId,
            senderNickname: item.writerNickname || "익명", // ✅ 작성자 닉네임
            senderProfileUrl:
              item.writerProfileImage ||
              "/images/profile/default-member-profile.png",
            createdAt: item.createdAt.slice(0, 16).replace("T", " "),
            content: item.content,
          }));

          setMessages(formatted);
        }
      } catch (err) {
        console.error("❌ 방명록 요약 조회 실패:", err.message || err);
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

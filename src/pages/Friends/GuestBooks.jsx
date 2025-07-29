import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import styles from "./Guestbooks.module.css";
import api from "../../api/axiosInstance";

export default function Guestbook({
  showInput = true,
  friendId: propFriendId,
}) {
  const { friendId: paramFriendId } = useParams(); // URL에서 온 경우
  const ownerId =
    propFriendId || paramFriendId || localStorage.getItem("ownerId");

  const [messages, setMessages] = useState([]);

  // ✅ 방명록 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/guestbook/summary`, {
          params: { ownerId, page: 0, size: 3 },
        });

        if (res.data.success) {
          setMessages(res.data.data.content);
        }
      } catch (err) {
        console.error("방명록 불러오기 실패:", err);
      }
    };

    fetchMessages();
  }, [ownerId]);

  const addMessage = (newMessage) => {
    setMessages((prev) => [newMessage, ...prev]); // 최신순 추가
  };

  return (
    <div className={styles.container}>
      <MessageList messages={messages} />
      {showInput && (
        <MessageInput ownerId={ownerId} onMessageSubmit={addMessage} />
      )}
    </div>
  );
}

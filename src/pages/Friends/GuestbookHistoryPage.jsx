import React, { useState, useEffect } from "react";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import styles from "./Guestbooks.module.css";
import api from "../../api/axiosInstance";
import { useParams } from "react-router-dom";
import getOwnerId from "../../api/getOwnerId"; // ✅ ownerId 가져오기

export default function Guestbook({
  showInput = true,
  friendId: propFriendId,
}) {
  const { friendId: paramFriendId } = useParams();
  const ownerId = propFriendId || paramFriendId || getOwnerId();

  const [messages, setMessages] = useState([]);

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
        console.error("방명록 불러오기 실패:", err.message || err);
      }
    };

    fetchMessages();
  }, [ownerId]);

  const addMessage = (newMessage) => {
    setMessages((prev) => [newMessage, ...prev]); // 최신순 추가
  };

  return (
    <div className={styles.container}>
      {showInput && (
        <MessageInput ownerId={ownerId} onMessageSubmit={addMessage} />
      )}
      <MessageList messages={messages} />
    </div>
  );
}

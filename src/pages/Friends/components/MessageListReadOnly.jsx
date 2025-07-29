// MessageListReadOnly.jsx
import React from "react";
import styles from "./MessageList.module.css";

export default function MessageListReadOnly({ messages }) {
  if (!messages.length) {
    return <div>아직 방명록이 없습니다.</div>;
  }

  return (
    <div className={styles.guestbookList}>
      {messages.map((msg) => (
        <div key={msg.id} className={styles.guestEntry}>
          <img
            src={msg.senderProfileUrl || "/assets/profile_default.png"}
            alt="프로필"
            className={styles.profileCircle}
          />
          <div className={styles.messageBubble}>
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
              {msg.senderNickname}{" "}
              <span style={{ color: "#888", fontSize: "0.8rem" }}>
                ({msg.createdAt})
              </span>
            </div>
            <div>{msg.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

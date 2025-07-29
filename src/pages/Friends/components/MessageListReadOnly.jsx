import React from "react";
import styles from "./MessageListReadOnly.module.css";

export default function MessageListReadOnly({ messages }) {
  if (!messages.length) {
    return <div className={styles.empty}>아직 방명록이 없습니다.</div>;
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
          <div className={styles.messageContent}>
            <span className={styles.nickname}>{msg.senderNickname}</span>
            <span className={styles.content}>{msg.content}</span>
            <span className={styles.time}>{msg.createdAt}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

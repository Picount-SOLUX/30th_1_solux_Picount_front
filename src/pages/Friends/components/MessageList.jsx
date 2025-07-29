import React from "react";
import MessageItem from "./MessageItem";
import styles from "./MessageList.module.css";

export default function MessageList({ messages = [] }) {
  return (
    <div className={styles.messageList}>
      {messages.length === 0 ? (
        <div className={styles.emptyMessage}>아직 방명록이 없습니다.</div>
      ) : (
        messages.map((msg) => (
          <MessageItem
            key={msg.guestbookId || msg.id} // API 응답에 따라
            nickname={msg.writerNickname || msg.nickname}
            time={
              msg.createdAt
                ? new Date(msg.createdAt).toLocaleString()
                : msg.time
            }
            content={msg.content}
            profileImg={msg.writerProfileImage || msg.profileImg}
          />
        ))
      )}
    </div>
  );
}

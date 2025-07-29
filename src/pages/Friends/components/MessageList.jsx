import React from "react";
import MessageItem from "./MessageItem";
import styles from "./MessageList.module.css";

export default function MessageList({ messages }) {
  return (
    <div className={styles.messageList}>
      {messages.map((msg) => (
        <MessageItem
          key={msg.guestbookId}
          nickname={msg.writerNickname}
          time={new Date(msg.createdAt).toLocaleString()}
          content={msg.content}
          profileImg={msg.writerProfileImage}
        />
      ))}
    </div>
  );
}

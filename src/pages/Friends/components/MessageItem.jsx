import React from "react";
import styles from "./MessageItem.module.css";

export default function MessageItem({ nickname, time, content, profileImg }) {
  return (
    <div className={styles.messageItem}>
      <div className={styles.header}>
        <div className={styles.avatar} />
        <div className={styles.meta}>
          <span className={styles.nickname}>{nickname}</span>
          <span className={styles.time}>({time})</span>
        </div>
      </div>

      <div className={styles.contentBox}>{content}</div>

      <hr className={styles.divider} />
    </div>
  );
}

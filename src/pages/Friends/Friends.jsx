import React from "react";
import Guestbook from "./GuestBooks";
import styles from "./Friends.module.css";

export default function Friends() {
  return (
    <div className={styles.container}>
      {/* 헤더 영역 */}
      <div className={styles.header}>
        <span className={styles.back}>&lt; 되돌아가기</span>
      </div>

      {/* 방명록 메시지 */}
      <div className={styles.guestbookWrapper}>
        <Guestbook />
      </div>
    </div>
  );
}

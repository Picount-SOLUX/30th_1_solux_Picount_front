import React from "react";
import Guestbook from "./GuestBooks";
import styles from "./Friends.module.css";
import { useNavigate } from "react-router-dom";

export default function Friends() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* 헤더 영역 */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate("/")}>
          &lt; 되돌아가기
        </button>
      </div>

      {/* 방명록 메시지 (작성 가능) */}
      <div className={styles.guestbookWrapper}>
        <Guestbook showInput={true} />
      </div>
    </div>
  );
}

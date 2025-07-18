import React from "react";
import styles from "./GuestbookSection.module.css";

const mockGuestbook = [
  { id: 1, name: "친구 닉네임", date: "0000-00-00 00:00" },
  { id: 2, name: "친구 닉네임", date: "0000-00-00 00:00" },
  { id: 3, name: "친구 닉네임", date: "0000-00-00 00:00" },
  { id: 4, name: "친구 닉네임", date: "0000-00-00 00:00" },
  { id: 5, name: "친구 닉네임", date: "0000-00-00 00:00" },
  { id: 6, name: "친구 닉네임", date: "0000-00-00 00:00" },
];

export default function GuestbookSection() {
  return (
    <div className={styles.guestbookSection}>
      <div className={styles.title}>내가 남긴 방명록 글</div>
      <div className={styles.box}>
        {mockGuestbook.map((entry) => (
          <div key={entry.id} className={styles.row}>
            <span className={styles.name}>{entry.name}</span>
            <span className={styles.date}>({entry.date})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

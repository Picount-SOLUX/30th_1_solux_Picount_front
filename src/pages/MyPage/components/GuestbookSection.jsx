import React from "react";
import styles from "./GuestbookSection.module.css";

const mockGuestbook = [
  {
    id: 1,
    name: "친구1",
    date: "2025.07.00",
    message: "들렀다간다",
  },
  {
    id: 2,
    name: "친구2",
    date: "2025.07.00",
    message: "굿",
  },
];

export default function GuestbookSection() {
  return (
    <div className={styles.scrollContainer}>
      <div className={styles.title}>내가 남긴 방명록</div>
      <div className={styles.guestbookList}>
        {mockGuestbook.map((entry) => (
          <div key={entry.id} className={styles.entry}>
            <div className={styles.header}>
              <span className={styles.name}>{entry.name}</span>
              <span className={styles.date}>{entry.date}</span>
            </div>
            <div className={styles.message}>{entry.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

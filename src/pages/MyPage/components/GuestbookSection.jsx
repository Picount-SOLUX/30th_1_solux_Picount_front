// src/pages/MyPage/components/GuestbookSection.jsx
import React, { useEffect, useState } from "react";
import styles from "./GuestbookSection.module.css";
import api from "../../../api/axiosInstance"; // ✅ api 인스턴스 불러오기

export default function GuestbookSection() {
  const [guestbookList, setGuestbookList] = useState([]);

  useEffect(() => {
    const fetchGuestbooks = async () => {
      try {
        const res = await api.get("/guestbook/my?page=0&size=6"); // ✅ size 조정 가능
        if (res.data.success) {
          const formatted = res.data.data.content.map((item) => ({
            id: item.guestbookId,
            name: item.ownerNickname,
            date: item.createdAt.slice(0, 16).replace("T", " "),
          }));
          setGuestbookList(formatted);
        }
      } catch (err) {
        console.error("방명록 불러오기 실패:", err);
      }
    };

    fetchGuestbooks();
  }, []);

  return (
    <div className={styles.guestbookSection}>
      <div className={styles.title}>내가 남긴 방명록 글</div>
      <div className={styles.box}>
        {guestbookList.length === 0 ? (
          <div className={styles.empty}>남긴 방명록이 없습니다.</div>
        ) : (
          guestbookList.map((entry) => (
            <div key={entry.id} className={styles.row}>
              <span className={styles.name}>{entry.name}</span>
              <span className={styles.date}>({entry.date})</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

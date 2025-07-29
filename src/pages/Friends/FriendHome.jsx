import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CakeGraph from "../Home/components/CakeGraph";
import BarGraph from "../Home/components/BarGraph";
import Calendar from "../Home/components/Calendar";
import Guestbook from "./GuestBooks";
import styles from "./FriendHome.module.css";
import api from "../../api/axiosInstance";

export default function FriendHome() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [friendData, setFriendData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        const res = await api.get(`/friends/main-page?ownerId=${friendId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setFriendData(res.data.data);
        } else {
          setErrorMessage(res.data.message || "친구 정보 조회에 실패했습니다.");
        }
      } catch (err) {
        console.error(err);
        setErrorMessage("친구 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    if (friendId) {
      fetchFriendData();
    }
  }, [friendId]);

  if (errorMessage) return <div className={styles.error}>{errorMessage}</div>;
  if (!friendData) return <div className={styles.loading}>로딩 중...</div>;

  return (
    <div className={styles.friendHome}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate("/home")}>
          ← 되돌아가기
        </button>
        <div className={styles.title}>{friendData.nickname} 님의 페이지</div>
      </div>

      {/* ✅ 방명록 먼저 표시 */}
      <div className={styles.guestbookSection}>
        <Guestbook ownerId={friendId} showInput={true} />
      </div>

      <div className={styles.graphSection}>
        <CakeGraph ownerId={friendId} />
        <BarGraph ownerId={friendId} />
      </div>

      <div className={styles.calendarSection}>
        <Calendar ownerId={friendId} isFriend={true} />
      </div>
    </div>
  );
}

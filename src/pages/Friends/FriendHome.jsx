import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CakeGraph from "../Home/components/CakeGraph";
import BarGraph from "../Home/components/BarGraph";
import Calendar from "../Home/components/Calendar";
import Guestbook from "./GuestBooks";
import styles from "./FriendHome.module.css";
import api from "../../api/axiosInstance";
import cake3 from "../../assets/cakes/BasicCake/3.png";


export default function FriendHome() {
  // 👇 컴포넌트 상단
  const dummyGraphData = {
    labels: ["식비", "쇼핑", "교통"],
    values: [40000, 30000, 20000],
  };

  const { friendId } = useParams();
  const navigate = useNavigate();
  const [friendData, setFriendData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        const res = await api.get("/friends/main-page", {
          params: { ownerId: friendId }, // ✅ 쿼리 파라미터는 params로 분리
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (res.data.success) {
          setFriendData(res.data.data);
        } else {
          setErrorMessage(res.data.message || "친구 정보 조회에 실패했습니다.");
        }
      } catch (err) {
        console.error("❌ 친구 정보 요청 중 오류 발생:", err);
        setErrorMessage("가계부를 비공개로 설정한 사용자입니다.");
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

      <div className={styles.graphSection}>
        <div className={styles.graphRow}>
          <img src={"/assets/icons/image.png"} alt="가짜 케이크 그래프" className={styles.fakeCakeGraph} />
          <BarGraph ownerId={friendId} />
        </div>
      </div>

      <div className={styles.guestbookSection}>
        <Guestbook ownerId={friendId} showInput={true} />
      </div>

      <div className={styles.calendarSection}>
        <Calendar ownerId={friendId} isFriend={true} />
      </div>

      <div className={styles.graphSection}></div>
    </div>
  );
}

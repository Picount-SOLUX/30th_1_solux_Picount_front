import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CakeGraph from "../Home/components/CakeGraph";
import BarGraph from "../Home/components/BarGraph";
import Calendar from "../Home/components/Calendar";
import Guestbook from "./GuestBooks";
import styles from "./FriendHome.module.css";

export default function FriendHome() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [friendData, setFriendData] = useState(null);

  // 가짜 데이터 (나중에 API로 교체 가능)
  const dummyData = {
    user1: {
      name: "민지",
      totalBudget: 100000,
      totalSpent: 45000,
      status: "절약왕",
    },
    user2: {
      name: "수현",
      totalBudget: 120000,
      totalSpent: 75000,
      status: "커피 마시며 일함",
    },
    user3: {
      name: "지우",
      totalBudget: 90000,
      totalSpent: 30000,
      status: "저축 1등",
    },
  };

  useEffect(() => {
    // id로 친구 데이터 가져오기
    setFriendData(dummyData[friendId]);
  }, [friendId]);

  if (!friendData) {
    return <div>존재하지 않는 친구입니다.</div>;
  }

  return (
    <div className={styles.container}>
      {/* 되돌아가기 버튼 */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate("/home")}>
          &lt; 되돌아가기
        </button>
      </div>

      {/* 그래프 영역 */}
      <div className={styles.graphSection}>
        <div className={styles.graphItem}>
          <h3>{friendData.name}님의 남은 예산</h3>
          <CakeGraph
            totalBudget={friendData.totalBudget}
            totalSpent={friendData.totalSpent}
          />
        </div>
        <div className={styles.graphItem}>
          <h3>카테고리별 지출</h3>
          <BarGraph
            categories={[]} // 친구 데이터 있으면 넣기
            totalBudget={friendData.totalBudget}
          />
        </div>
      </div>

      {/* 방명록 (작성 가능) */}
      <div className={styles.guestbookWrapper}>
        <h3>{friendData.name}님의 방명록</h3>
        <Guestbook showInput={true} friendId={friendId} />
      </div>

      {/* 달력 */}
      <div className={styles.calendarSection}>
        <Calendar isFriendView={true} friendId={friendId} />
      </div>
    </div>
  );
}

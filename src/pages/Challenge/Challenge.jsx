import React, { useEffect, useState } from "react";
import "./Challenge.css";
import { fetchMyChallenges, claimChallengeReward, fetchMyPoint, fetchMyPointHistory } from "../../api/ChallengeAPI";

export default function Challenge() {
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const typeToName = {
      ATTENDANCE: "출석 체크",
      ATTENDANCE7: "7일 연속 출석",
      ATTENDANCE30: "30일 연속 출석",
      GUESTBOOK: "방명록 작성",
      NO_SPENDING: "무지출 달성",
    };

    const typeToReward = {
      ATTENDANCE: 100,
      ATTENDANCE7: 1000,
      ATTENDANCE30: 3000,
      GUESTBOOK: 200,
      NO_SPENDING: 2000,
    };

    const loadChallenges = async () => {
      try {
        const res = await fetchMyChallenges();
        console.log("나의 챌린지 현황 조회 성공!!", res.data)
        setChallenges(res.data.data);
      } catch (err) {
        console.error("챌린지 로딩 실패", err);
        alert("챌린지를 불러오는 데 실패했습니다.");
      }
    };

    const loadPointData = async () => {
      try {
        const res = await fetchMyPoint();
        console.log("내 포인트 조회 성공!!", res.data);
        setPoints(res.data.data.point);
      } catch (err) {
        console.error("내 포인트 조회 실패", err);
      }
    };

    const loadPointHistory = async () => {
      try {
        const res = await fetchMyPointHistory();
        console.log("포인트 내역 조회 성공!!", res.data);
        const formatted = res.data.data.history.map((item) => ({
          date: formatDate(item.createdAt),
          description: convertReason(item.reason),
          amount: Number(item.amount),
        }));
        setHistory(formatted);
      } catch (err) {
        console.error("포인트 내역 조회 실패", err);
      }
    };

    loadChallenges();
    loadPointData();
    loadPointHistory();
  }, []);

  const handleClaim = async (challengeId, challengeName, challengeType) => {
    try {
      const res = await claimChallengeReward(challengeId);
      console.log("챌린지 보상 수령 성공!!", res.data)
      // rewardPoint 대신 type 기반으로 계산
      const rewardPoint = getRewardByType(challengeType);
      setPoints((prev) => prev + rewardPoint);

      const today = new Date();
      const dateStr = `${today.getMonth() + 1}.${today.getDate()}`;
      setHistory((prev) => [
        { date: dateStr, description: challengeName, amount: +rewardPoint },
        ...prev,
      ]);

      setChallenges((prev) =>
        prev.map((challenge) =>
          challenge.challengeId === challengeId
            ? { ...challenge, status: "COMPLETED" }
            : challenge
        )
      );
    } catch (err) {
      console.error("보상 수령 실패", err);
      alert("보상 수령에 실패했습니다.");
    }
  };

  return (
    <div className="challenge-wrapper">
      {/* 포인트 섹션 */}
      <section className="points-section">
        <div className="my-points-wrapper">
          <h3 className="points-title">내 포인트</h3>
          <div className="my-points-box">
            <div className="points-value">{points.toLocaleString()} p</div>
          </div>
        </div>

        <div className="points-history-wrapper">
          <h3 className="history-title">포인트 내역</h3>
          <div className="points-history-box">
            <div className="dropdown">
              <button className="dropdown-btn">전체 ▼</button>
            </div>
            <ul className="points-list">
              {history.map((item, index) => (
                <li key={index}>
                  <span>{item.date}</span>
                  <span>{item.description}</span>
                  <span className={item.amount > 0 ? "plus" : "minus"}>
                    {item.amount > 0 ? `+ ${item.amount} p` : `${item.amount} p`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 챌린지 섹션 */}
      <section className="challenges-section">
        <h3 className="challenges-title">전체 챌린지</h3>
        <ul className="challenge-list">
          {challenges.map((challenge) => (
            <li key={challenge.challengeId}>
              <span>{challenge.name}</span>
              <div className="challenge-actions">
                <span className="reward">{getRewardByType(challenge.type)}p</span>
                <button
                  className="get-btn"
                  onClick={() =>
                    handleClaim(
                      challenge.challengeId,
                      challenge.name,
                      challenge.type
                    )
                  }
                  disabled={challenge.status !== "ONGOING"}
                >
                  {challenge.status === "COMPLETED" ? "완료" : "받기"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// 보상 포인트 타입별 매핑 함수
function getRewardByType(type) {
  const rewardMap = {
    ATTENDANCE: 100,
    ATTENDANCE7: 1000,
    ATTENDANCE30: 3000,
    GUESTBOOK: 200,
    NO_SPENDING: 2000,
  };
  return rewardMap[type] || 0;
}

// reason 문자열을 한글로 변환하는 함수
function convertReason(reason) {
  const reasonMap = {
    ITEM_PURCHASE: "아이템 구매",
    BONUS: "보너스",
    CHALLENGE_REWARD: "챌린지 보상",
  };
  return reasonMap[reason] || reason;
}

// 날짜 포맷 변환 함수 (예: 7.26)
function formatDate(isoStr) {
  const date = new Date(isoStr);
  return `${date.getMonth() + 1}.${date.getDate()}`;
}

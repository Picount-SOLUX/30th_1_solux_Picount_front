import React, { useEffect, useState } from "react";
import "./Challenge.css";
import { fetchMyChallenges, claimChallengeReward } from "../../api/ChallengeAPI";

export default function Challenge() {
  const [points, setPoints] = useState(1200);
  const [history, setHistory] = useState([
    { date: "6.28", description: "케이크 꾸미기 스킨", amount: -500 },
    { date: "6.28", description: "달력 꾸미기 스킨", amount: -500 },
    { date: "6.28", description: "출석체크 하기", amount: +100 },
  ]);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const res = await fetchMyChallenges();
        setChallenges(res.data.data);
      } catch (err) {
        console.error("챌린지 로딩 실패", err);
        alert("챌린지를 불러오는 데 실패했습니다.");
      }
    };

    loadChallenges();
  }, []);

  const handleClaim = async (challengeId, challengeName, reward) => {
    try {
      await claimChallengeReward(challengeId);
      setPoints((prev) => prev + reward);

      const today = new Date();
      const dateStr = `${today.getMonth() + 1}.${today.getDate()}`;
      setHistory((prev) => [
        { date: dateStr, description: challengeName, amount: +reward },
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
                      getRewardByType(challenge.type)
                    )
                  }
                  disabled={challenge.status !== "ONGOING"}
                >
                  {challenge.status === "COMPLETED" ? "완료됨" : "받기"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// ✅ 보상 포인트 타입별 매핑 함수
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

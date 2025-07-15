import React, { useState } from "react";
import "./Challenge.css";

export default function Challenge() {
  // 현재 포인트 상태
  const [points, setPoints] = useState(1200);

  // 포인트 내역 상태
  const [history, setHistory] = useState([
    { date: "6.28", description: "케이크 꾸미기 스킨", amount: -500 },
    { date: "6.28", description: "달력 꾸미기 스킨", amount: -500 },
    { date: "6.28", description: "출석체크 하기", amount: +100 },
  ]);

  // 챌린지 상태 (포인트 받은지 여부 체크)
  const [challenges, setChallenges] = useState([
    { id: 1, title: "출석체크 하기", reward: 100, claimed: false },
    { id: 2, title: "일주일 연속 출석", reward: 1000, claimed: false },
    { id: 3, title: "30일 연속 출석", reward: 3000, claimed: false },
    { id: 4, title: "친구 홈피 방문해서 방명록 1회 남기기", reward: 200, claimed: false },
    { id: 5, title: "무지출 사유 10일 이상 남기기", reward: 2000, claimed: false },
  ]);

  // 포인트 받기 버튼 클릭 핸들러
  const handleClaim = (challengeId) => {
    // 이미 받은 챌린지는 막기
    const updatedChallenges = challenges.map((challenge) => {
      if (challenge.id === challengeId && !challenge.claimed) {
        // 포인트 추가
        setPoints((prev) => prev + challenge.reward);

        // 내역 추가
        const today = new Date();
        const dateStr = `${today.getMonth() + 1}.${today.getDate()}`;
        setHistory((prev) => [
          { date: dateStr, description: challenge.title, amount: +challenge.reward },
          ...prev,
        ]);

        // 해당 챌린지를 받은 상태로 업데이트
        return { ...challenge, claimed: true };
      }
      return challenge;
    });

    setChallenges(updatedChallenges);
  };

  return (
    <div className="challenge-wrapper">
      {/* 포인트 섹션 */}
      <section className="points-section">
        {/* 내 포인트 */}
        <div className="my-points-wrapper">
          <h3 className="points-title">내 포인트</h3>
          <div className="my-points-box">
            <div className="points-value">{points.toLocaleString()} p</div>
          </div>
        </div>

        {/* 포인트 내역 */}
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

      {/* 전체 챌린지 섹션 */}
      <section className="challenges-section">
        <h3 className="challenges-title">전체 챌린지</h3>
        <ul className="challenge-list">
          {challenges.map((challenge) => (
            <li key={challenge.id}>
              <span>{challenge.title}</span>
              <div className="challenge-actions">
                <span className="reward">{challenge.reward}p</span>
                <button
                  className="get-btn"
                  onClick={() => handleClaim(challenge.id)}
                  disabled={challenge.claimed} // 이미 받았으면 버튼 비활성화
                >
                  {challenge.claimed ? "완료" : "받기"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

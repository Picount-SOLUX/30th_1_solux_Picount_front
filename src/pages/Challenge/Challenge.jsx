import React from "react";
import "./Challenge.css";

export default function Challenge() {
  return (
    <div className="challenge-wrapper">
      {/* 포인트 섹션 */}
      <section className="points-section">
        {/* 내 포인트 */}
        <div className="my-points-wrapper">
          <h3 className="points-title">내 포인트</h3>
          <div className="my-points-box">
            <div className="points-value">1,200 p</div>
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
              <li>
                <span>6.28</span>
                <span>케이크 꾸미기 스킨</span>
                <span className="minus">- 500 p</span>
              </li>
              <li>
                <span>6.28</span>
                <span>달력 꾸미기 스킨</span>
                <span className="minus">- 500 p</span>
              </li>
              <li>
                <span>6.28</span>
                <span>출석체크 하기</span>
                <span className="plus">+ 100 p</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 전체 챌린지 섹션 */}
      <section className="challenges-section">
        <h3 className="challenges-title">전체 챌린지</h3>
        <ul className="challenge-list">
          <li>
            <span>출석체크 하기 ✅</span>
            <div className="challenge-actions">
              <span className="reward">100p</span>
              <button className="get-btn">받기</button>
            </div>
          </li>
          <li>
            <span>일주일 연속 출석 ✅</span>
            <div className="challenge-actions">
              <span className="reward">1000p</span>
              <button className="get-btn">받기</button>
            </div>
          </li>
          <li>
            <span>30일 연속 출석 ✅</span>
            <div className="challenge-actions">
              <span className="reward">3000p</span>
              <button className="get-btn">받기</button>
            </div>
          </li>
          <li>
            <span>친구 홈피 방문해서 방명록 1회 남기기 ✅</span>
            <div className="challenge-actions">
              <span className="reward">200p</span>
              <button className="get-btn">받기</button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
}

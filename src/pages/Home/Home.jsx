import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      {/* 상단 그래프 */}
      <div className="graph-section">
        {/* 케이크 그래프 */}
        <div className="cake-graph-wrapper">
          <h3 className="graph-title">남은 예산</h3>
          <div className="cake-graph">
            <div className="cake-placeholder">케이크 그래프</div>
            <p className="budget-info">
              전체 예산 000,000원 | 지출 000,000원
            </p>
            <button className="edit-btn">변경</button>
          </div>
        </div>

        {/* 막대 그래프 */}
        <div className="bar-graph-wrapper">
          <h3 className="graph-title">카테고리별 지출</h3>
          <div className="bar-graph">
            <div className="bar-list">
              <div className="bar-item">
                <span>식비</span>
                <div className="bar">
                  <div className="fill" style={{ width: "70%" }}></div>
                </div>
                <span className="amount">000,000원</span>
              </div>
              <div className="bar-item">
                <span>교통비</span>
                <div className="bar">
                  <div className="fill" style={{ width: "40%" }}></div>
                </div>
                <span className="amount">000,000원</span>
              </div>
              <div className="bar-item">
                <span>취미 생활</span>
                <div className="bar">
                  <div className="fill" style={{ width: "60%" }}></div>
                </div>
                <span className="amount">000,000원</span>
              </div>
              <div className="bar-item">
                <span>쇼핑</span>
                <div className="bar">
                  <div className="fill" style={{ width: "90%" }}></div>
                </div>
                <span className="amount">000,000원</span>
              </div>
            </div>
            <button className="edit-btn">변경</button>
          </div>
        </div>
      </div>

      {/* 방명록 */}
      <section className="guestbook-wrapper">
        <h3 className="guestbook-title">
          나의 방명록 <span className="view-record"> &gt; 이전 기록 보기</span>
        </h3>
        <div className="guestbook-section">
          <div className="guestbook-list">
            {/* 방명록 리스트 자리 */}
            <div className="guest-entry">방명록 항목</div>
            <div className="guest-entry">방명록 항목</div>
            <div className="guest-entry">방명록 항목</div>
          </div>
          <div className="guestbook-input">
            <input
              type="text"
              placeholder="친구들에게 방명록을 남겨보자!"
            />
            <button className="submit-btn">➤</button>
          </div>
        </div>

        {/* 달력 추가 */}
        <div className="calendar-section">
          <div className="calendar-placeholder">달력 자리</div>
        </div>
      </section>
    </div>
  );
}

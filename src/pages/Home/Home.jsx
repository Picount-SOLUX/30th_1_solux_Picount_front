import React from "react";
import "./Home.css";
import CakeGraph from "./components/CakeGraph";
import BarGraph from "./components/BarGraph";
import Calendar from "./components/Calendar";

export default function Home() {
  // 예산 데이터 가져오기
  const savedCategories = JSON.parse(localStorage.getItem("budgetCategories")) || [];
  const totalBudget = savedCategories.reduce(
    (sum, cat) => sum + parseInt(cat.amount || 0),
    0
  );

  // 달력이 완성되면 spent를 채울 예정
  const categoriesWithSpent = savedCategories.map((cat) => ({
    ...cat,
    spent: 0, // 달력 완성 전에는 0원으로 초기화
  }));

  const totalSpent = categoriesWithSpent.reduce(
    (sum, cat) => sum + parseInt(cat.spent || 0),
    0
  );

  return (
    <div className="home-container">
      {/* ===== 상단 그래프 영역 ===== */}
      <div className="graph-section">
        {/* 케이크 그래프 */}
        <div className="cake-graph-wrapper">
          <h3 className="graph-title">남은 예산</h3>
          <div className="cake-graph">
            <CakeGraph
              totalBudget={totalBudget}
              totalSpent={totalSpent}
            />
          </div>
        </div>

        {/* 막대 그래프 */}
        <div className="bar-graph-wrapper">
          <h3 className="graph-title">카테고리별 지출</h3>
          <div className="bar-graph">
            <BarGraph
              categories={categoriesWithSpent}
              totalBudget={totalBudget}
            />
          </div>
        </div>
      </div>

      {/* ===== 방명록 ===== */}
      <section className="guestbook-wrapper">
        <h3 className="guestbook-title">
          나의 방명록 <span className="view-record">&gt; 이전 기록 보기</span>
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
          <Calendar />
        </div>
      </section>
    </div>
  );
}

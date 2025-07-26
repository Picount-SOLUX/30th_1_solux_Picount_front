import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import CakeGraph from "./components/CakeGraph";
import BarGraph from "./components/BarGraph";
import Calendar from "./components/Calendar";
import axios from "axios";
import { useState, useEffect } from "react";
import MessageList from "../Friends/components/MessageList";

export default function Home() {
  const navigate = useNavigate();

  // 예산 데이터 가져오기
  const savedCategories =
    JSON.parse(localStorage.getItem("budgetCategories")) || [];
  const totalBudget = savedCategories.reduce(
    (sum, cat) => sum + parseInt(cat.amount || 0),
    0
  );

  // 달력이 완성되면 spent를 채울 예정
  const categoriesWithSpent = savedCategories.map((cat) => ({
    ...cat,
    spent: 0,
  }));

  const totalSpent = categoriesWithSpent.reduce(
    (sum, cat) => sum + parseInt(cat.spent || 0),
    0
  );

  const [guestbookData, setGuestbookData] = useState([]);

  useEffect(() => {
    const fetchGuestbooks = async () => {
      try {
        const ownerId = localStorage.getItem("ownerId");
        const res = await axios.get(
          `/api/guestbook/summary?ownerId=${ownerId}&page=0&size=3`
        );
        if (res.data.success) {
          setGuestbookData(res.data.data.content);
        }
      } catch (err) {
        console.error("방명록 불러오기 실패:", err);
      }
    };

    fetchGuestbooks();
  }, []);

  return (
    <div className="home-container">
      {/* ===== 상단 그래프 영역 ===== */}
      <div className="graph-section">
        <div className="cake-graph-wrapper">
          <h3 className="graph-title">남은 예산</h3>
          <div className="cake-graph">
            <CakeGraph totalBudget={totalBudget} totalSpent={totalSpent} />
          </div>
        </div>

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
        <div className="guestbook-title-wrapper">
          <span className="guestbook-title">나의 방명록</span>
          <span className="guestbook-separator">&gt;</span>
          <button
            className="view-record-btn"
            onClick={() => navigate("/guestbook/history")}
          >
            이전 기록 보기
          </button>
        </div>

        <MessageList messages={guestbookData} />

        {/* <div className="guestbook-list">
          {guestbookData.map((entry) => (
            <div key={entry.guestbookId} className="guest-entry">
              <img src={entry.writerProfileImage} alt="profile" />
              <span>{entry.content}</span>
            </div>
          ))}
        </div> */}

        {/* ===== 달력 영역 ===== */}
        <div className="calendar-section">
          <Calendar />
        </div>
      </section>
    </div>
  );
}

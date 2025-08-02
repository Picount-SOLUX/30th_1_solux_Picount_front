import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import CakeGraph from "./components/CakeGraph";
import BarGraph from "./components/BarGraph";
import Calendar from "./components/Calendar";
import axios from "axios";
import { useState, useEffect } from "react";
import MessageListReadOnly from "../Friends/components/MessageListReadOnly";
import getOwnerId from "../../api/getOwnerId";
import api from "../../api/axiosInstance";

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
        const ownerId = localStorage.getItem("memberId");
        if (!ownerId) {
          console.warn("⛔ ownerId 없음. 로그인 필요");
          return;
        }

        const res = await api.get("/guestbook/details", {
          params: {
            ownerId,
            page: 0,
            size: 3,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        console.log("📌 ownerId:", ownerId);
        console.log("📌 accessToken:", localStorage.getItem("accessToken"));
        console.log("📌 요청 보내는 중...");
        if (res.data.success) {
          console.log("✅ 응답 확인:", res.data.data.content);
          const formatted = res.data.data.content.map((item) => ({
            id: item.guestbookId,
            senderNickname: item.writerNickname || "익명", // ✅ 작성자 닉네임
            senderProfileUrl:
              item.writerProfileImage ||
              "/images/profile/default-member-profile.png",
            createdAt: item.createdAt.slice(0, 16).replace("T", " "),
            content: item.content,
          }));

          setGuestbookData(formatted);
        }
      } catch (err) {
        console.error("❌ 방명록 요약 조회 실패:", err.message || err);
      }
    };

    fetchGuestbooks();
  }, []);

  const [mySkins, setMySkins] = useState([]);

  const applySkin = (skin) => {
    localStorage.setItem("calendarSkin", skin.previewImageUrl);
    window.location.reload(); // 또는 Context API 쓰는 경우엔 setSkin 호출
  };

  useEffect(() => {
    const fetchPurchasedSkins = async () => {
      try {
        const res = await api.get("/items/purchases/me");
        if (res.data.success) {
          const calendarSkins = res.data.data.filter(
            (item) => item.category === "CALENDAR_SKIN"
          );
          setMySkins(calendarSkins);
        }
      } catch (err) {
        console.error("❌ 스킨 목록 불러오기 실패:", err);
      }
    };

    fetchPurchasedSkins();
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

        <div className="guestbook-list-wrapper">
          {guestbookData.length > 0 ? (
            <MessageListReadOnly messages={guestbookData} />
          ) : (
            <div className="guestbook-empty-box">
              <div className="empty-text">아직 방명록이 없습니다.</div>
            </div>
          )}
        </div>

        <div className="calendar-section">
          <Calendar />
        </div>
      </section>
      <div className="skin-modal">
        {mySkins.map((skin) => (
          <div
            key={skin.itemId}
            className="skin-item"
            onClick={() => applySkin(skin)}
          >
            <img
              src={`/assets/ShopItems/CalendarSkin/${skin.previewImageUrl}`}
              alt={skin.name}
            />
            <div>{skin.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import CakeGraph from "./components/CakeGraph";
import BarGraphContainer from "./components/BarGraphContainer"; // ✅ 경로 맞게
import Calendar from "./components/Calendar";
import axios from "axios";
import { useState, useEffect } from "react";
import MessageListReadOnly from "../Friends/components/MessageListReadOnly";
import getOwnerId from "../../api/getOwnerId";
import api from "../../api/axiosInstance";
import InputModal from "./components/InputModal"; // ✅ 모달 import 추가

export default function Home() {
  const navigate = useNavigate();

  const [reloadKey, setReloadKey] = useState(0); // ✅ BarGraph 리렌더용
  const [showInputModal, setShowInputModal] = useState(false); // ✅ 모달 제어용

  // 예산 데이터 가져오기
  const savedCategories =
    JSON.parse(localStorage.getItem("budgetCategories")) || [];
  const totalBudget = savedCategories.reduce(
    (sum, cat) => sum + parseInt(cat.amount || 0),
    0
  );

  // ** 여기가 수정된 부분: localStorage 'localEntries'에서 지출 합산하여 spent 계산 **
  const localEntries = JSON.parse(localStorage.getItem("localEntries") || "{}");
  const spentMap = {};
  Object.values(localEntries).forEach((entry) => {
    entry.entries?.forEach((item) => {
      if (item.type === "expense") {
        spentMap[item.category] = (spentMap[item.category] || 0) + item.amount;
      }
    });
  });

  const categoriesWithSpent = savedCategories.map((cat) => ({
    ...cat,
    spent: spentMap[cat.name] || 0,
  }));

  const totalSpent = categoriesWithSpent.reduce(
    (sum, cat) => sum + cat.spent,
    0
  );

  // 이하 기존 코드 유지

  const [guestbookData, setGuestbookData] = useState([]);
  useEffect(() => {
    const fetchGuestbooks = async () => {
      try {
        const ownerId = localStorage.getItem("userId");
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

        if (res.success) {
          console.log("방명록 조회 API 들어가기 직전");
          console.log("방명록 조회 확인:", res.data.data.content);
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
            <BarGraphContainer
              key={reloadKey} // ✅ reloadKey로 강제 리렌더링
              budgetCategories={categoriesWithSpent}
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

      {/* ===== InputModal 모달 추가 부분 (수정) ===== */}
      {showInputModal && (
        <InputModal
          onClose={() => setShowInputModal(false)}
          onSubmit={() => {
            setReloadKey((prev) => prev + 1); // BarGraph 리렌더용 갱신 트리거
            setShowInputModal(false); // 모달 닫기
          }}
        />
      )}
    </div>
  );
}

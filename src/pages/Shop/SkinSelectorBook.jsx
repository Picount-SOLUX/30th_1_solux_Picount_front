import React, { useState } from "react";
import "./SkinSelectorBook.module.css";

const categories = ["케이크 꾸미기 스킨", "달력 꾸미기 스킨", "테마 색상 변경"];

export default function SkinBookModal({ ownedItems, onApply, onClose }) {
  const [pageIndex, setPageIndex] = useState(0); // 현재 페이지 (카테고리)
  const [tempSkin, setTempSkin] = useState(null); // 선택된 스킨

  const category = categories[pageIndex];

  const normalizedCategory = (raw) => {
    if (raw.includes("케이크")) return "케이크 꾸미기 스킨";
    if (raw.includes("달력")) return "달력 꾸미기 스킨";
    if (raw.includes("테마")) return "테마 색상 변경";
    return raw;
  };

  const itemsForCategory = ownedItems.filter(
    (item) => normalizedCategory(item.category) === category
  );

  const nameMap = {
    "체리 케이크": "cherry",
    "파란색 케이크": "blue",
    "초코 케이크": "choco",
    "딸기 케이크": "strawberry",
    "토마토 달력": "tomato",
    "천사 달력": "angel",
    "왕관 달력": "tiara",
    "창 달력": "chang",
    "노란색 웹": "yellow",
    "파란색 웹": "blue",
    "초록색 웹": "green",
    "회색 웹": "gray",
  };

  // 🧠 전용 미리보기 이미지 경로 생성 함수
  const getPreviewImage = (item) => {
    const key = nameMap[item.name];
    if (!key) return "/previewSkins/default.png";

    const categoryKey = normalizedCategory(item.category);

    if (categoryKey === "케이크 꾸미기 스킨") {
      return `/previewSkins/preview-cake-${key}.png`;
    } else if (categoryKey === "달력 꾸미기 스킨") {
      return `/previewSkins/preview-calendar-${key}.png`;
    } else if (categoryKey === "테마 색상 변경") {
      return `/previewSkins/preview-theme-${key}.png`;
    }

    return "/previewSkins/default.png";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="book-modal" onClick={(e) => e.stopPropagation()}>
        {/* 좌우 화살표 */}
        <button
          className="arrow left"
          onClick={() =>
            setPageIndex(
              (prev) => (prev - 1 + categories.length) % categories.length
            )
          }
        >
          〈
        </button>

        <div className="Spring spring1" />
        <div className="Spring spring2" />
        <div className="spring spring3" />
        <div className="spring spring4" />

        {/* 책자 내부 페이지 */}
        <div className="pages">
          {/* 왼쪽 페이지 */}
          <div className="book-page left-page">
            {tempSkin ? (
              <img
                src={getPreviewImage(tempSkin)}
                alt="선택 스킨"
                className="book-cake-image"
                onError={(e) => {
                  e.target.src = "/previewSkins/default.png";
                }}
              />
            ) : (
              <div className="empty-preview">스킨을 선택하세요</div>
            )}
          </div>

          {/* 오른쪽 페이지 */}
          <div className="book-page right-page">
            <h3>{category}</h3>
            <div className="skin-list">
              {itemsForCategory.length === 0 ? (
                <p>보유한 스킨이 없습니다.</p>
              ) : (
                itemsForCategory.map((item) => (
                  <div
                    key={item.itemId || item.id}
                    className={`skin-item ${
                      tempSkin?.itemId === item.itemId ? "selected" : ""
                    }`}
                    onClick={() => setTempSkin(item)}
                  >
                    <img
                      src={item.imageUrl || item.image}
                      alt={item.name}
                      className="skin-image"
                    />
                  </div>
                ))
              )}
            </div>
            <button
              className="apply-btn"
              onClick={() => {
                if (tempSkin) {
                  onApply(tempSkin, category);
                  onClose();
                }
              }}
            >
              적용
            </button>
          </div>
        </div>

        <button
          className="arrow right"
          onClick={() => setPageIndex((prev) => (prev + 1) % categories.length)}
        >
          〉
        </button>

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}

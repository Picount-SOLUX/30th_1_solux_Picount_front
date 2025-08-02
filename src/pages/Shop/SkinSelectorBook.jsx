import React, { useState } from "react";
import "../Home/components/CakeGraph.css"; // 스프링/책자 스타일 재사용

const categories = ["케이크 꾸미기 스킨", "달력 꾸미기 스킨", "테마 색상 변경"];

export default function SkinBookModal({ ownedItems, onApply, onClose }) {
  const [pageIndex, setPageIndex] = useState(0); // 현재 페이지 (카테고리)
  const [tempSkin, setTempSkin] = useState(null); // 선택된 스킨

  const category = categories[pageIndex];

  const itemsForCategory = ownedItems.filter(
    (item) => item.category === category
  );

  // 🧠 전용 미리보기 이미지 경로 생성 함수
  const getPreviewImage = (item) => {
    if (!item?.name || !item?.category) return "/previewSkins/default.png";

    const name = item.name.toLowerCase().replace(/\s+/g, "-");

    if (item.category === "케이크 꾸미기 스킨") {
      return `/previewSkins/preview-cake-${name}.png`;
    } else if (item.category === "달력 꾸미기 스킨") {
      return `/previewSkins/preview-calendar-${name}.png`;
    } else if (item.category === "테마 색상 변경") {
      return `/previewSkins/preview-theme-${name}.png`;
    }

    return "/previewSkins/default.png";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="book-modal" onClick={(e) => e.stopPropagation()}>
        {/* 스프링 이미지 (장식용) */}
        {[1, 2, 3, 4].map((n) => (
          <img
            key={n}
            className={`spring${n}`}
            src="src/assets/cakes/Spring.png"
            alt="spring"
          />
        ))}

        {/* 책자 내용 */}
        <div className="pages">
          {/* 왼쪽 페이지: 전용 미리보기 이미지 */}
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

          {/* 오른쪽 페이지: 아이템 리스트 + 적용 버튼 */}
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

        {/* 좌우 화살표 버튼 */}
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
        <button
          className="arrow right"
          onClick={() => setPageIndex((prev) => (prev + 1) % categories.length)}
        >
          〉
        </button>

        {/* 닫기 버튼 */}
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}

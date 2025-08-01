import React, { useState } from "react";
import "../Home/components/CakeGraph.css"; // 기존 스타일 재사용

const categories = ["케이크 꾸미기 스킨", "달력 꾸미기 스킨", "테마 색상 변경"];

export default function SkinBookModal({ ownedItems, onApply, onClose }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [tempSkin, setTempSkin] = useState(null);

  const category = categories[pageIndex];
  const itemsForCategory = ownedItems.filter(
    (item) => item.category === category
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="book-modal" onClick={(e) => e.stopPropagation()}>
        {/* 스프링 */}
        {[1, 2, 3, 4].map((n) => (
          <img
            key={n}
            className={`spring${n}`}
            src="src/assets/cakes/Spring.png"
            alt="spring"
          />
        ))}

        <div className="pages">
          {/* 왼쪽 페이지 */}
          <div className="book-page left-page">
            {tempSkin ? (
              <img
                src={tempSkin.imageUrl || tempSkin}
                alt="선택 스킨"
                className="book-cake-image"
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

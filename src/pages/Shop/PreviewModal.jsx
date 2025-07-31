import React, { useState } from "react";
import "./PreviewModal.css";

const categories = ["케이크 꾸미기 스킨", "달력 꾸미기 스킨", "테마 색상 변경"];

export default function PreviewModal({ items, onClose }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [selected, setSelected] = useState(null);

  const category = categories[pageIndex];
  const ownedItems = items.filter((item) => item.category === category);

  const handleApply = () => {
    if (!selected) return;
    // 실제 스킨/테마 적용 로직 추가 가능
    alert(`"${selected.name}" 스킨이 미리보기로 적용됩니다`);
    onClose(); // 적용 후 모달 닫기
  };

  return (
    <div className="preview-overlay">
      <div className="preview-book">
        {/* 왼쪽: 큰 미리보기 */}
        <div className="preview-left">
          <h4>{category} 변경</h4>
          {selected ? (
            <img
              src={selected.image}
              alt={selected.name}
              className="big-preview"
            />
          ) : (
            <div className="empty-preview">스킨을 선택하세요</div>
          )}
        </div>

        {/* 오른쪽: 보유 스킨 리스트 */}
        <div className="preview-right">
          <h4>보유 스킨</h4>
          <div className="skin-grid">
            {ownedItems.map((item) => (
              <img
                key={item.itemId}
                src={item.image}
                alt={item.name}
                className={`mini-skin ${
                  selected?.itemId === item.itemId ? "selected" : ""
                }`}
                onClick={() => setSelected(item)}
              />
            ))}
          </div>
          <button onClick={handleApply} className="apply-btn">
            적용
          </button>
        </div>

        {/* 좌우 화살표 */}
        <button
          className="arrow left"
          onClick={() =>
            setPageIndex(
              (pageIndex - 1 + categories.length) % categories.length
            )
          }
        >
          〈
        </button>
        <button
          className="arrow right"
          onClick={() => setPageIndex((pageIndex + 1) % categories.length)}
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

import React from "react";

export default function CategoryList({
  isEditing,
  categories,
  handleInputChange,
  totalBudget,
  categoryOptions = [], // 드롭다운 목록 추가
}) {
  return (
    <div className="category-list">
      {categories.map((cat) => {
        const percent =
          totalBudget > 0
            ? (parseInt(cat.amount || 0) / totalBudget) * 100
            : 0;

        return (
          <div key={cat.id} className="category-item">
            {isEditing ? (
              <>
                <select
                  value={cat.name}
                  onChange={(e) =>
                    handleInputChange(cat.id, "name", e.target.value)
                  }
                  className="category-select name-input"
                >
                  <option value="">카테고리 선택</option>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <div className="category-controls">
                  <input
                    type="number"
                    value={cat.amount}
                    onChange={(e) =>
                      handleInputChange(cat.id, "amount", e.target.value)
                    }
                    className="category-input amount-input"
                  />
                </div>
              </>
            ) : (
              <>
                <span className="category-name">{cat.name}</span>
                <span className="category-amount">
                  {parseInt(cat.amount).toLocaleString()}원
                </span>
                <span className="category-percent">
                  ({percent.toFixed(1)}%)
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

import React from "react";

export default function CategoryList({
  isEditing,
  categories,
  handleInputChange,
  handleAddCategory,
  handleDeleteCategory,
  newCategory,
  setNewCategory,
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
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteCategory(cat.id)}
                    title="삭제"
                  >
                    삭제
                  </button>
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

      {isEditing && (
        <div className="category-item add-category-row">
          <select
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
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
              value={newCategory.amount}
              placeholder="금액"
              onChange={(e) =>
                setNewCategory({ ...newCategory, amount: e.target.value })
              }
              className="category-input amount-input"
            />
            <button
              className="add-btn"
              onClick={handleAddCategory}
              title="카테고리 추가"
            >
              추가
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
import DatePicker from "react-datepicker";
import CategoryList from "./CategoryList";

export default function BudgetDetail({
  isEditing,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  handleEditClick,
  handleSaveClick,
  categories,
  tempCategories,
  handleInputChange,
  handleAddCategory,
  handleDeleteCategory,
  newCategory,
  setNewCategory,
  totalBudget,
  categoryOptions,
}) {
  const displayCategories = isEditing ? tempCategories : categories;

  return (
    <section className="budget-detail-section">
      <div className="detail-header">
        <h2 className="section-title">세부 예산</h2>

        <div className="date-picker-wrapper">
          <label>기간 선택 </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy-MM-dd"
          />
          <span> ~ </span>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy-MM-dd"
          />
        </div>

        {!isEditing ? (
          <button className="edit-btn" onClick={handleEditClick}>
            ✏️ 수정
          </button>
        ) : (
          <button className="save-btn" onClick={handleSaveClick}>
            💾 저장
          </button>
        )}
      </div>

      <CategoryList
        isEditing={isEditing}
        categories={displayCategories}
        handleInputChange={handleInputChange}
        handleAddCategory={handleAddCategory}
        handleDeleteCategory={handleDeleteCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        totalBudget={totalBudget}
        categoryOptions={categoryOptions}
      />
    </section>
  );
}

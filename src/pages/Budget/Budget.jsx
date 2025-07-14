import React, { useState } from "react";
import "./Budget.css";

export default function Budget() {
  const defaultCategories = [
    { id: 1, name: "식비", amount: "0" },
    { id: 2, name: "교통비", amount: "0" },
    { id: 3, name: "취미", amount: "0" },
    { id: 4, name: "쇼핑", amount: "0" },
    { id: 5, name: "고정비", amount: "0" },
    { id: 6, name: "저축", amount: "0" },
    { id: 7, name: "기타", amount: "0" },
  ];

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("budgetCategories");
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempCategories, setTempCategories] = useState([...categories]);
  const [newCategory, setNewCategory] = useState({ name: "", amount: "" });
  const [showHelp, setShowHelp] = useState(false); // 도움말 상태

  const getTotalBudget = (list) =>
    list.reduce((sum, cat) => sum + parseInt(cat.amount || 0), 0);

  const totalBudget = isEditing
    ? getTotalBudget(tempCategories)
    : getTotalBudget(categories);

  const handleEditClick = () => {
    setIsEditing(true);
    setTempCategories([...categories]);
  };

  const handleSaveClick = () => {
    setCategories([...tempCategories]);
    localStorage.setItem("budgetCategories", JSON.stringify(tempCategories));
    setIsEditing(false);
  };

  const handleInputChange = (id, field, value) => {
    setTempCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    );
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    const nextId =
      tempCategories.length > 0
        ? Math.max(...tempCategories.map((c) => c.id)) + 1
        : 1;
    const newCat = {
      id: nextId,
      name: newCategory.name,
      amount: newCategory.amount || "0",
    };
    setTempCategories([...tempCategories, newCat]);
    setNewCategory({ name: "", amount: "" });
  };

  const handleDeleteCategory = (id) => {
    setTempCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  const jobData = [
    {
      title: "📌 직장인",
      description:
        "고정지출과 외식/회식 중심의 소비가 많기 때문에, 예산은 주로 이렇게 분배해요!",
      budgets: [
        { label: "식비", percent: 25, className: "food" },
        { label: "고정지출", percent: 25, className: "fixed" },
        { label: "교통", percent: 10, className: "trans" },
        { label: "자기관리", percent: 15 },
        { label: "모임", percent: 15 },
        { label: "저축", percent: 10 },
      ],
    },
    {
      title: "📌 학생",
      description:
        "학생은 소액 소비와 친구들과의 모임이나 문화생활 지출이 두드러져요!",
      budgets: [
        { label: "식비", percent: 30, className: "food" },
        { label: "쇼핑", percent: 15, className: "shopping" },
        { label: "교통", percent: 15, className: "trans" },
        { label: "문화", percent: 20 },
        { label: "모임", percent: 15 },
        { label: "기타", percent: 5 },
      ],
    },
    {
      title: "📌 전업주부",
      description:
        "가족 단위의 소비를 중심으로, 식비와 생활용품 지출이 큰 비중을 차지해요.",
      budgets: [
        { label: "식비", percent: 35, className: "food" },
        { label: "생활용품", percent: 20, className: "living" },
        { label: "교통", percent: 10, className: "trans" },
        { label: "자녀", percent: 15 },
        { label: "기타", percent: 5 },
        { label: "고정비", percent: 15, className: "fixed" },
      ],
    },
    {
      title: "📌 프리랜서",
      description:
        "프리랜서는 소득이 유동적인 만큼, 자기관리 및 업무 관리 지출, 저축 항목의 비중이 중요해요!",
      budgets: [
        { label: "식비", percent: 20, className: "food" },
        { label: "업무비(장비)", percent: 20 },
        { label: "자기관리", percent: 15 },
        { label: "저축", percent: 20, className: "saving" },
        { label: "기타", percent: 5 },
        { label: "고정지출", percent: 10, className: "fixed" },
      ],
    },
  ];

  return (
    <div className="budget-wrapper">
      {/* 상단 예산 그래프 */}
      <section className="budget-graph-section">
        <div className="graph-header">
          <h2 className="section-title">예산 설정 내역</h2>
          <span
            className="help-icon"
            onClick={toggleHelp}
            title="도움말 보기"
          >
            ❓
          </span>
        </div>

        {showHelp && (
          <div className="help-bubble">
            <h4>도움말</h4>
            <p>직업별 추천 예산 비율입니다:</p>

            <div className="budget-bar-graph">
              {jobData.map((job, idx) => (
                <div key={idx} className="job-graph">
                  <h5>{job.title}</h5>
                  <p>{job.description}</p>
                  <div className="bar-container">
                    {job.budgets.map((item, i) => (
                      <div
                        key={i}
                        className={`bar-segment ${item.className || ""}`}
                        style={{ width: `${item.percent}%` }}
                        title={`${item.label}: ${item.percent}%`}
                      >
                        <span className="bar-label">
                          {item.label} {item.percent}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button className="close-btn" onClick={toggleHelp}>
              닫기
            </button>
          </div>
        )}

        <div className="budget-graph">
          {/* 그래프 코드 */}
          <div className="graph-bar">
            {(isEditing ? tempCategories : categories).map((cat, idx) => {
              const percent =
                totalBudget > 0
                  ? (parseInt(cat.amount || 0) / totalBudget) * 100
                  : 0;
              return (
                <div
                  key={idx}
                  className="graph-segment"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: `hsl(${idx * 50}, 70%, 70%)`,
                  }}
                  title={`${cat.name}: ${cat.amount}원 (${percent.toFixed(
                    1
                  )}%)`}
                ></div>
              );
            })}
          </div>
          <div className="graph-total">
            총예산: {totalBudget.toLocaleString()}원
          </div>
        </div>
      </section>

      {/* 하단 세부 예산 */}
      <section className="budget-detail-section">
        <div className="detail-header">
          <h2 className="section-title">세부 예산</h2>
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

        <div className="category-list">
          {(isEditing ? tempCategories : categories).map((cat) => {
            const percent =
              totalBudget > 0
                ? (parseInt(cat.amount || 0) / totalBudget) * 100
                : 0;
            return (
              <div key={cat.id} className="category-item">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) =>
                        handleInputChange(cat.id, "name", e.target.value)
                      }
                      className="category-input name-input"
                    />
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
              <input
                type="text"
                value={newCategory.name}
                placeholder="새 카테고리 이름"
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="category-input name-input"
              />
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
      </section>
    </div>
  );
}

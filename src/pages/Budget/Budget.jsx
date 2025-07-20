import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker"; // 📦 달력
import "react-datepicker/dist/react-datepicker.css"; // 📦 스타일
import "./Budget.css";

export default function Budget() {
  const jobData = [
    {
      title: "중·고등학생",
      description: "소액 소비와 식비, 교재비 지출 중심의 예산 추천입니다.",
      budgets: [
        { label: "식비", percent: 30 },
        { label: "교통비", percent: 15 },
        { label: "교재비", percent: 30 },
        { label: "쇼핑/문화", percent: 10 },
        { label: "기타", percent: 15 },
      ],
    },
    {
      title: "대학생",
      description:
        "식비와 월세 등의 고정비, 모임 비중이 높으며 저축도 고려한 예산입니다.",
      budgets: [
        { label: "식비", percent: 25 },
        { label: "교통비", percent: 10 },
        { label: "고정비(월세)", percent: 20 },
        { label: "모임/약속", percent: 15 },
        { label: "쇼핑/문화", percent: 10 },
        { label: "저축", percent: 10 },
        { label: "기타", percent: 10 },
      ],
    },
    {
      title: "전업주부",
      description: "가족 중심 소비 패턴에 최적화된 예산 추천입니다.",
      budgets: [
        { label: "식비", percent: 35 },
        { label: "생활용품", percent: 25 },
        { label: "자녀교육", percent: 15 },
        { label: "교통비", percent: 10 },
        { label: "저축", percent: 10 },
        { label: "기타", percent: 5 },
      ],
    },
    {
      title: "2030대 직장인",
      description: "고정지출과 저축을 균형있게 고려한 예산 추천입니다.",
      budgets: [
        { label: "식비", percent: 25 },
        { label: "고정비", percent: 30 },
        { label: "교통비", percent: 10 },
        { label: "취미/자기계발", percent: 10 },
        { label: "저축/투자", percent: 20 },
        { label: "기타", percent: 5 },
      ],
    },
    {
      title: "4050대 직장인",
      description: "고정지출과 자녀교육 지출 비중이 큰 예산 추천입니다.",
      budgets: [
        { label: "식비", percent: 20 },
        { label: "고정지출", percent: 35 },
        { label: "자녀교육", percent: 20 },
        { label: "저축/투자", percent: 20 },
        { label: "기타", percent: 5 },
      ],
    },
    {
      title: "프리랜서",
      description: "유동적인 소득에 맞춘 예산 분배를 고려했습니다.",
      budgets: [
        { label: "식비", percent: 20 },
        { label: "업무비(장비 등)", percent: 20 },
        { label: "고정지출", percent: 15 },
        { label: "저축/투자", percent: 20 },
        { label: "자기계발", percent: 15 },
        { label: "기타", percent: 10 },
      ],
    },
    {
      title: "기타",
      description: "일반적인 상황에 맞춘 기본 예산 추천입니다.",
      budgets: [
        { label: "식비", percent: 20 },
        { label: "고정지출", percent: 20 },
        { label: "저축", percent: 20 },
        { label: "기타", percent: 40 },
      ],
    },
  ];

  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempCategories, setTempCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", amount: "" });
  const [showHelp, setShowHelp] = useState(true);

  // 🔥 날짜 상태 추가
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  ); // 기본: 오늘부터 한 달

  const selectedJob = localStorage.getItem("selectedJob");
  const selectedBudget = parseInt(
    localStorage.getItem("selectedBudget")?.replace(/[^0-9]/g, "") || "0"
  );

  const jobInfo = jobData.find((job) => job.title === selectedJob);

  // 🔥 InfoSteps 값으로 기본 예산 세팅
  useEffect(() => {
    if (jobInfo && selectedBudget > 0) {
      const initializedCategories = jobInfo.budgets.map((item, idx) => ({
        id: idx + 1,
        name: item.label,
        amount: Math.round((selectedBudget * item.percent) / 100).toString(),
      }));
      setCategories(initializedCategories);
      localStorage.setItem(
        "budgetCategories",
        JSON.stringify(initializedCategories)
      );
    }
  }, [selectedJob, selectedBudget]); // ✅ 값 바뀔 때마다 실행

  // 🔥 endDate가 지났을 때 카테고리 초기화
  useEffect(() => {
    const now = new Date();
    if (endDate < now) {
      setCategories([]);
      localStorage.removeItem("budgetCategories");
    }
  }, [endDate]);

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

  return (
    <div className="budget-wrapper">
      <section className="budget-graph-section">
        <div className="graph-header">
          <h2 className="section-title">예산 설정 내역</h2>
          <span
            className="help-icon"
            onClick={toggleHelp}
            title="추천 예산 보기"
          >
            ❓
          </span>
        </div>

        {showHelp && jobInfo && (
          <div className="help-bubble">
            <h4>{jobInfo.title} 추천 예산안</h4>
            <p>{jobInfo.description}</p>
            <button onClick={toggleHelp} className="close-btn">
              닫기
            </button>
          </div>
        )}

        <div className="budget-graph">
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

      <section className="budget-detail-section">
        <div className="detail-header">
          <h2 className="section-title">세부 예산</h2>

          {/* 🔥 날짜 지정 */}
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

          {/* 수정/저장 버튼 */}
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
